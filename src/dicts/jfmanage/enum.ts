// 权限类型
export enum PermissionType {
	MENU = '菜单权限',
	POINT = '控制点权限'
}

// 系统标识
export enum SystemType {
	boss = 'boss系统',
	jrchannel = '渠道系统'
}

// 系统组标识
export enum SystemGroupType {
	'boss系统' = 1,
	'金服渠道前台',
	'金服机构前台',
	'金服产品方前台',
	'小贷渠道前台'
}

// 用户状态
export enum UserStatus {
	ENABLE = '正常',
	DISABLE = '禁用'
}

// 用户锁定
export enum UserLocked {
	'否',
	'是'
}

// 短信模板状态
export enum NoteTempleteStatus {
	'禁用',
	'启用'
}

// 导出所有枚举
export const jfManageEnum = {
	PermissionType,
	SystemType,
	SystemGroupType,
	UserStatus,
	UserLocked,
	NoteTempleteStatus
};

// 导出所有字典
export const jfManageDict = {
	// 系统组标识
	SystemGroupType: [
		{ code: 1, text: 'boss系统' },
		{ code: 2, text: '金服渠道前台' },
		{ code: 3, text: '金服机构前台' },
		{ code: 4, text: '金服产品方前台' },
		{ code: 5, text: '小贷渠道前台' }
	],

	// 用户锁定
	UserLocked: [
		{ code: 0, text: '否' },
		{ code: 1, text: '是' }
	],

	// 短信模板状态
	NoteTempleteStatus: [
		{ code: 0, text: '禁用', tag: 'danger' },
		{ code: 1, text: '启用', tag: 'success' }
	],

	// 短信批量发送状态
	NoteBatchSendStatus: [
		{ code: 0, text: '未发送', tag: 'warning' },
		{ code: 1, text: '成功', tag: 'success' },
		{ code: 2, text: '失败', tag: 'danger' }
	],

	// 短信发送状态
	NoteSendStatus: [
		{ code: 'DELIVRD', text: '成功' },
		{ code: 'FAIL', text: '失败' }
	],

	// 短信发送方式
	NoteSendType: [
		{ code: 1, text: '接口' },
		{ code: 2, text: '人工' }
	],

	// 放回款类型
	AccountingType: [
		{ code: 'PAYOUT', text: '放款' },
		{ code: 'WITHHOLD', text: '回款' }
	],

	// 对账结果
	AccountingStatus: [
		{ code: 'SUCCESS', text: '成功' },
		{ code: 'FAILURE', text: '失败' }
	],

	// 对账结果
	AccountingFailureStatus: [
		{ code: 'UNPROCESSED', text: '未处理' },
		{ code: 'PROCESSED', text: '已处理' },
		{ code: 'EXCLUDED', text: '已排除' }
	]
};
