'use strict';

const Service = require('egg').Service;
const JRorderClient = require('../../client/java-jrorder-biz');
const WorkflowClient = require('../../client/java-workflow-biz');
const BuddhaClient = require('../../client/java-buddha-biz');

/**
 * @description 金融boss - 订单服务
 * @author virgoheRomAn
 * @date 2023-03-09
 */
class JRbossOrderService extends Service {
	/**
	 * @description 查询渠道列表
	 * @returns
	 */
	async queryChannelList(params) {
		const { ctx } = this;
		return await JRorderClient.queryChannelList(ctx, params);
	}

	/**
	 * @description 查询渠道详情
	 * @param {Object} params
	 * @argument {String} id 渠道ID
	 * @returns
	 */
	async queryChannelDetails(params) {
		const { ctx } = this;
		return await JRorderClient.queryChannelDetails(ctx, params);
	}

	/**
	 * @description 产品渠道配置（渠道关联产品时候，需要填写的配置项）
	 * @param {Object} params
	 * @argument {Array} productIds 产品ID列表
	 * @returns
	 */
	async queryJRProductConfig(params) {
		const { ctx } = this;
		return await JRorderClient.queryJRProductConfig(ctx, params);
	}

	/**
	 * @description 查询渠道合作产品
	 * @param {Object} params
	 * @argument {String} channelId 渠道ID
	 * @argument {Array} productIds 产品ID列表
	 * @returns
	 */
	async queryChannelProducts(params) {
		const { ctx } = this;
		return await JRorderClient.queryChannelProducts(ctx, params);
	}

	/**
	 * @description 保存渠道合作产品
	 * @param {Object} params
	 * @argument {String} channelId 渠道ID
	 * @argument {Array} channelProducts 渠道产品列表
	 * @returns
	 */
	async saveChannelProducts(params) {
		const { ctx } = this;
		return await JRorderClient.saveChannelProducts(ctx, params);
	}

	/**
	 * @description 新增渠道
	 * @param {Object} params
	 * @argument {String} code 统一社会信用代码
	 * @argument {String} name 营业执照名称
	 * @returns
	 */
	async createJrChannel(params) {
		const { ctx } = this;
		return await JRorderClient.createJrChannel(ctx, params);
	}

	/**
	 * @description 修改渠道
	 * @param {Object} params
	 * @argument {String} id 渠道ID
	 * @argument {String} status 状态，ENABLE（启用）、DISABLE（禁用）
	 * @returns
	 */
	async updateJrChannel(params) {
		const { ctx } = this;
		return await JRorderClient.updateJrChannel(ctx, params);
	}

	/**
	 * @description 查询产品列表
	 * @returns
	 */
	async queryProductList(params) {
		const { ctx } = this;
		const rs = await JRorderClient.queryProductList(ctx, params);
		rs.data = rs.data.filter((x) => x.status === 'ENABLE');

		return rs;
	}

	/**
	 * @description 查询订单列表
	 * @returns
	 */
	async queryJRorderList(params) {
		const { ctx } = this;
		return await JRorderClient.queryJRorderList(ctx, params);
	}

	/**
	 * @description 导出客户明细列表
	 * @param {Object} params
	 * @argument {String} beginLoanTime 放款时间（开始）
	 * @argument {String} endLoanTime 放款时间（开始）
	 * @argument {String} channelName 渠道名称
	 * @argument {String} id 订单ID
	 * @argument {String} productId 产品ID
	 * @argument {String} status 状态
	 * @argument {String} userId 用户ID
	 * @argument {String} userName 用户名称
	 * @argument {String} userPhone	用户手机号
	 * @returns
	 */
	async queryUserDetail(params) {
		const { ctx } = this;
		return await JRorderClient.queryUserDetail(ctx, params);
	}

	/**
	 * @description 导出债权确认单
	 * @param {Object} params
	 * @argument {String} beginLoanTime 放款时间（开始）
	 * @argument {String} endLoanTime 放款时间（开始）
	 * @argument {String} channelName 渠道名称
	 * @argument {String} id 订单ID
	 * @argument {String} productId 产品ID
	 * @argument {String} status 状态
	 * @argument {String} userId 用户ID
	 * @argument {String} userName 用户名称
	 * @argument {String} userPhone	用户手机号
	 * @returns
	 */
	async queryClaimConfirmation(params) {
		const { ctx } = this;
		return await JRorderClient.queryClaimConfirmation(ctx, params);
	}

	/**
	 * @description 获取订单详情
	 * @param {Object} params
	 * @argument {String} id 订单Id
	 * @argument {String} formKey 表单key
	 * @returns
	 */
	async queryOrderDetails(params) {
		const { ctx } = this;
		const { id, formKey, productId, isTongdao } = params;

		// 获取订单详情
		const rs = await JRorderClient.queryOrderDetails(ctx, { id, formKey });
		const orderInfo = rs.data;

		// 获取订单中的用户[用于筛选归属人]
		if (params.getUserInfo) {
			const queryUsers = await JRorderClient.queryFormUsers(ctx, { id });
			rs.data.queryUsers = queryUsers.data;
		}

		// 如果不是通道业务获取产品利率
		if (!isTongdao) {
			const rate = await JRorderClient.queryChannelProductRate(ctx, { productId, channelId: orderInfo['order_channelId'] });
			rs.data.rateList = rate.data;
		}

		// 获取审批列表
		const recordList = await WorkflowClient.queryAuditRecord(ctx, { orderId: id, pages: params.approvalPages });
		rs.data.historicalApprovalRecord = recordList.data;
		rs.data.historicalApprovalRecordTotal = recordList.total;

		return rs;
	}

	/**
	 * @description 查询订单还款计划
	 * @param {Object} params
	 * @argument {String}  id 订单号
	 * @returns
	 */
	async queryRepaymentPlanList(params) {
		const { ctx } = this;
		const { NP } = ctx.helper;
		const rs = await JRorderClient.queryRepaymentPlanList(ctx, params);

		// 计算总额字段
		rs.data.map((item) => {
			// 当期减免总额 = 当期减免费用 + 当期减免利息 + 当期减免本金 + 当期减免逾期罚息
			item.derateAmount = NP.plus(item.derateFee, item.derateInterest, item.deratePrincipal, item.derateOverduePenalty);

			// 当期应还总额 = 当期应还费用 + 当期应还利息 + 当期应还本金 + 当期应还服务费 + 当期应还逾期罚息
			item.shouldAmount = NP.plus(
				item.shouldRepayFee,
				item.shouldRepayInterest,
				item.shouldRepayPrincipal,
				item.shouldRepayServiceFee,
				item.shouldRepayOverduePenalty
			);

			// 当期实还总金额 = 当期实还费用 + 当期实还利息 + 当期实还本金 + 当期实还服务费 + 当期实还逾期罚息
			item.repayedAmount = NP.plus(item.repayedFee, item.repayedInterest, item.repayedPrincipal, item.repaidServiceFee, item.repayedOverduePenalty);
		});

		// 合计值
		let summation = {
			currentTerm: '合计',
			shouldRepayPrincipal: 0,
			shouldRepayInterest: 0,
			shouldRepayServiceFee: 0,
			shouldRepayOverduePenalty: 0,
			shouldRepayFee: 0,
			derateAmount: 0,
			shouldAmount: 0,
			repayedPrincipal: 0,
			repayedInterest: 0,
			repaidServiceFee: 0,
			repayedOverduePenalty: 0,
			repayedFee: 0,
			repayedAmount: 0
		};

		for (let value of rs.data) {
			for (let key in summation) {
				if (key !== 'currentTerm') {
					summation[key] = NP.plus(summation[key], value[key]);
				}
			}
		}

		rs.data.push(summation);
		return rs;
	}

	/**
	 * @description 线下还款详情查询
	 * @description [暂时不迁移 - 2023-04-27] 未完成借据统计计算
	 * @param {Object} params
	 * @argument {String} id 订单号
	 * @returns
	 */
	async queryRepaymentOfflineDetails(params) {
		const { ctx } = this;

		// 获取单个订单详情
		const rs = await JRorderClient.queryOneOrderDetails(ctx, params);
		const data = rs.data;

		// 获取借据详情
		const receiptRs = await BuddhaClient.queryReceiptDetail(ctx, { receiptNum: data.loanNo, productNum: data.productId });
		let receipt = {};
		if (receiptRs.data.length > 0) {
			receipt = receiptRs.data[0];
		}

		// 获取溢缴款
		const overpaymentRs = await JRorderClient.queryOverpayment(ctx, { userId: data.userId });
		const overpayment = overpaymentRs.data || {};

		// 如果没有账户 默认为 0
		if (overpaymentRs.data === null) {
			overpayment['remainAmount'] = 0;
		}

		return ctx.success({ ...data, ...receipt, ...overpayment });
	}

	/**
	 * @description 查询公告列表
	 * @param {Object} params
	 * @argument {String} createTimeStart 创建开始时间
	 * @argument {String} createEndStart 创建结束时间
	 * @argument {String} creatorName 创建人
	 * @argument {String} title 公告标题
	 * @returns
	 */
	async queryAnnouncementList(params) {
		const { ctx } = this;
		return await JRorderClient.queryAnnouncementList(ctx, params);
	}

	/**
	 * @description 查询公告详情
	 * @param {Object} params
	 * @argument {String} id 公告ID
	 * @returns
	 */
	async queryAnnouncementDetails(params) {
		const { ctx } = this;
		return await JRorderClient.queryAnnouncementDetails(ctx, params);
	}

	/**
	 * @description 保存公告
	 * @param {Object} params
	 * @argument {String} startTime 创建开始时间
	 * @argument {String} endTime 创建结束时间
	 * @argument {String} creatorId 创建人
	 * @argument {String} title 公告标题
	 * @argument {String} content 公告内容
	 * @argument {String} id 公告ID
	 * @returns
	 */
	async saveAnnouncement(params) {
		const { ctx } = this;
		params.creatorId = ctx.session.operatorId;

		return await JRorderClient.saveAnnouncement(ctx, params);
	}

	/**
	 * @description 查询业务岗人员列表
	 * @param {Object} params
	 * @argument {String} cityCode 城市编码
	 * @argument {String} name 姓名
	 * @argument {String} phoneNum 手机号
	 * @returns
	 */
	async queryjrBusinessStaffList(params) {
		const { ctx } = this;
		return await JRorderClient.queryjrBusinessStaffList(ctx, params);
	}

	/**
	 * @description 保存业务岗人员
	 * @param {Object} params
	 * @argument {String} cityCode 城市编码
	 * @argument {String} id ID（更新时传）
	 * @argument {String} jrOperatorId 操作员id
	 * @argument {String} name 姓名
	 * @argument {String} phoneNum 手机号
	 * @argument {String} status 状态：0禁用、1启用
	 * @returns
	 */
	async savejrBusinessStaff(params) {
		const { ctx } = this;
		return await JRorderClient.savejrBusinessStaff(ctx, params);
	}

	/**
	 * @description 更新业务岗人员状态
	 * @param {Object} params
	 * @argument {String} id ID（更新时传）
	 * @argument {String} status 状态：0禁用、1启用
	 * @returns
	 */
	async updatejrBusinessStaff(params) {
		const { ctx } = this;
		return await JRorderClient.updatejrBusinessStaff(ctx, params);
	}

	/**
	 * @description 获取客户入库列表
	 * @param {Object} params
	 * @argument {String} name 客户姓名
	 * @argument {String} idNo 客户身份证号
	 * @argument {String} channelSimpleName 申请渠道
	 * @argument {String} createTimeStart 申请时间
	 * @argument {String} creatorName 申请人
	 * @argument {String} status 状态
	 * @returns
	 */
	async queryUserApplyList(params) {
		const { ctx } = this;
		return await JRorderClient.queryUserApplyList(ctx, params);
	}

	/**
	 * @description 获取客户入库详情
	 * @param {Object} params
	 * @argument {String} id ID
	 * @returns
	 */
	async queryUserApplyDetail(params) {
		const { ctx } = this;
		return await JRorderClient.queryUserApplyDetail(ctx, params);
	}

	/**
	 * @description 审批客户入库
	 * @param {Object} params
	 * @argument {String} id ID
	 * @argument {String} result 审批结果：APPROVED-已通过、REJECTED-已否决
	 * @argument {String} thirdApprovalTime 第三方审批时间
	 * @returns
	 */
	async approvalUserApply(params) {
		const { ctx } = this;
		return await JRorderClient.approvalUserApply(ctx, params);
	}
}

module.exports = JRbossOrderService;
