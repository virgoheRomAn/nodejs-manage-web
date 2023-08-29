// 定义内容
export default {
	select: '選擇系統',
	home: '首頁',
	jrBoss: {
		index: '金融Boss',
		home: '金融首頁',
		order: { index: '訂單管理', list: '訂單列表', details: '訂單詳情', repayment: '綫下還款' },
		task: { index: '任務管理', todo: '待辦任務', details: '待辦任務詳情', approve: '待辦任務審批' },
		report: {
			index: '統計報表',
			loans: '放款查詢',
			repayment: '匯款明細'
		},
		channel: {
			index: '渠道管理',
			add: '新增渠道',
			record: '渠道列表',
			details: '渠道詳情'
		},
		business: {
			index: '業務崗管理',
			record: '人員列表'
		},
		whiteTask: {
			index: '白名單任務',
			record: '任務列表',
			approve: '白名單待辦任務審批'
		}
	},
	xdBoss: {
		index: '小貸Boss',
		home: '小貸首頁',
		order: { index: '訂單管理', list: '訂單列表', details: '訂單詳情' },
		task: {
			index: '任務管理',
			todo: '待辦任務',
			history: '辦結任務',
			todoDetails: '待辦任務詳情',
			approve: '待辦任務審批',
			historyDetails: '辦結任務詳情',
			debtTransfer: '債轉任務'
		},
		financial: {
			index: '財務管理',
			receipt: '結局查詢',
			office: '金融办上报',
			receiptDetails: '結局詳情',
			receiptOffline: '綫下登賬',
			receiptDerate: '綫下減免',
			verification: { index: '核銷查詢', query: '批量核銷查詢', details: '核銷明細查詢' },
			debtTransfer: {
				index: '債轉查詢',
				query: '批量債轉查詢',
				queryDetails: '批量債轉查詢明細',
				details: '債轉明細查詢',
				debtTransferApply: '發起債轉申請'
			}
		},
		collection: {
			index: '催收管理',
			task: '任務列表',
			approve: '任務審批',
			searchuser: '入催客戶查詢',
			searchuserDetails: '入催客戶詳情',
			outourcing: '委外查詢',
			outourcingDetails: '委外詳情',
			classStatistics: '五級分類'
		},
		report: {
			index: '統計報表',
			onloan: '在貸明細查詢',
			loans: '放款明細查詢',
			payment: '回款明細查詢',
			overpayment: '溢繳款明細查詢',
			settlement: '結算明細查詢',
			receiptOnloanDetails: '在貸明細-借據詳情',
			receiptLoansDetails: '放款明細-借據詳情',
			receiptPaymentDetails: '回款明細-借據詳情',
			receiptSettlementDetails: '結算明細-借據詳情'
		},
		user: {
			index: '客戶管理',
			record: '客戶列表',
			details: '客戶詳情'
		}
	},
	jfManage: {
		index: '綜合管理',
		home: '綜合首頁',
		permission: {
			index: '權限管理',
			operator: { index: '操作員管理', details: '操作員詳情', add: '新增操作員', edit: '編輯操作員' },
			role: { index: '角色管理', details: '角色詳情', add: '添加角色', edit: '編輯角色' },
			menu: { index: '菜單管理', details: '菜單詳情' }
		},
		system: {
			index: '系統工具',
			sensitive: '敏感詞過濾',
			reconciliation: '對賬查詢',
			accountingClose: '關賬查詢'
		},
		note: {
			index: '短信管理',
			template: '模板管理',
			send: '批量發送',
			batch: '批次查詢',
			history: '歷史短信查詢'
		},
		notice: {
			index: '公告管理',
			record: '公告列表'
		},
		user: {
			index: '客戶管理',
			record: '客戶列表'
		}
	}
};
