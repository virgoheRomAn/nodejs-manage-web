'use strict';

/**
 * @description 接口文档地址
 * http://java-buddha-biz/swagger-ui.html
 */

const servename = `http://java-buddha-biz.bjjr-${process.env.NODE_ENV}`;

/**
 * @description [java-buddha-biz]
 * @author virgoheRomAn
 * @date 2021-12-23
 */
module.exports = {
	/**
	 * @description 获取系统时间
	 * @param {Object} params
	 * @returns
	 */
	getSystemInfo: async (ctx, params) => {
		const action = servename + `/system/info`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 债转文件解析验证（合通业务）
	 * @param {String} attachment_60 债转协议
	 * @param {String} attachment_61 债转清单
	 * @param {String} date 批次号
	 * @returns
	 */
	debtTransferTdParse: (ctx, params) => {
		const action = servename + `/debtTransfer/debtTransferTdParse`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 创建债转信息（合通业务）
	 * @param {String} attachment_60 债转协议
	 * @param {String} attachment_61 债转清单
	 * @param {String} date 批次号
	 * @param {String} operatorId 操作员ID
	 * @param {String} operatorName 操作员姓名
	 * @returns
	 */
	debtTransferTdCreate: (ctx, params) => {
		const action = servename + `/debtTransfer/debtTransferTdCreate`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 修改债转信息（合通业务）
	 * @param {String} attachment_60 债转协议
	 * @param {String} attachment_61 债转清单
	 * @param {String} date 批次号
	 * @param {String} id ID
	 * @returns
	 */
	debtTransferTdUpdate: (ctx, params) => {
		const action = servename + `/debtTransfer/debtTransferTdUpdate`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 债转信息详情（合通业务）
	 * @param {String} id id
	 * @returns
	 */
	debtTransferTdDetail: (ctx, params) => {
		const action = servename + `/debtTransfer/debtTransferTdDetail`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 分页查询批量债转
	 * @param {String} beginUpdateTime 更新时间（开始）
	 * @param {String} endUpdateTime 更新时间（结束）
	 * @param {String} id 批次号
	 * @param {String} status 债转状态：PROCESSING（债转中）、AUDITING（审核中）、COMPLETED（已债转）、CANCELLED（已取消）
	 * @returns
	 */
	queryDebtTransferList: (ctx, params) => {
		const action = servename + `/debtTransfer/queryDebtTransferList`;
		return ctx.clientPost(action, params);
	},

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
	queryDebtTransferItemList: (ctx, params) => {
		const action = servename + `/debtTransfer/queryDebtTransferItemList`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询借据列表
	 * @param {String} receiptNum 借据编号
	 * @param {String} idCardNo 客户身份证号
	 * @param {String} overdueStatus 逾期状态：1、已逾期；2：未逾期
	 * @param {String} productNum 产品编号
	 * @returns
	 */
	queryLoanReceipts: (ctx, params) => {
		const action = servename + `/loanInfo/receipts`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询借据详情
	 * @param {String} receiptNum 借据编号
	 * @param {String} productNum 产品编码
	 * @returns
	 */
	queryReceiptDetail: (ctx, params) => {
		const action = servename + `/loanInfo/receipts/all/info`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询还款计划详情
	 * @param {String} receiptNum 借据编号
	 * @returns
	 */
	queryRepayPlanDetail: (ctx, params) => {
		const action = servename + `/loanInfo/repayPlanDetail`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 分页查询还款记录明细
	 * @param {String} receiptNum 借据编号
	 * @returns
	 */
	queryRepayRecord: (ctx, params) => {
		const action = servename + `/repayInfo/repayRecord`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询成功还款记录
	 * @param {String} receiptNum 借据编号
	 * @returns
	 */
	queryRepaySuccessRecord: (ctx, params) => {
		const action = servename + `/repayInfo/repaySuccessRecord`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 分页查询线下登账记录
	 * @param {String} receiptNum 借据编号
	 * @returns
	 */
	queryOfflineRepayRecord: (ctx, params) => {
		const action = servename + `/repayInfo/offlineRepayRecord`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 通用产品-还款试算
	 * @param {String} incomeType 入账类型(1：正常还款；2：提前还款；3：提前结清；)
	 * @param {String} receiptNum 借据编号
	 * @param {String} repayDate 还款时间YYYY-MM-DD
	 * @returns
	 */
	settleRepayTrial: (ctx, params) => {
		const action = servename + `/offline/repay/repayTrial`;
		return ctx.clientPost(action, params);
	},

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
	offlineRepayByReceipt: async (ctx, params) => {
		const action = servename + `/offline/repay/offlineByReceipt`;
		return ctx.clientPost(action, params);
	},

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
	queryOnloanProgressReport: (ctx, params) => {
		const action = servename + `/reportForm/xdDailyBalance`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 分页查询小贷溢缴款报表
	 * @param {String} startTime 开始时间
	 * @param {String} endTime 结束时间
	 * @param {String} customerName 客户名称
	 * @param {String} receiptNum 借据编号
	 * @param {String} productNum 产品编号
	 * @param {String} customerIdNo 客户身份证号
	 */
	queryOverpaymentReport: (ctx, params) => {
		const action = servename + `/reportForm/xdOverpayment`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 全量查询小贷溢缴款报表
	 * @param {String} startTime 开始时间
	 * @param {String} endTime 结束时间
	 * @param {String} customerName 客户名称
	 * @param {String} receiptNum 借据编号
	 * @param {String} productNum 产品编号
	 * @param {String} customerIdNo 客户身份证号
	 */
	queryOverpaymentReportAll: (ctx, params) => {
		const action = servename + `/reportForm/xdOverpayment/all`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询小贷回款明细报表
	 * @param {String} startTime 开始时间
	 * @param {String} endTime 结束时间
	 * @param {String} customerName 客户名称
	 * @param {String} receiptNum 借据编号
	 * @param {String} productNum 产品编号
	 * @param {String} sourceChannel 来源渠道
	 */
	queryRepaymentReport: (ctx, params) => {
		const action = servename + `/reportForm/xdCollection`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询小贷回款明细报表
	 * @param {String} startTime 开始时间
	 * @param {String} endTime 结束时间
	 * @param {String} customerName 客户名称
	 * @param {String} receiptNum 借据编号
	 * @param {String} productNum 产品编号
	 * @param {String} sourceChannel 来源渠道
	 */
	queryRepaymentReportAll: (ctx, params) => {
		const action = servename + `/reportForm/xdCollection/all`;
		return ctx.clientPost(action, params);
	},

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
	queryLoansReport: (ctx, params) => {
		const action = servename + `/reportForm/xdLoan`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 全量查询小贷放款报表
	 * @param {String} startTime 开始时间
	 * @param {String} endTime 结束时间
	 * @param {String} customerName 客户名称
	 * @param {String} receiptNum 借据编号
	 * @param {String} productNum 产品编号
	 * @param {String} overdueLevels 逾期等级
	 * @param {String} repayStatus 还款中状态
	 * @param {String} sourceChannel 来源渠道
	 */
	queryLoansReportAll: (ctx, params) => {
		const action = servename + `/reportForm/xdLoan/all`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询小贷结算明细报表
	 * @param {String} startTime 开始时间
	 * @param {String} endTime 结束时间
	 * @param {String} customerName 客户名称
	 * @param {String} receiptNum 借据编号
	 * @param {String} productNum 产品编号
	 * @param {String} sourceChannel 来源渠道
	 */
	querySettleDetailReport: (ctx, params) => {
		const action = servename + `/reportForm/xdSettleDetail`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 全量查询小贷结算明细报表
	 * @param {String} startTime 开始时间
	 * @param {String} endTime 结束时间
	 * @param {String} customerName 客户名称
	 * @param {String} receiptNum 借据编号
	 * @param {String} productNum 产品编号
	 * @param {String} sourceChannel 来源渠道
	 */
	querySettleDetailReportAll: (ctx, params) => {
		const action = servename + `/reportForm/xdSettleDetail/all`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 五级分类统计报表
	 * @param {Object} 参数
	 * @argument {String} deadlineDate 截止日期 (年月日
	 * @argument {String} productNum 产品编号，精准匹配
	 */
	querySettleDetailFiveLevelAll: (ctx, params) => {
		const action = servename + '/fiveLevel/fiveCategory/all';
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 分页查询关账数据
	 * @param {String} closeDate 关账日期
	 * @param {String} operatorName 操作人
	 * @returns
	 */
	queryCloseAccount: (ctx, params) => {
		const action = servename + '/closeAccount/page';
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 新增关账
	 * @param {String} operatorId 操作人Id
	 * @param {String} operatorName 操作人
	 * @returns
	 */
	addCloseAccount: (ctx, params) => {
		const action = servename + '/closeAccount/add';
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 通过身份证号查询逾期借据
	 * @param {String} idCardNo 身份证号
	 * @returns
	 */
	queryReceiptCalculation: (ctx, params) => {
		const action = servename + '/overdueInfo/receiptCalculation';
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 还款记录(扣款记录)
	 * @param {String} customerNum 客户编号
	 * @param {String} productNum 产品编号
	 * @returns
	 */
	queryRepayApplyRecord: (ctx, params) => {
		const action = servename + '/repayInfo/repayApplyRecord';
		return ctx.clientPost(action, params);
	}
};
