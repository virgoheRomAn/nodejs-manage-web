// 定义内容
export default {
	select: 'select system',
	home: 'home',
	jrBoss: {
		index: 'jrBoss',
		home: 'home',
		order: { index: 'order', list: 'order list', details: 'order details', repayment: 'Offline repayment' },
		task: { index: 'task', todo: 'todo', details: 'details', approve: 'approve' },
		report: {
			index: 'report',
			loans: 'loans query',
			repayment: 'repayment query'
		},
		channel: {
			index: 'channel manage',
			add: 'channel add',
			record: 'channel record',
			details: 'channel details'
		},
		business: {
			index: 'business manage',
			record: 'business record'
		},
		whiteTask: {
			index: 'white task',
			record: 'white record',
			approve: 'white approve'
		}
	},
	xdBoss: {
		index: 'xdBoss',
		home: 'home',
		order: { index: 'order', list: 'order list', details: 'order details' },
		task: {
			index: 'task',
			todo: 'todo',
			history: 'history',
			todoDetails: 'todo details',
			approve: 'approve',
			historyDetails: 'history details',
			debtTransfer: 'debtTransfer'
		},
		financial: {
			index: 'financial',
			office: 'office report',
			receipt: 'receipt',
			receiptDetails: 'receipt details',
			receiptOffline: 'receipt offline',
			receiptDerate: 'receipt derate',
			verification: { index: 'verification', query: 'verification query', details: 'verification details' },
			debtTransfer: {
				index: 'debtTransfer',
				query: 'debtTransfer query',
				queryDetails: 'debtTransfer queryDetails',
				details: 'debtTransfer details',
				debtTransferApply: 'debtTransfer apply'
			}
		},
		collection: {
			index: 'collection',
			task: 'task',
			approve: 'approve',
			searchuser: 'searchuser',
			searchuserDetails: 'searchuser details',
			outourcing: 'outourcing',
			outourcingDetails: 'outourcing details',
			classStatistics: 'classStatistics'
		},
		report: {
			index: 'report',
			onloan: 'onloan query',
			loans: 'loans query',
			payment: 'payment query',
			overpayment: 'overpayment query',
			settlement: 'settlement query',
			receiptOnloanDetails: 'onloan receipt details',
			receiptLoansDetails: 'loans receipt details',
			receiptPaymentDetails: 'payment receipt details',
			receiptSettlementDetails: 'settlement receipt details'
		},
		user: {
			index: 'customers',
			record: 'customers record',
			details: 'customers details'
		}
	},
	jfManage: {
		index: 'Manage',
		home: 'home',
		permission: {
			index: 'permission',
			operator: { index: 'operator', details: 'operator details', add: 'add operator', edit: 'edit operator' },
			role: { index: 'role', details: 'role details', add: 'add role', edit: 'edit role' },
			menu: { index: 'menu', details: 'menu details' }
		},
		system: {
			index: 'system',
			sensitive: 'system sensitive',
			reconciliation: 'system reconciliation',
			accountingClose: 'system accounting close'
		},
		note: {
			index: 'note',
			template: 'note template',
			send: 'note send',
			batch: 'note batch',
			history: 'note history'
		},
		notice: {
			index: 'notice',
			record: 'notice record'
		},
		user: {
			index: 'customers',
			record: 'customers record'
		}
	}
};
