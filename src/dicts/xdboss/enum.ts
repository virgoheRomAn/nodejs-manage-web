export interface XdBossEnum {
	[key: string]: any;
	ProductList?: any;
	ProductCascaderList?: any;
	OrderStatus?: any;
	IouOverdesStatus?: any;
	IouRepayingStatus?: any;
	IouVerificationStatus?: any;
	OfflineRepayType?: any;
	OfflineRepayChannel?: any;
	OfflineRepayCommutationType?: any;
	DebtTransferStatus?: any;
	DebtTransferProduct?: any;
}

// 导出所有枚举
export const xdEnum = {};

// 导出所有字典
export const xdDict = {
	// 产品列表
	ProductList: [
		{ code: 'P-IN-01', text: '订单分期-基础类' },
		{ code: 'P-QY-01', text: '订单分期-权益类' },
		{ code: 'P-ECYX-001', text: '二次营销' },
		{ code: 'P-KABANG-001', text: '卡邦分期' },
		{ code: 'P-CWFQ-001', text: '宠物分期' },
		{ code: 'P-DDD-02', text: '三峡银行订单贷' },
		{ code: 'bjjr_dianzi', text: '戒易花-E抵秒贷' },
		{ code: 'bjjr_diya', text: '戒易花-加层E贷' },
		{ code: 'bjjr_diya2', text: '戒易花-加层E贷2.0' },
		{ code: 'bjjr_diya5y', text: '戒易花-加层E贷5年期' },
		{ code: 'bjjr_htcl', text: '合通业务-信用贷' }
	],

	// 产品级联选择
	ProductCascaderList: [
		{
			code: 'zyl',
			text: '自营类',
			children: [
				{ code: 'P-IN-01', text: '订单分期-基础类', status: 1, type: 'zyl' },
				{ code: 'P-QY-01', text: '订单分期-权益类', status: 1, type: 'zyl' },
				{ code: 'bjjr_dianzi', text: '戒易花-E抵秒贷', status: 1, type: 'zyl' },
				{ code: 'bjjr_diya', text: '戒易花-加层E贷', status: 1, type: 'zyl' },
				{ code: 'bjjr_diya2', text: '戒易花-加层E贷2.0', status: 1, type: 'zyl' },
				{ code: 'bjjr_diya5y', text: '戒易花-加层E贷5年期', status: 1, type: 'zyl' },
				{ code: 'P-DB-01', text: '员工贷', status: 1, type: 'zyl' }
			]
		},
		{
			code: 'hzl',
			text: '合作类',
			children: [{ code: 'bjjr_htcl', text: '合通业务-信用贷', status: 1, type: 'hzl' }]
		}
	],

	// 订单状态
	OrderStatus: [
		{ code: 1, text: '审核中' },
		{ code: 2, text: '审批通过' },
		{ code: 3, text: '拒绝' },
		{ code: 5, text: '取消' },
		{ code: 6, text: '待放款' },
		{ code: 7, text: '放款中' },
		{ code: 8, text: '已放款' },
		{ code: 9, text: '放款失败' },
		{ code: 10, text: '已结清' },
		{ code: 20, text: '无效' }
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

	// 借据详情 - 核销状态
	IouVerificationStatus: [
		{ code: 0, text: '未核销', status: 1 },
		{ code: 1, text: '已核销', status: 1 }
	],

	// 催收状态
	OverdueLevrls: [
		{ code: 'M0', text: 'M0', value: [] },
		{ code: 'M1', text: 'M1', value: [0, 30] },
		{ code: 'M2', text: 'M2', value: [30, 60] },
		{ code: 'M3', text: 'M3', value: [60, 90] },
		{ code: 'M4', text: 'M4', value: [90, 120] },
		{ code: 'M5', text: 'M5', value: [120, 150] },
		{ code: 'M6', text: 'M6', value: [150, 180] },
		{ code: 'M6+', text: 'M6+', value: [180, 99999] }
	],

	// 借据详情 - 还款记录明细 - 还款方式
	RepaymentWay: [
		{ code: '1', text: '代扣' },
		{ code: '2', text: '线上移动支付' },
		{ code: '3', text: '线下还款' },
		{ code: '4', text: '溢缴款还款' }
	],

	// 借据管理 - 还款申请 - 还款类型
	OfflineRepayType: [
		{ code: '1', text: '正常还款' },
		{ code: '2', text: '提前还款' },
		{ code: '3', text: '提前结清' }
	],

	// 借据管理 - 还款申请 - 还款来源
	OfflineRepayChannel: [
		{ code: '易宝扣款', text: '易宝扣款' },
		{ code: '线下还款', text: '线下还款' },
		{ code: '渠道代还', text: '渠道代还' },
		{ code: '其他', text: '其他' }
	],

	// 借据管理 - 还款申请 - 是否代偿
	OfflineRepayCommutationType: [
		{ code: 1, text: '本人还款' },
		{ code: 2, text: '代偿还款' }
	],

	// 批量债转查询 - 债转状态
	DebtTransferStatus: [
		{ code: 'PROCESSING', text: '债转中' },
		{ code: 'AUDITING', text: '审核中' },
		{ code: 'COMPLETED', text: '已债转' },
		{ code: 'CANCELLED', text: '已取消' },
		{ code: 'REJECTED', text: '已拒绝' }
	],

	// 批量债转查询 - 申请债转产品
	DebtTransferProduct: [{ code: 'bjjr_htcl', text: '合通业务-信用贷' }],

	// 催收任务名称
	CollectionTaskName: [
		{ code: '', text: '全部' },
		{ code: '管理员分配', text: '管理员分配' },
		{ code: '低阶处理', text: '低阶处理' },
		{ code: '管理员审核', text: '管理员审核' },
		{ code: '高阶处理', text: '高阶处理' }
	]
};
