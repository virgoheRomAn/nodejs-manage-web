module.exports = [
	{
		id: '010201',
		parentId: '0102',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '订单列表',
		permissionCode: 'jrBoss.order.list',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/jrboss/order/record"]',
		icon: 'fa fa-list-ul',
		routes: [
			{
				path: '/jrboss/order/list',
				permissionId: '010201',
				orderNumber: 1,
				template: 'jrboss/order/list',
				code: 'jrBoss.order.list',
				name: '订单列表',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-09T14:23:51.000+08:00',
				updateTime: '2023-05-09T14:23:51.000+08:00'
			},
			{
				path: '/jrboss/order/details',
				permissionId: '010201',
				orderNumber: 2,
				template: 'jrboss/order/details',
				code: 'jrBoss.order.details',
				name: '订单详情',
				keepAlive: 0,
				hidden: 1,
				createTime: '2023-05-09T14:23:51.000+08:00',
				updateTime: '2023-05-09T14:23:51.000+08:00'
			},
			{
				path: '/jrboss/order/repayment-offline',
				permissionId: '010201',
				orderNumber: 3,
				template: 'jrboss/order/repayment-offline',
				code: 'jrBoss.order.repayment',
				name: '线下还款',
				keepAlive: 0,
				hidden: 1,
				createTime: '2023-05-09T14:23:51.000+08:00',
				updateTime: '2023-05-09T14:23:51.000+08:00'
			}
		]
	},
	{
		id: '010301',
		parentId: '0103',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '待办任务',
		permissionCode: 'jrBoss.task.todo',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/jrboss/task/todo"]',
		icon: 'fa fa-tasks',
		routes: [
			{
				path: '/jrboss/task/todo',
				permissionId: '010301',
				orderNumber: 1,
				template: 'jrboss/task/todo',
				code: 'jrBoss.task.todo',
				name: '待办任务',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-09T14:24:15.000+08:00',
				updateTime: '2023-05-09T14:24:15.000+08:00'
			},
			{
				path: '/jrboss/task/todo/approve',
				permissionId: '010301',
				orderNumber: 2,
				template: 'jrboss/task/approve',
				code: 'jrBoss.task.approve',
				name: '待办任务审批',
				keepAlive: 0,
				hidden: 1,
				createTime: '2023-05-09T14:24:15.000+08:00',
				updateTime: '2023-05-09T14:24:15.000+08:00'
			}
		]
	},
	{
		id: '010401',
		parentId: '0104',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '渠道列表',
		permissionCode: 'jrBoss.channel.record',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/jrboss/channel/record"]',
		icon: 'fa fa-tasks',
		routes: [
			{
				path: '/jrboss/channel/list',
				permissionId: '010401',
				orderNumber: 1,
				template: 'jrboss/channel/list',
				code: 'jrBoss.channel.record',
				name: '渠道列表',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-18T13:55:49.000+08:00',
				updateTime: '2023-05-18T13:55:49.000+08:00'
			},
			{
				path: '/jrboss/channel/details',
				permissionId: '010401',
				orderNumber: 2,
				template: 'jrboss/channel/details',
				code: 'jrBoss.channel.details',
				name: '渠道详情',
				keepAlive: 0,
				hidden: 1,
				createTime: '2023-05-18T13:55:49.000+08:00',
				updateTime: '2023-05-18T13:55:49.000+08:00'
			}
		]
	},
	{
		id: '010501',
		parentId: '0105',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '放款查询',
		permissionCode: 'jrBoss.report.loans',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/jrboss/report/loans"]',
		icon: 'ele-Histogram',
		routes: [
			{
				path: '/jrboss/report/loans',
				permissionId: '010501',
				orderNumber: 1,
				template: 'jrboss/report/loan-query',
				code: 'jrBoss.report.loans',
				name: '放款查询',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-19T17:24:18.000+08:00',
				updateTime: '2023-05-19T17:24:18.000+08:00'
			}
		]
	},
	{
		id: '010502',
		parentId: '0105',
		orderNumber: 20,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '回款明细',
		permissionCode: 'jrBoss.report.repayment',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/jrboss/report/repayment"]',
		icon: 'ele-Histogram',
		routes: [
			{
				path: '/jrboss/report/repayment',
				permissionId: '010502',
				orderNumber: 1,
				template: 'jrboss/report/payment-query',
				code: 'jrBoss.report.repayment',
				name: '回款明细',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-19T17:24:02.000+08:00',
				updateTime: '2023-05-19T17:24:02.000+08:00'
			}
		]
	},
	{
		id: '010601',
		parentId: '0106',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '人员列表',
		permissionCode: 'jrBoss.business.record',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/jrboss/business/record"]',
		icon: 'ele-Tickets',
		routes: [
			{
				path: '/jrboss/business/record',
				permissionId: '010601',
				orderNumber: 1,
				template: 'jrboss/business/list',
				code: 'jrBoss.business.record',
				name: '人员列表',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-20T11:46:12.000+08:00',
				updateTime: '2023-05-20T11:46:12.000+08:00'
			}
		]
	},
	{
		id: '010701',
		parentId: '0107',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '任务列表',
		permissionCode: 'jrBoss.whiteTask.record',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/jrboss/whitetask/record"]',
		icon: 'fa fa-tasks',
		routes: [
			{
				path: '/jrboss/whitetask/record',
				permissionId: '010701',
				orderNumber: 1,
				template: 'jrboss/white-task/record',
				code: 'jrBoss.whiteTask.record',
				name: '任务列表',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-20T15:20:47.000+08:00',
				updateTime: '2023-05-20T15:20:47.000+08:00'
			},
			{
				path: '/jrboss/whitetask/approve',
				permissionId: '010701',
				orderNumber: 2,
				template: 'jrboss/white-task/approve',
				code: 'jrBoss.whiteTask.approve',
				name: '白名单任务审批',
				keepAlive: 0,
				hidden: 1,
				createTime: '2023-05-20T15:20:47.000+08:00',
				updateTime: '2023-05-20T15:20:47.000+08:00'
			}
		]
	},
	{
		id: '020201',
		parentId: '0202',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '订单列表',
		permissionCode: 'xdBoss.order.list',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/xdboss/order/record"]',
		icon: 'fa fa-list-ul',
		routes: [
			{
				path: '/xdboss/order/list',
				permissionId: '020201',
				orderNumber: 1,
				template: 'xdboss/order/list',
				code: 'xdBoss.order.list',
				name: '订单列表',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-05T15:58:23.000+08:00',
				updateTime: '2023-05-05T15:58:23.000+08:00'
			},
			{
				path: '/xdboss/order/details',
				permissionId: '020201',
				orderNumber: 2,
				template: 'xdboss/order/details',
				code: 'xdBoss.order.details',
				name: '订单详情',
				keepAlive: 0,
				hidden: 1,
				createTime: '2023-05-05T15:58:23.000+08:00',
				updateTime: '2023-05-05T15:58:23.000+08:00'
			}
		]
	},
	{
		id: '020301',
		parentId: '0203',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '待办任务',
		permissionCode: 'xdBoss.task.todo',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/xdboss/task/todo"]',
		icon: 'fa fa-tasks',
		routes: [
			{
				path: '/xdboss/task/todo',
				permissionId: '020301',
				orderNumber: 1,
				template: 'xdboss/task/todo',
				code: 'xdBoss.task.todo',
				name: '待办任务',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-10T13:37:37.000+08:00',
				updateTime: '2023-05-10T13:37:37.000+08:00'
			}
		]
	},
	{
		id: '020302',
		parentId: '0203',
		orderNumber: 20,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '办结任务',
		permissionCode: 'xdBoss.task.history',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/xdboss/task/history"]',
		icon: 'ele-Finished',
		routes: [
			{
				path: '/xdboss/task/history',
				permissionId: '020302',
				orderNumber: 1,
				template: 'xdboss/task/history',
				code: 'xdBoss.task.history',
				name: '办结任务',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-10T14:25:41.000+08:00',
				updateTime: '2023-05-10T14:25:41.000+08:00'
			}
		]
	},
	{
		id: '020401',
		parentId: '0204',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '借据查询',
		permissionCode: 'xdBoss.financial.receipt',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/xdboss/financial/receipt"]',
		icon: 'iconfont icon-zhongduancanshuchaxun',
		routes: [
			{
				path: '/xdboss/financial/receipt',
				permissionId: '020401',
				orderNumber: 1,
				template: 'xdboss/financial/receipt',
				code: 'xdBoss.financial.receipt',
				name: '借据查询',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-12T11:33:55.000+08:00',
				updateTime: '2023-05-12T11:33:55.000+08:00'
			},
			{
				path: '/xdboss/financial/receiptDetails',
				permissionId: '020401',
				orderNumber: 2,
				template: 'xdboss/financial/receipt-details',
				code: 'xdBoss.financial.receiptDetails',
				name: '借据详情',
				keepAlive: 0,
				hidden: 1,
				createTime: '2023-05-12T11:33:55.000+08:00',
				updateTime: '2023-05-12T11:33:55.000+08:00'
			},
			{
				path: '/xdboss/financial/receiptOffline',
				permissionId: '020401',
				orderNumber: 3,
				template: 'xdboss/financial/receipt-offline',
				code: 'xdBoss.financial.receiptOffline',
				name: '线下登账',
				keepAlive: 0,
				hidden: 1,
				createTime: '2023-05-12T11:33:55.000+08:00',
				updateTime: '2023-05-12T11:33:55.000+08:00'
			},
			{
				path: '/xdboss/financial/receiptDerate',
				permissionId: '020401',
				orderNumber: 4,
				template: 'xdboss/financial/receipt-derate',
				code: 'xdBoss.financial.receiptDerate',
				name: '线下申请还款',
				keepAlive: 0,
				hidden: 1,
				createTime: '2023-05-12T11:33:55.000+08:00',
				updateTime: '2023-05-12T11:33:55.000+08:00'
			}
		]
	},
	{
		id: '02040301',
		parentId: '020403',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '批量债转查询',
		permissionCode: 'xdBoss.financial.debtTransfer.query',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/xdboss/financial/debtTransfer/query"]',
		icon: 'iconfont icon-zhongduancanshuchaxun',
		routes: [
			{
				path: '/xdboss/financial/debtTransfer/query',
				permissionId: '02040301',
				orderNumber: 1,
				template: 'xdboss/financial/debtTransfer-query',
				code: 'xdBoss.financial.debtTransfer.query',
				name: '批量债转查询',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-12T11:19:24.000+08:00',
				updateTime: '2023-05-12T11:19:24.000+08:00'
			},
			{
				path: '/xdboss/financial/debtTransfer/query/details',
				permissionId: '02040301',
				orderNumber: 2,
				template: 'xdboss/task/debtTransfer',
				code: 'xdBoss.financial.debtTransfer.queryDetails',
				name: '批量债转查询明细',
				keepAlive: 0,
				hidden: 1,
				createTime: '2023-05-12T11:19:24.000+08:00',
				updateTime: '2023-05-12T11:19:24.000+08:00'
			},
			{
				path: '/xdboss/financial/debtTransfer/apply',
				permissionId: '02040301',
				orderNumber: 3,
				template: 'xdboss/financial/debtTransfer-apply',
				code: 'xdBoss.financial.debtTransfer.debtTransferApply',
				name: '发起债转申请',
				keepAlive: 0,
				hidden: 1,
				createTime: '2023-05-12T11:19:24.000+08:00',
				updateTime: '2023-05-12T11:19:24.000+08:00'
			}
		]
	},
	{
		id: '02040302',
		parentId: '020403',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '债转明细查询',
		permissionCode: 'xdBoss.financial.debtTransfer.details',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/xdboss/financial/debtTransfer/details"]',
		icon: 'iconfont icon--chaifenlie',
		routes: [
			{
				path: '/xdboss/financial/debtTransfer/details',
				permissionId: '02040302',
				orderNumber: 1,
				template: 'xdboss/financial/debtTransfer-details',
				code: 'xdBoss.financial.debtTransfer.details',
				name: '债转明细查询',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-11T15:14:30.000+08:00',
				updateTime: '2023-05-11T15:14:30.000+08:00'
			}
		]
	},
	{
		id: '020404',
		parentId: '0204',
		orderNumber: 11,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '金融办上报',
		permissionCode: 'xdBoss.financial.office',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/xdboss/financial/office"]',
		icon: 'ele-OfficeBuilding',
		routes: [
			{
				path: '/xdboss/financial/office-report',
				permissionId: '020404',
				orderNumber: 1,
				template: 'xdboss/financial/office-report',
				code: 'xdBoss.financial.office',
				name: '金融办上报',
				keepAlive: 0,
				hidden: 0,
				createTime: '2023-05-15T16:10:58.000+08:00',
				updateTime: '2023-05-15T16:10:58.000+08:00'
			}
		]
	},
	{
		id: '02050101',
		parentId: '020501',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '编辑权限',
		permissionCode: 'xdBoss.report.onloan.edit',
		permissionType: 'POINT',
		otherInfo: null,
		urls: '["/xdboss/report/onloan/edit"]',
		icon: 'ele-Edit',
		routes: []
	},
	{
		id: '02050102',
		parentId: '020501',
		orderNumber: 20,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '查询权限',
		permissionCode: 'xdBoss.report.onloan.search',
		permissionType: 'POINT',
		otherInfo: null,
		urls: '["/xdboss/report/onloan/search"]',
		icon: 'ele-Search',
		routes: []
	},
	{
		id: '020502',
		parentId: '0205',
		orderNumber: 11,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '放款明细查询',
		permissionCode: 'xdBoss.report.loans',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/xdboss/report/loans"]',
		icon: 'ele-Histogram',
		routes: [
			{
				path: '/xdboss/report/loan-query',
				permissionId: '020502',
				orderNumber: 1,
				template: 'xdboss/report/loan-query',
				code: 'xdBoss.report.loans',
				name: '放款明细查询',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-16T17:57:49.000+08:00',
				updateTime: '2023-05-16T17:57:49.000+08:00'
			},
			{
				path: '/xdboss/report/loan-query-details',
				permissionId: '020502',
				orderNumber: 2,
				template: 'xdboss/financial/receipt-details',
				code: 'xdBoss.report.receiptLoansDetails',
				name: '借据详情',
				keepAlive: 0,
				hidden: 1,
				createTime: '2023-05-16T17:57:49.000+08:00',
				updateTime: '2023-05-16T17:57:49.000+08:00'
			}
		]
	},
	{
		id: '020503',
		parentId: '0205',
		orderNumber: 12,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '结算明细查询',
		permissionCode: 'xdBoss.report.settlement',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/xdboss/report/settlement"]',
		icon: 'ele-Histogram',
		routes: [
			{
				path: '/xdboss/report/settlement-query',
				permissionId: '020503',
				orderNumber: 1,
				template: 'xdboss/report/settlement-query',
				code: 'xdBoss.report.settlement',
				name: '结算明细查询',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-16T17:57:34.000+08:00',
				updateTime: '2023-05-16T17:57:34.000+08:00'
			},
			{
				path: '/xdboss/report/settlement-query-details',
				permissionId: '020503',
				orderNumber: 2,
				template: 'xdboss/financial/receipt-details',
				code: 'xdBoss.report.receiptSettlementDetails',
				name: '借据详情',
				keepAlive: 0,
				hidden: 1,
				createTime: '2023-05-16T17:57:34.000+08:00',
				updateTime: '2023-05-16T17:57:34.000+08:00'
			}
		]
	},
	{
		id: '020504',
		parentId: '0205',
		orderNumber: 13,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '回款明细查询',
		permissionCode: 'xdBoss.report.payment',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/xdboss/report/payment"]',
		icon: 'ele-Histogram',
		routes: [
			{
				path: '/xdboss/report/payment',
				permissionId: '020504',
				orderNumber: 1,
				template: 'xdboss/report/payment-query',
				code: 'xdBoss.report.payment',
				name: '回款明细查询',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-16T17:57:17.000+08:00',
				updateTime: '2023-05-16T17:57:17.000+08:00'
			},
			{
				path: '/xdboss/report/payment-query-details',
				permissionId: '020504',
				orderNumber: 2,
				template: 'xdboss/financial/receipt-details',
				code: 'xdBoss.report.receiptPaymentDetails',
				name: '借据详情',
				keepAlive: 0,
				hidden: 1,
				createTime: '2023-05-16T17:57:17.000+08:00',
				updateTime: '2023-05-16T17:57:17.000+08:00'
			}
		]
	},
	{
		id: '020505',
		parentId: '0205',
		orderNumber: 14,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '溢缴款明细查询',
		permissionCode: 'xdBoss.report.overpayment',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/xdboss/report/overpayment"]',
		icon: 'ele-Histogram',
		routes: [
			{
				path: '/xdboss/report/overpayment',
				permissionId: '020505',
				orderNumber: 1,
				template: 'xdboss/report/overpayment-query',
				code: 'xdBoss.report.overpayment',
				name: '溢缴款明细查询',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-16T17:56:53.000+08:00',
				updateTime: '2023-05-16T17:56:53.000+08:00'
			}
		]
	},
	{
		id: '020601',
		parentId: '0206',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '客户列表',
		permissionCode: 'xdBoss.user.record',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/xdboss/user/record"]',
		icon: 'ele-List',
		routes: [
			{
				path: '/xdboss/user/list',
				permissionId: '020601',
				orderNumber: 1,
				template: 'xdboss/user/list',
				code: 'xdBoss.user.record',
				name: '客户列表',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-15T11:13:06.000+08:00',
				updateTime: '2023-05-15T11:13:06.000+08:00'
			},
			{
				path: '/xdboss/user/details',
				permissionId: '020601',
				orderNumber: 2,
				template: 'xdboss/user/details',
				code: 'xdBoss.user.details',
				name: '客户详情',
				keepAlive: 0,
				hidden: 1,
				createTime: '2023-05-15T11:13:06.000+08:00',
				updateTime: '2023-05-15T11:13:06.000+08:00'
			}
		]
	},
	{
		id: '020701',
		parentId: '0207',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '任务列表',
		permissionCode: 'xdBoss.collection.task',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/xdboss/collection/task"]',
		icon: 'fa fa-tasks',
		routes: [
			{
				path: '/xdboss/collection/task',
				permissionId: '020701',
				orderNumber: 1,
				template: 'xdboss/collection/task',
				code: 'xdBoss.collection.task',
				name: '任务列表',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-20T16:19:58.000+08:00',
				updateTime: '2023-05-20T16:19:58.000+08:00'
			},
			{
				path: '/xdboss/collection/approve',
				permissionId: '020701',
				orderNumber: 2,
				template: 'xdboss/collection/approve',
				code: 'xdBoss.collection.approve',
				name: '任务审批',
				keepAlive: 0,
				hidden: 1,
				createTime: '2023-05-20T16:19:58.000+08:00',
				updateTime: '2023-05-20T16:19:58.000+08:00'
			}
		]
	},
	{
		id: '03020101',
		parentId: '030201',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '编辑权限',
		permissionCode: 'jfManage.permission.menu.edit',
		permissionType: 'POINT',
		otherInfo: null,
		urls: '["/jfmanage/permission/menu/edit"]',
		icon: 'ele-Edit',
		routes: []
	},
	{
		id: '03020102',
		parentId: '030201',
		orderNumber: 20,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '查询权限',
		permissionCode: 'jfManage.permission.menu.search',
		permissionType: 'POINT',
		otherInfo: null,
		urls: '["/jfmanage/permission/menu/search"]',
		icon: 'ele-Search',
		routes: []
	},
	{
		id: '03020201',
		parentId: '030202',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '编辑权限',
		permissionCode: 'jfManage.permission.role.edit',
		permissionType: 'POINT',
		otherInfo: null,
		urls: '["/jfmanage/permission/role/edit"]',
		icon: 'ele-Edit',
		routes: []
	},
	{
		id: '03020202',
		parentId: '030202',
		orderNumber: 20,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '查询权限',
		permissionCode: 'jfManage.permission.role.search',
		permissionType: 'POINT',
		otherInfo: null,
		urls: '["/jfmanage/permission/role/search"]',
		icon: 'ele-Search',
		routes: []
	},
	{
		id: '03020301',
		parentId: '030203',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '编辑权限',
		permissionCode: 'jfManage.permission.operator.edit',
		permissionType: 'POINT',
		otherInfo: null,
		urls: '["/jfmanage/permission/operator/edit"]',
		icon: 'ele-Edit',
		routes: []
	},
	{
		id: '03020302',
		parentId: '030203',
		orderNumber: 20,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '查询权限',
		permissionCode: 'jfManage.permission.operator.search',
		permissionType: 'POINT',
		otherInfo: null,
		urls: '["/jfmanage/permission/operator/search"]',
		icon: 'ele-Search',
		routes: []
	},
	{
		id: '030301',
		parentId: '0303',
		orderNumber: 30,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '敏感词过滤',
		permissionCode: 'jfManage.system.sensitive',
		permissionType: 'MENU',
		otherInfo: '',
		urls: '["/jfmanage/system/sensitive"]',
		icon: 'fa fa-search',
		routes: [
			{
				path: '/jfmanage/system/sensitive',
				permissionId: '030301',
				orderNumber: 1,
				template: 'jfmanage/system/sensitive',
				code: 'jfManage.system.sensitive',
				name: '敏感词过滤',
				keepAlive: 0,
				hidden: 0,
				createTime: '2023-05-16T10:46:22.000+08:00',
				updateTime: '2023-05-16T10:46:22.000+08:00'
			}
		]
	},
	{
		id: '030302',
		parentId: '0303',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '对账查询',
		permissionCode: 'jfManage.system.reconciliation',
		permissionType: 'MENU',
		otherInfo: '',
		urls: '["/jfmanage/system/reconciliation"]',
		icon: 'ele-Memo',
		routes: [
			{
				path: '/jfmanage/system/reconciliation',
				permissionId: '030302',
				orderNumber: 1,
				template: 'jfmanage/system/reconciliation',
				code: 'jfManage.system.reconciliation',
				name: '对账查询',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-16T10:48:05.000+08:00',
				updateTime: '2023-05-16T10:48:05.000+08:00'
			}
		]
	},
	{
		id: '030303',
		parentId: '0303',
		orderNumber: 20,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '关账查询',
		permissionCode: 'jfManage.system.accountingClose',
		permissionType: 'MENU',
		otherInfo: '',
		urls: '["/jfmanage/system/accounting"]',
		icon: 'ele-Calendar',
		routes: [
			{
				path: '/jfmanage/system/accounting-close',
				permissionId: '030303',
				orderNumber: 1,
				template: 'jfmanage/system/accounting-close',
				code: 'jfManage.system.accountingClose',
				name: '关账查询',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-16T10:49:36.000+08:00',
				updateTime: '2023-05-16T10:49:36.000+08:00'
			}
		]
	},
	{
		id: '030401',
		parentId: '0304',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '模板管理',
		permissionCode: 'jfManage.note.template',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/jfmanage/note/template"]',
		icon: 'ele-Iphone',
		routes: [
			{
				path: '/jfmanage/note/template',
				permissionId: '030401',
				orderNumber: 1,
				template: 'jfmanage/note/template',
				code: 'jfManage.note.template',
				name: '模板管理',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-17T10:46:33.000+08:00',
				updateTime: '2023-05-17T10:46:33.000+08:00'
			}
		]
	},
	{
		id: '030402',
		parentId: '0304',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '批量发送',
		permissionCode: 'jfManage.note.send',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/jfmanage/note/send"]',
		icon: 'fa fa-telegram',
		routes: [
			{
				path: '/jfmanage/note/send',
				permissionId: '030402',
				orderNumber: 1,
				template: 'jfmanage/note/send',
				code: 'jfManage.note.send',
				name: '批量发送',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-17T10:47:53.000+08:00',
				updateTime: '2023-05-17T10:47:53.000+08:00'
			}
		]
	},
	{
		id: '030403',
		parentId: '0304',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '批次查询',
		permissionCode: 'jfManage.note.batch',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/jfmanage/note/batch"]',
		icon: 'ele-ChatLineSquare',
		routes: [
			{
				path: '/jfmanage/note/batch',
				permissionId: '030403',
				orderNumber: 1,
				template: 'jfmanage/note/batch',
				code: 'jfManage.note.batch',
				name: '批次查询',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-17T10:49:03.000+08:00',
				updateTime: '2023-05-17T10:49:03.000+08:00'
			}
		]
	},
	{
		id: '030404',
		parentId: '0304',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '历史短信查询',
		permissionCode: 'jfManage.note.history',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/jfmanage/note/history"]',
		icon: 'fa fa-history',
		routes: [
			{
				path: '/jfmanage/note/history',
				permissionId: '030404',
				orderNumber: 1,
				template: 'jfmanage/note/history',
				code: 'jfManage.note.history',
				name: '历史短信查询',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-17T10:50:06.000+08:00',
				updateTime: '2023-05-17T10:50:06.000+08:00'
			}
		]
	},
	{
		id: '030501',
		parentId: '0305',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '客户列表',
		permissionCode: 'jfManage.user.record',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/jfmanage/user/record"]',
		icon: 'fa fa-user-circle-o',
		routes: [
			{
				path: '/jfmanage/user/record',
				permissionId: '030501',
				orderNumber: 1,
				template: 'jfmanage/user/record',
				code: 'jfManage.user.record',
				name: '客户列表',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-17T15:23:00.000+08:00',
				updateTime: '2023-05-17T15:23:00.000+08:00'
			}
		]
	},
	{
		id: '030601',
		parentId: '0306',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '公告列表',
		permissionCode: 'jfManage.notice.record',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/jfmanage/notice/record"]',
		icon: 'ele-Tickets',
		routes: [
			{
				path: '/jfmanage/notice/record',
				permissionId: '030601',
				orderNumber: 1,
				template: 'jfmanage/notice/record',
				code: 'jfManage.notice.record',
				name: '公告列表',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-17T15:30:51.000+08:00',
				updateTime: '2023-05-17T15:30:51.000+08:00'
			}
		]
	},
	{
		id: '0102',
		parentId: '01',
		orderNumber: 20,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '订单管理',
		permissionCode: 'jrBoss.order',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/jrboss/order"]',
		icon: 'ele-Document',
		routes: [
			{
				path: '/jrboss/order',
				permissionId: '0102',
				orderNumber: 1,
				template: 'layout/routerView/parent',
				code: 'jrBoss.order.index',
				name: '订单管理',
				keepAlive: 0,
				hidden: 0,
				createTime: '2023-05-09T14:23:39.000+08:00',
				updateTime: '2023-05-09T14:23:39.000+08:00'
			}
		]
	},
	{
		id: '0103',
		parentId: '01',
		orderNumber: 30,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '任务管理',
		permissionCode: 'jrBoss.task',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/jrboss/task","/jrboss/task/details"]',
		icon: 'iconfont icon-putong',
		routes: [
			{
				path: '/jrboss/task',
				permissionId: '0103',
				orderNumber: 1,
				template: 'layout/routerView/parent',
				code: 'jrBoss.task.index',
				name: '任务管理',
				keepAlive: 0,
				hidden: 0,
				createTime: '2023-05-09T14:24:06.000+08:00',
				updateTime: '2023-05-09T14:24:06.000+08:00'
			},
			{
				path: '/jrboss/task/details',
				permissionId: '0103',
				orderNumber: 2,
				template: 'jrboss/task/details',
				code: 'jrBoss.task.details',
				name: '任务详情',
				keepAlive: 0,
				hidden: 1,
				createTime: '2023-05-09T14:24:06.000+08:00',
				updateTime: '2023-05-09T14:24:06.000+08:00'
			}
		]
	},
	{
		id: '0104',
		parentId: '01',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '渠道管理',
		permissionCode: 'jrBoss.channel',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/jrboss/channel"]',
		icon: 'iconfont icon-bolangnengshiyanchang',
		routes: [
			{
				path: '/jrboss/channel',
				permissionId: '0104',
				orderNumber: 1,
				template: 'layout/routerView/parent',
				code: 'jrBoss.channel.index',
				name: '渠道管理',
				keepAlive: 0,
				hidden: 0,
				createTime: '2023-05-18T13:54:03.000+08:00',
				updateTime: '2023-05-18T13:54:03.000+08:00'
			}
		]
	},
	{
		id: '0105',
		parentId: '01',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '统计报表',
		permissionCode: 'jrBoss.report',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/jrboss/report"]',
		icon: 'ele-Coin',
		routes: [
			{
				path: '/jrboss/report',
				permissionId: '0105',
				orderNumber: 1,
				template: 'layout/routerView/parent',
				code: 'jrBoss.report.index',
				name: '统计报表',
				keepAlive: 0,
				hidden: 0,
				createTime: '2023-05-19T17:20:52.000+08:00',
				updateTime: '2023-05-19T17:20:52.000+08:00'
			}
		]
	},
	{
		id: '0106',
		parentId: '01',
		orderNumber: 30,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '业务岗管理',
		permissionCode: 'jrBoss.business',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/jrboss/business"]',
		icon: 'ele-Avatar',
		routes: [
			{
				path: '/jrboss/business',
				permissionId: '0106',
				orderNumber: 1,
				template: 'layout/routerView/parent',
				code: 'jrBoss.business.index',
				name: '业务岗管理',
				keepAlive: 0,
				hidden: 0,
				createTime: '2023-05-20T11:44:50.000+08:00',
				updateTime: '2023-05-20T11:44:50.000+08:00'
			}
		]
	},
	{
		id: '0107',
		parentId: '01',
		orderNumber: 30,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '白名单任务',
		permissionCode: 'jrBoss.whiteTask',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/jrboss/whitetask"]',
		icon: 'fa fa-address-book-o',
		routes: [
			{
				path: '/jrboss/whitetask',
				permissionId: '0107',
				orderNumber: 1,
				template: 'layout/routerView/parent',
				code: 'jrBoss.whiteTask.index',
				name: '白名单任务',
				keepAlive: 0,
				hidden: 0,
				createTime: '2023-05-20T11:47:57.000+08:00',
				updateTime: '2023-05-20T11:47:57.000+08:00'
			}
		]
	},
	{
		id: '0202',
		parentId: '02',
		orderNumber: 20,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '订单管理',
		permissionCode: 'xdBoss.order',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/xdboss/order"]',
		icon: 'ele-Document',
		routes: [
			{
				path: '/xdboss/order',
				permissionId: '0202',
				orderNumber: 1,
				template: 'layout/routerView/parent',
				code: 'xdBoss.order.index',
				name: '订单管理',
				keepAlive: 0,
				hidden: 0,
				createTime: '2023-05-05T15:57:45.000+08:00',
				updateTime: '2023-05-05T15:57:45.000+08:00'
			}
		]
	},
	{
		id: '0203',
		parentId: '02',
		orderNumber: 30,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '任务管理',
		permissionCode: 'xdBoss.task',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/xdboss/task"]',
		icon: 'iconfont icon-putong',
		routes: [
			{
				path: '/xdboss/task',
				permissionId: '0203',
				orderNumber: 1,
				template: 'layout/routerView/parent',
				code: 'xdBoss.task.index',
				name: '任务管理',
				keepAlive: 0,
				hidden: 0,
				createTime: '2023-05-10T14:26:10.000+08:00',
				updateTime: '2023-05-10T14:26:10.000+08:00'
			},
			{
				path: '/xdboss/task/debtTransfer',
				permissionId: '0203',
				orderNumber: 2,
				template: 'xdboss/task/debtTransfer',
				code: 'xdBoss.task.debtTransfer',
				name: '债转任务',
				keepAlive: 0,
				hidden: 1,
				createTime: '2023-05-10T14:26:10.000+08:00',
				updateTime: '2023-05-10T14:26:10.000+08:00'
			}
		]
	},
	{
		id: '0204',
		parentId: '02',
		orderNumber: 12,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '财务管理',
		permissionCode: 'xdBoss.financial',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/xdboss/financial"]',
		icon: 'iconfont icon-juxingkaobei',
		routes: [
			{
				path: '/xdboss/financial',
				permissionId: '0204',
				orderNumber: 1,
				template: 'layout/routerView/parent',
				code: 'xdBoss.financial.index',
				name: '财务管理',
				keepAlive: 0,
				hidden: 0,
				createTime: '2023-05-12T14:28:48.000+08:00',
				updateTime: '2023-05-12T14:28:48.000+08:00'
			}
		]
	},
	{
		id: '020403',
		parentId: '0204',
		orderNumber: 20,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '债转查询',
		permissionCode: 'xdBoss.financial.debtTransfer',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/xdboss/financial/debtTransfer"]',
		icon: 'iconfont icon-diannao1',
		routes: [
			{
				path: '/xdboss/financial/debtTransfer',
				permissionId: '020403',
				orderNumber: 1,
				template: 'layout/routerView/parent',
				code: 'xdBoss.financial.debtTransfer.index',
				name: '债转查询',
				keepAlive: 0,
				hidden: 0,
				createTime: '2023-05-10T15:32:00.000+08:00',
				updateTime: '2023-05-10T15:32:00.000+08:00'
			}
		]
	},
	{
		id: '0205',
		parentId: '02',
		orderNumber: 11,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '统计报表',
		permissionCode: 'xdBoss.report',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/xdboss/report"]',
		icon: 'ele-Coin',
		routes: [
			{
				path: '/xdboss/report',
				permissionId: '0205',
				orderNumber: 1,
				template: 'layout/routerView/parent',
				code: 'xdBoss.report.index',
				name: '统计报表',
				keepAlive: 0,
				hidden: 0,
				createTime: '2023-05-12T14:30:27.000+08:00',
				updateTime: '2023-05-12T14:30:27.000+08:00'
			}
		]
	},
	{
		id: '020501',
		parentId: '0205',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '在贷明细查询',
		permissionCode: 'xdBoss.report.onloan',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/xdboss/report/onloan"]',
		icon: 'ele-Histogram',
		routes: [
			{
				path: '/xdboss/report/loan-progress',
				permissionId: '020501',
				orderNumber: 1,
				template: 'xdboss/report/loan-progress',
				code: 'xdBoss.report.onloan',
				name: '在贷明细查询',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-16T17:58:01.000+08:00',
				updateTime: '2023-05-16T17:58:01.000+08:00'
			},
			{
				path: '/xdboss/report/loan-progress-details',
				permissionId: '020501',
				orderNumber: 2,
				template: 'xdboss/financial/receipt-details',
				code: 'xdBoss.report.receiptOnloanDetails',
				name: '借据详情',
				keepAlive: 0,
				hidden: 1,
				createTime: '2023-05-16T17:58:01.000+08:00',
				updateTime: '2023-05-16T17:58:01.000+08:00'
			}
		]
	},
	{
		id: '0206',
		parentId: '02',
		orderNumber: 13,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '客户管理',
		permissionCode: 'xdBoss.user',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/xdboss/user"]',
		icon: 'ele-UserFilled',
		routes: [
			{
				path: '/xdboss/user',
				permissionId: '0206',
				orderNumber: 1,
				template: 'layout/routerView/parent',
				code: 'xdBoss.user.index',
				name: '客户管理',
				keepAlive: 0,
				hidden: 0,
				createTime: '2023-05-15T10:53:07.000+08:00',
				updateTime: '2023-05-15T10:53:07.000+08:00'
			}
		]
	},
	{
		id: '0207',
		parentId: '02',
		orderNumber: 14,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '催收管理',
		permissionCode: 'xdBoss.collection',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/xdboss/collection"]',
		icon: 'ele-Collection',
		routes: [
			{
				path: '/xdboss/collection',
				permissionId: '0207',
				orderNumber: 1,
				template: 'layout/routerView/parent',
				code: 'xdBoss.collection.index',
				name: '催收管理',
				keepAlive: 0,
				hidden: 0,
				createTime: '2023-05-20T16:17:56.000+08:00',
				updateTime: '2023-05-20T16:17:56.000+08:00'
			}
		]
	},
	{
		id: '030201',
		parentId: '0302',
		orderNumber: 30,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '菜单管理',
		permissionCode: 'jfManage.permission.menu',
		permissionType: 'MENU',
		otherInfo: '',
		urls: '["/jfmanage/permission/menu"]',
		icon: 'iconfont icon-caidan',
		routes: [
			{
				path: '/jfmanage/permission/menu',
				permissionId: '030201',
				orderNumber: null,
				template: 'jfmanage/permission/menu',
				code: 'jfManage.permission.menu.index',
				name: '菜单管理',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-03-23T14:30:22.000+08:00',
				updateTime: '2023-03-23T14:30:22.000+08:00'
			}
		]
	},
	{
		id: '030202',
		parentId: '0302',
		orderNumber: 20,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '角色管理',
		permissionCode: 'jfManage.permission.role',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/jfmanage/permission/role"]',
		icon: 'iconfont icon-shuxingtu',
		routes: [
			{
				path: '/jfmanage/permission/role',
				permissionId: '030202',
				orderNumber: 1,
				template: 'jfmanage/permission/role',
				code: 'jfManage.permission.role.index',
				name: '角色管理',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-04-12T10:00:24.000+08:00',
				updateTime: '2023-04-12T10:00:24.000+08:00'
			},
			{
				path: '/jfmanage/permission/role/details',
				permissionId: '030202',
				orderNumber: 2,
				template: 'jfmanage/permission/role-details',
				code: 'jfManage.permission.role.details',
				name: '角色详情',
				keepAlive: 0,
				hidden: 1,
				createTime: '2023-04-12T10:00:24.000+08:00',
				updateTime: '2023-04-12T10:00:24.000+08:00'
			}
		]
	},
	{
		id: '030203',
		parentId: '0302',
		orderNumber: 10,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '操作员管理',
		permissionCode: 'jfManage.permission.operator',
		permissionType: 'MENU',
		otherInfo: null,
		urls: '["/jfmanage/permission/operator"]',
		icon: 'ele-UserFilled',
		routes: [
			{
				path: '/jfmanage/permission/operator',
				permissionId: '030203',
				orderNumber: 1,
				template: 'jfmanage/permission/operator',
				code: 'jfManage.permission.operator.index',
				name: '操作员管理',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-04-12T10:31:46.000+08:00',
				updateTime: '2023-04-12T10:31:46.000+08:00'
			},
			{
				path: '/jfmanage/permission/operator/details',
				permissionId: '030203',
				orderNumber: 2,
				template: 'jfmanage/permission/operator-details',
				code: 'jfManage.permission.operator.details',
				name: '操作员详情',
				keepAlive: 0,
				hidden: 1,
				createTime: '2023-04-12T10:31:46.000+08:00',
				updateTime: '2023-04-12T10:31:46.000+08:00'
			}
		]
	},
	{
		id: '0303',
		parentId: '03',
		orderNumber: 30,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '系统工具',
		permissionCode: 'jfManage.system',
		permissionType: 'MENU',
		otherInfo: '',
		urls: '["/jfmanage/system"]',
		icon: 'fa fa-assistive-listening-systems',
		routes: [
			{
				path: '/jfmanage/system',
				permissionId: '0303',
				orderNumber: 1,
				template: 'layout/routerView/parent',
				code: 'jfManage.system.index',
				name: '系统工具',
				keepAlive: 0,
				hidden: 0,
				createTime: '2023-05-16T10:43:59.000+08:00',
				updateTime: '2023-05-16T10:43:59.000+08:00'
			}
		]
	},
	{
		id: '0304',
		parentId: '03',
		orderNumber: 40,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '短信管理',
		permissionCode: 'jfManage.note',
		permissionType: 'MENU',
		otherInfo: '',
		urls: '["/jfmanage/note"]',
		icon: 'fa fa-sticky-note',
		routes: [
			{
				path: '/jfmanage/note',
				permissionId: '0304',
				orderNumber: 1,
				template: 'layout/routerView/parent',
				code: 'jfManage.note.index',
				name: '短信管理',
				keepAlive: 0,
				hidden: 0,
				createTime: '2023-05-17T10:43:05.000+08:00',
				updateTime: '2023-05-17T10:43:05.000+08:00'
			}
		]
	},
	{
		id: '0305',
		parentId: '03',
		orderNumber: 40,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '客户管理',
		permissionCode: 'jfManage.user',
		permissionType: 'MENU',
		otherInfo: '',
		urls: '["/jfmanage/user"]',
		icon: 'fa fa-user-secret',
		routes: [
			{
				path: '/jfmanage/user',
				permissionId: '0305',
				orderNumber: 1,
				template: 'layout/routerView/parent',
				code: 'jfManage.user.index',
				name: '客户管理',
				keepAlive: 0,
				hidden: 0,
				createTime: '2023-05-17T15:19:46.000+08:00',
				updateTime: '2023-05-17T15:19:46.000+08:00'
			}
		]
	},
	{
		id: '0306',
		parentId: '03',
		orderNumber: 40,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '公告管理',
		permissionCode: 'jfManage.notice',
		permissionType: 'MENU',
		otherInfo: '',
		urls: '["/jfmanage/notice"]',
		icon: 'iconfont icon-zhongduancanshuchaxun',
		routes: [
			{
				path: '/jfmanage/notice',
				permissionId: '0306',
				orderNumber: 1,
				template: 'layout/routerView/parent',
				code: 'jfManage.notice.index',
				name: '公告管理',
				keepAlive: 0,
				hidden: 0,
				createTime: '2023-05-17T15:29:13.000+08:00',
				updateTime: '2023-05-17T15:29:13.000+08:00'
			}
		]
	},
	{
		id: '01',
		parentId: '-1',
		orderNumber: 1,
		systemId: 'boss',
		systemType: 'PC',
		permissionName: '金融boss',
		permissionCode: 'jrBoss.index',
		permissionType: 'MENU',
		otherInfo: 'BJJR',
		urls: '["/jrboss"]',
		icon: 'ele-Monitor',
		routes: [
			{
				path: '/jrboss',
				permissionId: '01',
				orderNumber: 1,
				template: 'layout/routerView/parent',
				code: 'jrBoss.index',
				name: '金融boss',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-05-05T10:10:25.000+08:00',
				updateTime: '2023-05-05T10:10:25.000+08:00'
			}
		]
	},
	{
		id: '02',
		parentId: '-1',
		orderNumber: 2,
		systemId: 'boss',
		systemType: 'PC',
		permissionName: '小贷boss',
		permissionCode: 'xdBoss.index',
		permissionType: 'MENU',
		otherInfo: 'YCXD',
		urls: '["/xdboss"]',
		icon: 'ele-Monitor',
		routes: [
			{
				path: '/xdboss',
				permissionId: '02',
				orderNumber: null,
				template: 'layout/routerView/parent',
				code: 'xdBoss.index',
				name: '小贷boss',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-03-21T14:53:01.000+08:00',
				updateTime: '2023-03-21T14:54:22.000+08:00'
			}
		]
	},
	{
		id: '03',
		parentId: '-1',
		orderNumber: 3,
		systemId: 'boss',
		systemType: 'PC',
		permissionName: '综合管理',
		permissionCode: 'jfManage.index',
		permissionType: 'MENU',
		otherInfo: 'BJKG',
		urls: '["/jfmanage"]',
		icon: 'ele-Monitor',
		routes: [
			{
				path: '/jfmanage',
				permissionId: '03',
				orderNumber: null,
				template: 'layout/routerView/parent',
				code: 'jfManage.index',
				name: '综合管理',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-03-20T17:37:06.000+08:00',
				updateTime: '2023-03-20T17:54:17.000+08:00'
			}
		]
	},
	{
		id: '0302',
		parentId: '03',
		orderNumber: 20,
		systemId: 'boss',
		systemType: 'pc',
		permissionName: '权限管理',
		permissionCode: 'jfManage.permission',
		permissionType: 'MENU',
		otherInfo: '',
		urls: '["/jfmanage/permission"]',
		icon: 'iconfont icon-quanxian',
		routes: [
			{
				path: '/jfmanage/permission',
				permissionId: '0302',
				orderNumber: null,
				template: 'layout/routerView/parent',
				code: 'jfManage.permission.index',
				name: '权限管理',
				keepAlive: 1,
				hidden: 0,
				createTime: '2023-03-23T14:45:36.000+08:00',
				updateTime: '2023-03-23T14:45:36.000+08:00'
			}
		]
	}
];
