'use strict';

/**
 * @description 接口文档地址
 * http://java-jrorder-biz/swagger-ui.html
 */

const servename = `http://java-jrorder-biz.bjjr-${process.env.NODE_ENV}`;

/**
 * @description [java-jrorder-biz]
 * @author virgoheRomAn
 * @date 2021-12-23
 */
module.exports = {
	/**
	 * @description 查询渠道列表
	 * @param {Object} params
	 * @returns
	 */
	queryChannelList: async (ctx, params) => {
		const action = servename + `/jrChannel/query`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询渠道详情
	 * @param {Object} params
	 * @argument {String} id 渠道ID
	 * @returns
	 */
	queryChannelDetails: async (ctx, params) => {
		const action = servename + `/jrChannel/queryOne`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 新增渠道
	 * @param {Object} params
	 * @argument {String} code 统一社会信用代码
	 * @argument {String} name 营业执照名称
	 * @returns
	 */
	createJrChannel: async (ctx, params) => {
		const action = servename + `/jrChannel/create`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 修改渠道
	 * @param {Object} params
	 * @argument {String} id 渠道ID
	 * @argument {String} status 状态，ENABLE（启用）、DISABLE（禁用）
	 * @returns
	 */
	updateJrChannel: async (ctx, params) => {
		const action = servename + `/jrChannel/update`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 产品渠道配置（渠道关联产品时候，需要填写的配置项）
	 * @param {Object} params
	 * @argument {Array} productIds 产品ID列表
	 * @returns
	 */
	queryJRProductConfig: async (ctx, params) => {
		const action = servename + `/jrProductChannelConfig/queryList`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询渠道合作产品
	 * @param {Object} params
	 * @argument {String} channelId 渠道ID
	 * @argument {Array} productIds 产品ID列表
	 * @returns
	 */
	queryChannelProducts: async (ctx, params) => {
		const action = servename + `/jrChannelProduct/query`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 保存渠道合作产品
	 * @param {Object} params
	 * @argument {String} channelId 渠道ID
	 * @argument {Array} channelProducts 渠道产品列表
	 * @returns
	 */
	saveChannelProducts: async (ctx, params) => {
		const action = servename + `/jrChannelProduct/save`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询产品列表
	 * @param {Object} params
	 * @returns
	 */
	queryProductList: async (ctx, params) => {
		const action = servename + `/jrProduct/query`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 新增订单列表查询[返回订单状态：0服务中，1服务完成]
	 * @param {Object} params
	 * @argument {String} beginLoanTime 放款时间（开始）
	 * @argument {String} endLoanTime 放款时间（开始）
	 * @argument {String} beginCreateTime 创建时间（开始）
	 * @argument {String} channelId 渠道ID
	 * @argument {String} channelName 渠道名称
	 * @argument {String} endCreateTime 创建时间（结束）
	 * @argument {String} history 是否历史订单
	 * @argument {String} id 订单ID
	 * @argument {Array} ids 订单ID列表
	 * @argument {String} operatorId 操作员ID
	 * @argument {String} operatorName 操作员名称
	 * @argument {String} productId 产品ID
	 * @argument {String} productName 产品名称
	 * @argument {String} status 状态
	 * @argument {String} userId 用户ID
	 * @argument {String} userName 用户名称
	 * @argument {String} userPhone	用户手机号
	 * @returns
	 */
	queryJRorderList: async (ctx, params) => {
		const action = servename + `/jrOrder/paging/query`;
		return ctx.clientPost(action, params);
	},

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
	queryUserDetail: (ctx, params) => {
		const action = servename + `/jrOrder/hetong/userDetail/query`;
		return ctx.clientPost(action, params);
	},

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
	queryClaimConfirmation: (ctx, params) => {
		const action = servename + `/jrOrder/hetong/claimConfirmation/query`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询单个产品配置
	 * @param {Object} params
	 * @argument {String} id 产品id
	 * @returns
	 */
	queryProductConfig: async (ctx, params) => {
		const action = servename + `/jrProduct/queryProductConfig`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 根据订单动态后去表单配置
	 * @param {Object} params
	 * @argument {String} id 产品id
	 * @returns
	 */
	queryFormConfigByOrder: async (ctx, params) => {
		const action = servename + `/jrOrder/formConfig`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 获取订单详情
	 * @param {Object} params
	 * @argument {String} id 订单Id
	 * @argument {String} formKey 表单key
	 * @returns
	 */
	queryOrderDetails: async (ctx, params) => {
		const action = servename + `/jrOrder/formValues`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询订单关联的用户信息
	 * @param {Object} params
	 * @argument {String} id 订单Id
	 * @returns
	 */
	queryFormUsers: async (ctx, params) => {
		const action = servename + `/jrOrder/queryUsers`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询渠道合作产品利率
	 * @param {Object} params
	 * @argument {String} channelId 渠道ID 组织标识 orgId
	 * @argument {String} productId 产品ID
	 * @returns
	 */
	queryChannelProductRate: (ctx, params) => {
		const action = servename + `/jrChannelProduct/queryRate`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询订单还款计划
	 * @param {Object} params
	 * @argument {String}  id 订单号
	 * @returns
	 */
	queryRepaymentPlanList: (ctx, params) => {
		const action = servename + `/jrOrder/repayPlan/all`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 动态保存表单
	 * @param {Object} params 保存表单的值
	 * @returns
	 */
	formValuesSave: (ctx, params) => {
		const action = servename + `/jrOrder/formValuesSave`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 修改订单状态
	 * @param {Object} params
	 * @argument {String} orderId 订单号
	 * @argument {String} orderStatus 订单状态
	 * @returns
	 */
	updateOrderStatus: (ctx, params) => {
		const action = servename + `/jrOrder/updateOrderStatus`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询单个订单详情
	 * @param {Object} params
	 * @argument {String} id 订单号
	 * @returns
	 */
	queryOneOrderDetails: (ctx, params) => {
		const action = servename + `/jrOrder/queryOne`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询溢缴款
	 * @param {Object} params
	 * @argument {String} userId 用户Id
	 * @returns
	 */
	queryOverpayment: (ctx, params) => {
		const action = servename + `/overpayment/user/query`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询公告列表
	 * @param {Object} params
	 * @argument {String} createTimeStart 创建开始时间
	 * @argument {String} createEndStart 创建结束时间
	 * @argument {String} creatorName 创建人
	 * @argument {String} title 公告标题
	 * @returns
	 */
	queryAnnouncementList: (ctx, params) => {
		const action = servename + `/announcement/boss/paging`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询公告详情
	 * @param {Object} params
	 * @argument {String} id 公告ID
	 * @returns
	 */
	queryAnnouncementDetails: (ctx, params) => {
		const action = servename + `/announcement/detail/query`;
		return ctx.clientPost(action, params);
	},

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
	saveAnnouncement: (ctx, params) => {
		const action = servename + `/announcement/save`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 分页查询金融放款报表
	 * @param {Object} params
	 * @argument {String} channelSimpleName 来源渠道，模糊匹配
	 * @argument {String} startTime 还款时间（当日0点）
	 * @argument {String} endTime 还款时间（当日24点）
	 * @argument {String} loanNo 借据编号，精准匹配
	 * @argument {String} productId 产品编号，精准匹配
	 * @argument {String} username 客户名称，模糊匹配
	 * @argument {String} overdueLevels 逾期等级（数组），精准匹配
	 * @argument {String} repayStatus 还款中状态: 1、还款中（包括还款中借据和逾期借据）；2、结清
	 * @argument {String} page 页码，从1开始
	 * @argument {String} size 每页大小
	 * @returns
	 */
	queryLoanReport: (ctx, params) => {
		const action = servename + `/reportForm/jrLoan`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 全量查询金融汇款明细报表
	 * @param {Object} params
	 * @argument {String} channelSimpleName 来源渠道，模糊匹配
	 * @argument {String} startTime 还款时间（当日0点）
	 * @argument {String} endTime 还款时间（当日24点）
	 * @argument {String} loanNo 借据编号，精准匹配
	 * @argument {String} productId 产品编号，精准匹配
	 * @argument {String} username 客户名称，模糊匹配
	 * @returns
	 */
	queryRepaymentReport: (ctx, params) => {
		const action = servename + `/reportForm/jrCollection/all`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询业务岗人员列表
	 * @param {Object} params
	 * @argument {String} cityCode 城市编码
	 * @argument {String} name 姓名
	 * @argument {String} phoneNum 手机号
	 * @returns
	 */
	queryjrBusinessStaffList: (ctx, params) => {
		const action = servename + `/jrBusinessStaff/boss/paging`;
		return ctx.clientPost(action, params);
	},

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
	savejrBusinessStaff: (ctx, params) => {
		const action = servename + `/jrBusinessStaff/save`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 更新业务岗人员状态
	 * @param {Object} params
	 * @argument {String} id ID（更新时传）
	 * @argument {String} status 状态：0禁用、1启用
	 * @returns
	 */
	updatejrBusinessStaff: (ctx, params) => {
		const action = servename + `/jrBusinessStaff/status/update`;
		return ctx.clientPost(action, params);
	},

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
	queryUserApplyList: (ctx, params) => {
		const action = servename + `/userApply/boss/paging`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 获取客户入库详情
	 * @param {Object} params
	 * @argument {String} id ID
	 * @returns
	 */
	queryUserApplyDetail: (ctx, params) => {
		const action = servename + `/userApply/detail/query`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 审批客户入库
	 * @param {Object} params
	 * @argument {String} id ID
	 * @argument {String} result 审批结果：APPROVED-已通过、REJECTED-已否决
	 * @argument {String} thirdApprovalTime 第三方审批时间
	 * @returns
	 */
	approvalUserApply: (ctx, params) => {
		const action = servename + `/userApply/approval`;
		return ctx.clientPost(action, params);
	}
};
