'use strict';

const Service = require('egg').Service;
const BuddhaClient = require('../client/java-buddha-biz');
const WorkflowClient = require('../client/java-workflow-biz');

/**
 * @description 账务
 * @author virgoheRomAn
 * @date 2023-03-09
 */
class BuddhaService extends Service {
	/**
	 * @description 债转信息详情（合通业务）
	 * @param {String} id id
	 * @returns
	 */
	async debtTransferTdDetail(params) {
		const { ctx } = this;
		return await BuddhaClient.debtTransferTdDetail(ctx, params);
	}

	/**
	 * @description 债转文件解析验证（合通业务）
	 * @param {String} attachment_60 债转协议
	 * @param {String} attachment_61 债转清单
	 * @param {String} date 日期
	 * @returns
	 */
	async debtTransferTdParse(params) {
		const { ctx } = this;
		return await BuddhaClient.debtTransferTdParse(ctx, params);
	}

	/**
	 * @description 创建债转信息（合通业务）
	 * @param {String} attachment_60 债转协议
	 * @param {String} attachment_61 债转清单
	 * @param {String} date 批次号
	 * @param {String} operatorId 操作员ID
	 * @param {String} operatorName 操作员姓名
	 * @returns
	 */
	async debtTransferTdCreate(params) {
		const { ctx } = this;
		const { operatorId, operatorName } = ctx.session;
		params.operatorId = operatorId;
		params.operatorName = operatorName;

		// 创建债转
		const rs = await BuddhaClient.debtTransferTdCreate(ctx, params);
		const data = rs.data;

		// 启动流程
		const processOpts = {
			processDefinitionKey: 'ycxd_ht_debt_transfer',
			businessKey: data.id,
			startUserId: operatorId,
			tenantId: 'YCXD',
			variables: {
				createId: operatorId,
				createName: operatorName,
				businessKey: data.id,
				taskDescription: `合通业务债转申请-${params.date}`
			}
		};

		const task = await WorkflowClient.workflowStartProcess(ctx, processOpts);

		// 保存审批列表
		const recordParams = {
			formKey: 'ycxd_ht_debt_transfer_start_form',
			optionDesc: '债转申请',
			optionResultCode: '',
			optionResultDesc: '债转申请',
			optionTypeCode: '0',
			optionUser: operatorName,
			optionUserId: operatorId,
			orderId: data.id,
			processInstanceId: task.data.processInstanceId,
			taskName: '启动工作流',
			formContent: JSON.stringify(params)
		};

		await WorkflowClient.addAuditRecord(ctx, recordParams);

		return ctx.success(data);
	}

	/**
	 * @description 债转审批
	 * @param {String} attachment_60 债转协议
	 * @param {String} attachment_61 债转清单
	 * @param {String} date 日期
	 * @returns
	 */
	async debtTransferTdApproval(params) {
		const { ctx } = this;
		const { step, form, workflow } = params;

		// 修改订单的返回结果
		let result = {};

		// 先获取当前任务是否还存在
		const taskInfo = await WorkflowClient.queryTaskInfo(ctx, { taskId: workflow.taskId });
		if (taskInfo.code !== 'SUCCESS') {
			throw ctx.creatError('BUSINESS_ERROR', '任务已结束!');
		}

		// 没有步骤信息
		if (!step) {
			throw ctx.creatError('BUSINESS_ERROR', '保存异常，没有保存步骤信息!');
		}

		// 步骤信息 [当前操作 | 当前操作描述 | 是否验证表单 | 是否保存表单]
		const { outcome, outcomeDesc, verification, saveOrder } = step;
		const { operatorId, operatorName, orgId: channelId } = ctx.session;
		const { taskId, taskName, form_key, processInstanceId } = workflow;
		const opts = {
			...form,
			...{ operatorId, operatorName, channelId },
			...{ taskId, taskName, form_key, processInstanceId }
		};

		// 需要验证表单
		if (verification) {
			await WorkflowClient.formVerify(ctx, opts);
		}

		// 需要保存表单
		if (saveOrder) {
			const rs = await BuddhaClient.debtTransferTdUpdate(ctx, form);
			result = rs.data;
		}

		// 更新工作流
		const workflowParams = {
			taskId,
			assignee: operatorId,
			variables: {
				[`form_${form_key}_outcome`]: outcome,
				[`form_${form_key}_assignee`]: operatorId
			}
		};

		// 完成任务
		await WorkflowClient.completeTask(ctx, workflowParams);

		// 保存审批列表
		const recordParams = {
			formKey: form_key,
			optionDesc: form.form_opinion,
			optionResultCode: outcome,
			optionResultDesc: outcomeDesc,
			optionTypeCode: '0',
			optionUser: operatorName,
			optionUserId: operatorId,
			orderId: form.id,
			processInstanceId: processInstanceId,
			taskName: taskName,
			formContent: JSON.stringify(form)
		};

		await WorkflowClient.addAuditRecord(ctx, recordParams);

		return ctx.success(result);
	}

	/**
	 * @description 查询借据列表
	 * @param {String} receiptNum 借据编号
	 * @param {String} idCardNo 客户身份证号
	 * @param {String} overdueStatus 逾期状态：1、已逾期；2：未逾期
	 * @param {String} productNum 产品编号
	 * @returns
	 */
	async queryLoanReceipts(params) {
		const { ctx } = this;
		params.productNums = [params.productNum];
		delete params.productNum;

		return await BuddhaClient.queryLoanReceipts(ctx, params);
	}

	/**
	 * @description 分页查询还款记录明细
	 * @param {String} receiptNum 借据编号
	 * @returns
	 */
	async queryRepayRecord(params) {
		const { ctx } = this;
		const { NP } = ctx.helper;
		const rs = await BuddhaClient.queryRepayRecord(ctx, params);

		if (!!rs.data && rs.data.length > 0) {
			// 处理溢缴款出入账正负
			rs.data.map((item) => {
				if (item.balanceType == 2) {
					item.balanceAmt = -item.balanceAmt;
				}
			});

			// 合并单元格数据
			let summation = {
				repayAmt: 0,
				balanceAmt: 0
			};

			// 不需要合并计算
			let sum = {
				matchPrincipal: 0,
				matchInterest: 0,
				matchOverduePenalty: 0,
				matchFee: 0,
				repaymentAmount: 0
			};

			// 数据去重
			const newData = rs.data.reduce((pre, cur) => {
				if (!pre.some((item) => item.repaySn === cur.repaySn)) {
					pre.push(cur);
				}

				return pre;
			}, []);

			for (let value of newData) {
				for (let key in summation) {
					if (value[key]) {
						summation[key] = NP.plus(summation[key], value[key]);
					}
				}
			}

			for (let value of rs.data) {
				for (let key in sum) {
					if (value[key]) {
						sum[key] = NP.plus(sum[key], value[key]);
					}
				}
			}
			summation.repaySn = '合计';
			rs.data.push(Object.assign(summation, sum));
		}

		return rs;
	}

	/**
	 * @description 线下登账记录分页查询
	 * @param {String} receiptNum 借据编号
	 * @returns
	 */
	async queryOfflineRepayRecord(params) {
		const { ctx } = this;
		return await BuddhaClient.queryOfflineRepayRecord(ctx, params);
	}

	/**
	 * @description 查询借据详情
	 * @param {String} receiptNum 借据编号
	 * @param {String} productNum 产品编码
	 * @returns
	 */
	async queryReceiptDetail(params) {
		const { ctx } = this;
		const { NP, isNumber } = ctx.helper;
		const { receiptNum, productNum, repayRecordPages, offlineRepayRecordPages, getReceiptRepayPlan } = params;
		const receipt = {
			receiptInfo: {},
			collectInfo: {},
			repayPlan: []
		};
		const pageTotal = { repayRecordTotal: 0, offlineRepayRecordTotal: 0 };

		// 获取借据详情
		const rs = await BuddhaClient.queryReceiptDetail(ctx, { receiptNum, productNum });
		const data = rs.data;

		if (data.length > 0) {
			receipt.receiptInfo = rs.data[0];

			// 计算逾期天数
			receipt.receiptInfo.overdueDays =
				data.overdueStatus === 1 ? parseInt((new Date().getTime() - new Date(data.lastNeedRepayDate).getTime()) / 3600 / 24 / 1000) : 0;
		} else {
			receipt.receiptInfo = {};
		}

		// 获取还款计划
		if (getReceiptRepayPlan) {
			// 获取系统时间
			const system = await BuddhaClient.getSystemInfo(ctx, {});
			const systemTime = new Date(system.data.accountDate).getTime();

			// 获取还款计划
			const plans = await BuddhaClient.queryRepayPlanDetail(ctx, { receiptNum });
			receipt.repayPlan = plans.data || [];

			receipt.repayPlan.forEach((item) => {
				item.derateAmount = NP.plus(item.deratePrincipal, item.derateOverduePenalty, item.derateInterest, item.derateFee);
				item.shouldRepayAmount = NP.plus(item.shouldRepayPrincipal, item.shouldRepayOverduePenalty, item.shouldRepayInterest, item.shouldRepayFee);
				item.repayedAmount = NP.plus(item.repayedPrincipal, item.repayedOverduePenalty, item.repayedInterest, item.repayedFee);
				item.outstandingAmount = Math.abs(NP.minus(item.shouldRepayAmount, item.repayedAmount, item.derateAmount));
			});

			// 汇总信息
			let currentTerm = '--',
				notRepayPrincipal = 0,
				loanSurplusAmount = 0;

			let summation = {
				currentTerm: '合计',
				shouldRepayPrincipal: 0,
				shouldRepayInterest: 0,
				shouldRepayOverduePenalty: 0,
				shouldRepayFee: 0,
				derateAmount: 0,
				shouldRepayAmount: 0,
				repayedPrincipal: 0,
				repayedInterest: 0,
				repayedOverduePenalty: 0,
				repayedFee: 0,
				repayedAmount: 0,
				outstandingAmount: 0,

				// 减免
				deratePrincipal: 0,
				derateInterest: 0,
				derateFee: 0,
				derateOverduePenalty: 0
			};

			for (let value of receipt.repayPlan) {
				let { currentStartDate, currentEndDate, currentPaidDate, repayingStatus } = value;
				// 本金
				let { shouldRepayPrincipal, repayedPrincipal, deratePrincipal } = value;
				// 利息
				let { shouldRepayInterest, repayedInterest, derateInterest } = value;
				// 费用
				let { shouldRepayFee, repayedFee, derateFee } = value;
				// 罚息
				let { shouldRepayOverduePenalty, repayedOverduePenalty, derateOverduePenalty } = value;

				// 还款计划最后一行新增合计，计算所有金额列
				for (let key in summation) {
					if (isNumber(summation[key])) {
						summation[key] = NP.plus(summation[key], value[key]);
					}
				}

				// 当期
				if (new Date(currentStartDate).getTime() <= systemTime && new Date(currentEndDate).getTime() >= systemTime) {
					currentTerm = value.currentTerm;
				}

				// 剩余本金
				if (new Date(currentPaidDate).getTime() <= systemTime && repayingStatus === 1) {
					loanSurplusAmount = NP.plus(loanSurplusAmount, NP.minus(shouldRepayPrincipal, repayedPrincipal, deratePrincipal));
				}

				// 当前未还金额
				notRepayPrincipal = NP.plus(
					notRepayPrincipal,
					NP.minus(shouldRepayPrincipal, repayedPrincipal, deratePrincipal),
					NP.minus(shouldRepayInterest, repayedInterest, derateInterest),
					NP.minus(shouldRepayFee, repayedFee, derateFee),
					NP.minus(shouldRepayOverduePenalty, repayedOverduePenalty, derateOverduePenalty)
				);
			}

			// 汇集信息
			receipt.collectInfo = {
				currentTerm,
				notRepayPrincipal,
				loanSurplusAmount,
				overdueMaxDays: Math.max.apply(
					null,
					receipt.repayPlan.map((x) => x.overdueDays)
				),

				// 剩余应还本金
				principal: NP.minus(summation.shouldRepayPrincipal, summation.repayedPrincipal, summation.deratePrincipal),
				// 剩余应还利息
				interest: NP.minus(summation.shouldRepayInterest, summation.repayedInterest, summation.derateInterest),
				// 剩余应还费用
				fee: NP.minus(summation.shouldRepayFee, summation.repayedFee, summation.derateFee),
				// 剩余应还罚息
				overduePenalty: NP.minus(summation.shouldRepayOverduePenalty, summation.repayedOverduePenalty, summation.derateOverduePenalty)
			};

			receipt.repayPlan.push(summation);
		}

		// 查询还款记录明细表
		if (repayRecordPages) {
			const repayRecord = await this.queryRepayRecord({ receiptNum, pages: repayRecordPages });
			receipt.repayRecord = repayRecord.data;
			pageTotal.repayRecordTotal = repayRecord.total;
		}

		// 查询登账记录表
		if (offlineRepayRecordPages) {
			const offlineRepayRecord = await this.queryOfflineRepayRecord({ receiptNum, pages: offlineRepayRecordPages });
			receipt.offlineRepayRecord = offlineRepayRecord.data;
			pageTotal.offlineRepayRecordTotal = offlineRepayRecord.total;
		}

		return ctx.success(receipt, pageTotal);
	}

	/**
	 * @description 通用产品-还款试算
	 * @param {String} incomeType 入账类型(1：正常还款；2：提前还款；3：提前结清；)
	 * @param {String} receiptNum 借据编号
	 * @param {String} repayDate 还款时间YYYY-MM-DD
	 * @returns
	 */
	async settleRepayTrial(params) {
		const { ctx } = this;
		const { NP } = ctx.helper;
		const rs = await BuddhaClient.settleRepayTrial(ctx, params);

		rs.data.shouldRepayAmount = NP.plus(
			rs.data.shouldRepayFee,
			rs.data.shouldRepayInterest,
			rs.data.shouldRepayOverduePenalty,
			rs.data.shouldRepayPrincipal
		);

		return rs;
	}

	/**
	 * @description 线下还款成功-根据借据入账
	 * @param {String} creatorId 创建人BOSSID
	 * @param {String} creatorName 创建人姓名
	 * @param {String} receiptNum 借据编号
	 * @param {String} repayAmount 还款金额
	 * @param {String} repayChannel 还款来源
	 * @param {String} repayDate 实际还款日期（yyyy-MM-dd）
	 * @param {String} transferCredential 还款流水
	 * @param {String} transferDate 还款流水日期
	 * @param {String} comment 备注
	 * @param {String} incomeType 还款来源(1：正常还款；2：提前还款；3：提前结清；)
	 * @param {String} repayType 资金来源(1：本人还款；2：代偿还款；3：债转还款；
	 * @param {String} transferCredentials 附件(JSON串){fileName:\"\",fileKey:\"\"}
	 */
	async offlineRepayByReceipt(params) {
		const { ctx } = this;
		const { operatorId, operatorName } = ctx.session;
		params.creatorId = operatorId;
		params.creatorName = operatorName;
		params.transferCredentials = JSON.stringify(params.transferCredentials);

		return await BuddhaClient.offlineRepayByReceipt(ctx, params);
	}

	/**
	 * @description 分页查询批量债转
	 * @param {String} beginUpdateTime 更新时间（开始）
	 * @param {String} endUpdateTime 更新时间（结束）
	 * @param {String} id 批次号
	 * @param {String} status 债转状态：PROCESSING（债转中）、AUDITING（审核中）、COMPLETED（已债转）、CANCELLED（已取消）
	 * @returns
	 */
	async queryDebtTransferList(params) {
		const { ctx } = this;
		return await BuddhaClient.queryDebtTransferList(ctx, params);
	}

	/**
	 * @description 分页查询债转明细
	 * @param {String} debtTransferId 批次号
	 * @param {String} receiptContractNum 批次号
	 * @param {String} productNum 产品编号
	 * @param {String} debtorName 用户姓名
	 * @param {String} beginUpdateTime 更新时间（开始）
	 * @param {String} endUpdateTime 更新时间（结束）
	 * @returns
	 */
	async queryDebtTransferItemList(params) {
		const { ctx } = this;
		return await BuddhaClient.queryDebtTransferItemList(ctx, params);
	}

	/**
	 * @description 在贷明细查询
	 * @param {String} belongDate 更新日期
	 * @param {String} channelName 渠道名称
	 * @param {String} customerName 客户姓名
	 * @param {String} loanDateStart 借款开始时间
	 * @param {String} loanDateEnd 借款结束时间
	 * @param {String} mlevel 逾期等级
	 * @param {String} productNum 产品编码
	 * @param {String} rate 利率
	 * @param {String} receiptNum 借据标号
	 */
	async queryOnloanProgressReport(params) {
		const { ctx } = this;
		return await BuddhaClient.queryOnloanProgressReport(ctx, params);
	}

	/**
	 * @description 查询小贷放款报表
	 * @param {String} startTime 开始时间
	 * @param {String} endTime 结束时间
	 * @param {String} customerName 客户名称
	 * @param {String} receiptNum 借据编号
	 * @param {String} productNum 产品编号
	 * @param {String} overdueLevels 逾期等级
	 * @param {String} repayStatus 还款中状态
	 * @param {String} sourceChannel 来源渠道
	 */
	async queryLoansReport(params) {
		const { ctx } = this;
		const { NP } = ctx.helper;
		const { pages } = params;
		const rs = await BuddhaClient.queryLoansReport(ctx, params);

		if (rs.data && rs.data.resultList && rs.data.resultList.length > 0) {
			// 处理放款报表当前页合计值
			let summation = {
				loanAmount: 0,
				totalRepaidAmt: 0,
				repaidPrincipal: 0,
				repaidInterest: 0,
				repaidPenalty: 0,
				repaidFee: 0,
				remainRepayAmt: 0
			};

			for (let value of rs.data.resultList) {
				for (let key in summation) {
					summation[key] = NP.plus(summation[key], value[key]);
				}
			}

			summation.productName = '合计';
			rs.data.resultList.push(summation);
		}

		// 数据条数大于等于 10000, 最后一行加上固定文案
		if (rs.data.resultList.length >= 10000) {
			rs.data.resultList.push({ productName: `注：数据未显示完全，一次性最多导出 ${pages.size} 条数据` });
		}

		return rs;
	}

	/**
	 * @description 分页查询小贷溢缴款报表
	 * @param {String} startTime 开始时间
	 * @param {String} endTime 结束时间
	 * @param {String} customerName 客户名称
	 * @param {String} receiptNum 借据编号
	 * @param {String} productNum 产品编号
	 * @param {String} customerIdNo 客户身份证号
	 */
	async queryOverpaymentReport(params) {
		const { ctx } = this;
		const { pages } = params;
		const rs = await BuddhaClient.queryOverpaymentReport(ctx, params);

		if (rs.data && rs.data.length > 0) {
			// 处理溢缴款出入账正负
			rs.data.forEach((item) => {
				if (!item.remainAmt) {
					item.remainAmt = 0;
				}

				if (item.balanceType === 2) {
					item.balanceAmt = -item.balanceAmt;
				}

				// 条数小于100 认定为是查询需要加密 大于100 认定为导出不需要加密
				if (pages.size <= 100) {
					for (let key in item) {
						const value = item[key];
						const r = ctx.helper.formatValueByExp(value, key);
						item[key] = r[key];

						if (r[`encrypt_${key}`]) {
							item[`encrypt_${key}`] = r[`encrypt_${key}`];
						}
					}
				}
			});
		}

		// 数据条数大于等于 10000, 最后一行加上固定文案
		if (rs.data.length >= 10000) {
			rs.data.push({ repaySn: `注：数据未显示完全，一次性最多导出 ${pages.size} 条数据` });
		}

		return rs;
	}

	/**
	 * @description 查询小贷结算明细报表
	 * @param {String} startTime 开始时间
	 * @param {String} endTime 结束时间
	 * @param {String} customerName 客户名称
	 * @param {String} receiptNum 借据编号
	 * @param {String} productNum 产品编号
	 * @param {String} sourceChannel 来源渠道
	 */
	async querySettleDetailReport(params) {
		const { ctx } = this;
		const { NP } = ctx.helper;
		const { pages } = params;
		const rs = await BuddhaClient.querySettleDetailReport(ctx, params);

		if (rs.data && rs.data.length > 0) {
			let summation = {
				repaidAmt: 0,
				shouldRepayAmt: 0,
				amount: 0
			};

			rs.data.forEach((item) => {
				for (let key in summation) {
					summation[key] = NP.plus(summation[key], item[key]);
				}

				// 条数小于100 认定为是查询需要加密 大于100 认定为导出不需要加密
				if (pages.size <= 100) {
					for (let key in item) {
						const value = item[key];
						const r = ctx.helper.formatValueByExp(value, key);
						item[key] = r[key];

						if (r[`encrypt_${key}`]) {
							item[`encrypt_${key}`] = r[`encrypt_${key}`];
						}
					}
				}
			});

			summation.channelName = '合计';
			rs.data.push(summation);
		}

		// 数据条数大于等于 10000, 最后一行加上固定文案
		if (rs.data.length >= 10000) {
			rs.data.push({ repaySn: `注：数据未显示完全，一次性最多导出 ${pages.size} 条数据` });
		}

		return rs;
	}

	/**
	 * @description 查询小贷回款明细报表
	 * @param {String} startTime 开始时间
	 * @param {String} endTime 结束时间
	 * @param {String} customerName 客户名称
	 * @param {String} receiptNum 借据编号
	 * @param {String} productNum 产品编号
	 * @param {String} sourceChannel 来源渠道
	 */
	async queryRepaymentReport(params) {
		const { ctx } = this;
		const { NP } = ctx.helper;
		const { pages } = params;
		const rs = await BuddhaClient.queryRepaymentReport(ctx, params);

		if (rs.data && rs.data.resultList && rs.data.resultList.length > 0) {
			let summation = {
				repaidAmt: 0,
				repaidPrincipal: 0,
				repaidInterest: 0,
				repaidPenalty: 0,
				repaidFee: 0
			};

			for (let value of rs.data.resultList) {
				for (let key in summation) {
					summation[key] = NP.plus(summation[key], value[key]);
				}
			}

			summation.repaySn = '合计';
			rs.data.resultList.push(summation);
		}

		// 数据条数大于等于 10000, 最后一行加上固定文案
		if (rs.data.resultList.length >= 10000) {
			rs.data.resultList.push({ repaySn: `注：数据未显示完全，一次性最多导出 ${pages.size} 条数据` });
		}

		return rs;
	}

	/**
	 * @description 分页查询关账数据
	 * @param {String} closeDate 关账日期
	 * @param {String} operatorName 操作人
	 * @returns
	 */
	async queryCloseAccount(params) {
		const { ctx } = this;
		params.pages.order = 'desc';
		params.pages.sort = 'create_time';

		return await BuddhaClient.queryCloseAccount(ctx, params);
	}

	/**
	 * @description 新增关账
	 * @param {String} operatorId 操作人Id
	 * @param {String} operatorName 操作人
	 * @returns
	 */
	async addCloseAccount(params) {
		const { ctx } = this;
		params.operatorId = ctx.session.operatorId;
		params.operatorName = ctx.session.operatorName;

		return await BuddhaClient.addCloseAccount(ctx, params);
	}
}

module.exports = BuddhaService;
