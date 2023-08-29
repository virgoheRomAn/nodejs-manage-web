import { C } from '/@/dicts';
import { U } from '/@/utils';
import { fileUploadOptions } from '/@/hooks/customForm/useFormUpload';

/**
 * @description 初始化渲染字段信息
 * @param editor 是否可以编辑
 * @param params 带入的判断参数 { handler }
 * @returns
 */
export const RenderFieldsInit = (editor: boolean, params: EmptyObjectType) => {
	return {
		// 只读区域字段
		viewShowFields: {
			baseInfo: {
				key: '基本信息',
				render: 'object',
				value: {
					productNum: { key: '产品名称', value: '', column: true },
					realName: { key: '姓名', value: '' },
					idCardNo: { key: '身份证号', value: '' },
					mobile: { key: '联系手机号', value: '' },
					sex: { key: '性别', value: '', select: C.filterDictsByProId('sex', params.productId), toStr: true },
					birthday: { key: '出生年月', value: '' },
					educationLevel: { key: '教育程度', value: '', select: C.filterDictsByProId('educationLevel', params.productId), toStr: true },
					maritalStatus: { key: '婚姻状况', value: '', select: C.filterDictsByProId('marital', params.productId), toStr: true },
					houseAddressDetail: {
						key: '居住地址',
						cityCode: ['houseProvinceCode', 'houseCityCode', 'houseDistrictCode'],
						value: '',
						column: true
					},
					workUnitName: { key: '单位名称', value: '' },
					workUnitType: { key: '单位所属行业', value: '', select: C.filterDictsByProId('industry', params.productId), toStr: true },
					workUnitJob: { key: '职务', value: '', select: C.filterDictsByProId('jobLevel', params.productId), toStr: true },
					workTel: { key: '单位电话', value: '', showOriginal: '' },
					workAddressDetail: {
						key: '单位地址',
						cityCode: ['workProvinceName', 'workCityName', 'workDistrictName'],
						value: '',
						column: true
					}
				}
			},
			contactInfo: {
				key: '联系人信息',
				render: 'object',
				value: {
					orderContactInfos: {
						block: true,
						table: true,
						fixed: true,
						isNotRenderShow: false,
						subFormRenderKey: 'orderContactInfos',
						parentGroupField: 'showFields.contactInfo',
						handlerList: { handler: params.handler },
						showFields: {
							contractName: { key: '联系人姓名' },
							contractRelType: { key: '与借款人关系', convert: C.filterDictsByProId('relationship', params.productId) },
							contractPhone: { key: '联系人手机号', AES: true },
							handler: {
								key: '操作',
								ref: 'orderContactInfos',
								buttons: [
									{ handleKey: 'itemDetails', text: '详情', type: 'primary', hidden: false, fixed: true, icon: 'ele-Tickets', emit: 'tableDetails' }
								]
							}
						},
						value: []
					}
				}
			},
			overdueTableBox: {
				key: '逾期借据',
				render: 'object',
				value: {
					overdueTable: {
						table: true,
						block: true,
						fixed: true,
						handlerList: { handler: params.handler },
						showFields: {
							receiptNum: { key: '借据编号' },
							overdueTermTotal: { key: '逾期期数' },
							maxOverdue: { key: '逾期天数' },
							overdueShouldPay: { key: '催收金额', moneyFormat: true },
							handler: {
								key: '操作',
								ref: 'overdueTable',
								buttons: [
									{ handleKey: 'itemDetails', text: '详情', type: 'primary', hidden: false, fixed: true, icon: 'ele-Tickets', emit: 'tableDetails' }
								]
							}
						},
						value: []
					}
				}
			},
			payTableBox: {
				key: '扣款记录',
				render: 'object',
				value: {
					payTable: {
						table: true,
						block: true,
						fixed: true,
						handlerList: { handler: params.handler },
						showFields: {
							serialno: { key: '交易号' },
							repayScene: { key: '渠道' },
							repayApplyAmount: { key: '金额', moneyFormat: true },
							transferResult: { key: '扣款状态' },
							transferFailReson: { key: '失败原因' },
							repayApplyTime: { key: '还款时间', timestamp: true },
							handler: {
								key: '操作',
								ref: 'payTable',
								buttons: [
									{ handleKey: 'itemDetails', text: '详情', type: 'primary', hidden: false, fixed: true, icon: 'ele-Tickets', emit: 'tableDetails' }
								]
							}
						},
						pages: { page: 1, size: 20, total: 0 },
						handlePaginationChange: params.pageChange,
						value: []
					}
				}
			},
			taskHandleTableBox: {
				key: '催收记录',
				render: 'object',
				editor: true,
				handleList: [{ text: '新增记录', ref: 'taskHandleTable', handleKey: 'itemAdded', emit: 'tableAdd', callback: params.handler }],
				value: {
					taskHandleTable: {
						table: true,
						block: true,
						fixed: true,
						handlerList: { handler: params.handler },
						showFields: {
							handleUser: { key: '操作人' },
							handleType: { key: '操作方式' },
							comment: { key: '操作备注' },
							createTime: { key: '操作日期', timestamp: true },
							handler: {
								key: '操作',
								ref: 'taskHandleTable',
								buttons: [
									{ handleKey: 'itemDetails', text: '详情', type: 'primary', hidden: false, fixed: true, icon: 'ele-Tickets', emit: 'tableDetails' }
								]
							}
						},
						pages: { page: 1, size: 20, total: 0 },
						handlePaginationChange: params.pageChange,
						value: []
					}
				}
			},
			taskAssignTableBox: {
				key: '操作记录',
				render: 'object',
				value: {
					taskAssignTable: {
						block: true,
						table: true,
						fixed: true,
						showFields: {
							handleUser: { key: '操作人' },
							type: { key: '操作类型' },
							handleResult: { key: '操作结果' },
							handleDesc: { key: '操作详情' },
							comment: { key: '审批意见' },
							updateTime: { key: '处理时间', timestamp: true }
						},
						value: []
					}
				}
			},
			collectionRecordTableBox: {
				key: '出入催记录',
				render: 'object',
				value: {
					collectionRecordTable: {
						block: true,
						table: true,
						fixed: true,
						showFields: {
							inOrOut: { key: '记录类型' },
							updateTime: { key: '处理时间', timestamp: true },
							handler: {
								key: '操作',
								ref: 'collectionRecordTable',
								statusFields: 'inOrOut',
								buttons: [
									{ handleKey: 'itemDetails', text: '分配记录', type: 'primary', icon: 'ele-Tickets', emit: 'tableDetails', includeStatus: [1] }
								]
							}
						},
						value: []
					}
				}
			}
		},

		// 编辑区域字段
		showFields: {
			formOperationInfo: {
				key: '操作处理',
				render: 'object',
				value: {
					selectedOption: { key: '审批结果', value: '', column: true, dict: '', select: [] },
					user: { key: '低阶处理人', value: '', column: true, dict: '', select: [] },
					transferUser: { key: '高阶处理人', value: '', column: true, dict: '', select: [] },
					comment: { key: '处理意见', value: '', column: true, textarea: true }
				}
			}
		}
	};
};
