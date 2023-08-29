export interface JrBossEnum {
	[key: string]: any;
	ProductList?: any;
	ChannelStatus?: any;
	OrderStatus?: any;
	IouRepayingStatus?: any;
	IouOverdesStatus?: any;
	OfflineRepaymentType?: any;
	OfflineRepaymentChannel?: any;
}

// 渠道状态
export enum ChannelStatus {
	ENABLE = '启用',
	DISABLE = '禁用'
}

// 订单状态
export enum OrderStatus {
	ESTABLISHING = '进件中',
	UNSUBMITTED = '待提交',
	UNCONFIRMED = '待确认',
	AUDITING = '审核中',
	CANCELED = '已取消',
	REJECTED = '已拒绝',
	LOANING = '放款中',
	LOANED = '已放款',
	EXAMINEADOPT = '审核通过',
	LOAN_FAILURE = '放款失败',
	ARCHIVED = '已归档'
}

// 导出所有枚举
export const jrEnum = {
	ChannelStatus,
	OrderStatus
};

// 导出所有字典
export const jrDict = {
	// 产品列表
	ProductList: [
		{ code: 'bjjr_equickloan', text: '戒易花-E抵快贷', examine: 1 },
		{ code: 'bjjr_dianzi', text: '戒易花-E抵秒贷', examine: 1 },
		{ code: 'bjjr_diya', text: '戒易花-加层E贷', examine: 1 },
		{ code: 'bjjr_diya2', text: '戒易花-加层E贷2.0', examine: 1 },
		{ code: 'bjjr_qiqiu', text: '加层E贷-气球贷', examine: 0 },
		{ code: 'bjjr_tongdao1', text: '合通业务', examine: 0 },
		{ code: 'czbank_diya', text: '浙商合作贷', examine: 0 }
	],

	// 导出产品列表
	ReportProductList: [{ code: 'bjjr_dianzi', text: '戒易花-E抵秒贷' }],

	// 订单状态
	OrderStatus: [
		{ code: 'ESTABLISHING', text: '进件中' },
		{ code: 'UNSUBMITTED', text: '待提交' },
		{ code: 'UNCONFIRMED', text: '待确认' },
		{ code: 'AUDITING', text: '审核中' },
		{ code: 'CANCELED', text: '已取消' },
		{ code: 'REJECTED', text: '已拒绝' },
		{ code: 'LOANING', text: '放款中' },
		{ code: 'LOANED', text: '已放款' },
		{ code: 'EXAMINEADOPT', text: '审核通过' },
		{ code: 'LOAN_FAILURE', text: '放款失败' },
		{ code: 'ARCHIVED', text: '已归档' }
	],

	// 借据管理 - 借据状态
	IouRepayingStatus: [
		{ code: 1, text: '还款中', status: 1, tableText: '还款中' },
		{ code: 2, text: '已结清', status: 1, tableText: '已还款' }
	],

	// 借据管理 - 逾期状态
	IouOverdesStatus: [
		{ code: 1, text: '逾期', status: 1 },
		{ code: 2, text: '未逾期', status: 1 }
	],

	// 借据管理 - 还款申请 - 还款类型
	OfflineRepaymentType: [
		{ code: 1, text: '正常还款(提前入账)' },
		{ code: 2, text: '提前结清' }
	],

	// 还款来源
	OfflineRepaymentChannel: [
		{ code: 1, text: '渠道代还' },
		{ code: 0, text: '其他' }
	],

	// 催收状态
	OverdueLevrls: [
		{ code: 'M0', text: 'M0' },
		{ code: 'M1', text: 'M1' },
		{ code: 'M2', text: 'M2' },
		{ code: 'M3', text: 'M3' },
		{ code: 'M4', text: 'M4' },
		{ code: 'M5', text: 'M5' },
		{ code: 'M6', text: 'M6' },
		{ code: 'M6+', text: 'M6+' }
	],

	// 业务岗人员区域
	BusinessAreaCity: [
		{ code: '500100', text: '重庆市' },
		{ code: '510100', text: '成都市' }
	],

	// 客户入库状态
	WhiteTaskStatus: [
		{ code: 'PENDING', text: '待处理' },
		{ code: 'APPROVED', text: '已通过' },
		{ code: 'REJECTED', text: '已否决' },
		{ code: 'INVALID', text: '已失效' }
	],

	// 客户入库审批
	WhiteTaskApprove: [
		{ code: 'APPROVED', text: '通过' },
      { code: 'REJECTED', text: '否决' },
	]
};
