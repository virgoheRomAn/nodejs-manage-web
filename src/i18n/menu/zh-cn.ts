// 定义内容
export default {
	select: '选择系统',
	home: '首页',
	jrBoss: {
		index: '金融Boss',
		home: '金融首页',
		order: { index: '订单管理', list: '订单列表', details: '订单详情', repayment: '线下还款' },
		task: { index: '任务管理', todo: '待办任务', details: '待办任务详情', approve: '待办任务审批' },
		report: {
			index: '统计报表',
			loans: '放款查询',
			repayment: '回款明细'
		},
		channel: {
			index: '渠道管理',
			add: '新增渠道',
			record: '渠道列表',
			details: '渠道详情'
		},
		business: {
			index: '业务岗管理',
			record: '人员列表'
		},
		whiteTask: {
			index: '白名单任务',
			record: '任务列表',
			approve: '白名单待办任务审批'
		}
	},
	xdBoss: {
		index: '小贷Boss',
		home: '小贷首页',
		order: { index: '订单管理', list: '订单列表', details: '订单详情' },
		task: {
			index: '任务管理',
			todo: '待办任务',
			history: '办结任务',
			todoDetails: '待办任务详情',
			approve: '待办任务审批',
			historyDetails: '办结任务详情',
			debtTransfer: '债转任务'
		},
		financial: {
			index: '财务管理',
			office: '金融办上报',
			receipt: '借据查询',
			receiptDetails: '借据详情',
			receiptOffline: '线下登账',
			receiptDerate: '线下减免',
			verification: { index: '核销查询', query: '批量核销查询', details: '核销明细查询' },
			debtTransfer: {
				index: '债转查询',
				query: '批量债转查询',
				queryDetails: '批量债转查询明细',
				details: '债转明细查询',
				debtTransferApply: '发起债转申请'
			}
		},
		collection: {
			index: '催收管理',
			task: '任务列表',
			approve: '任务审批',
			searchuser: '入催客户查询',
			searchuserDetails: '入催客户详情',
			outourcing: '委外查询',
			outourcingDetails: '委外详情',
			classStatistics: '五级分类'
		},
		report: {
			index: '统计报表',
			onloan: '在贷明细查询',
			loans: '放款明细查询',
			payment: '回款明细查询',
			overpayment: '溢缴款明细查询',
			settlement: '结算明细查询',
			receiptOnloanDetails: '在贷明细-借据详情',
			receiptLoansDetails: '放款明细-借据详情',
			receiptPaymentDetails: '回款明细-借据详情',
			receiptSettlementDetails: '结算明细-借据详情'
		},
		user: {
			index: '客户管理',
			record: '客户列表',
			details: '客户详情'
		}
	},
	jfManage: {
		index: '综合管理',
		home: '综合首页',
		permission: {
			index: '权限管理',
			operator: { index: '操作员管理', details: '操作员详情', add: '新增操作员', edit: '编辑操作员' },
			role: { index: '角色管理', details: '角色详情', add: '添加角色', edit: '编辑角色' },
			menu: { index: '菜单管理', details: '菜单详情' }
		},
		system: {
			index: '系统工具',
			sensitive: '敏感词过滤',
			reconciliation: '对账查询',
			accountingClose: '关账查询'
		},
		note: {
			index: '短信管理',
			template: '模板管理',
			send: '批量发送',
			batch: '批次查询',
			history: '历史短信查询'
		},
		notice: {
			index: '公告管理',
			record: '公告列表'
		},
		user: {
			index: '客户管理',
			record: '客户列表'
		}
	}
};
