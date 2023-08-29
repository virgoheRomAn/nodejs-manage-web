import { C } from '/@/dicts';
import { U } from '/@/utils';
import { checkSpaceText } from '/@/plugins/verify';
import { fileUploadOptions } from '/@/hooks/customForm/useFormUpload';

const cityData: any[] = C.cityData();

/**
 * @description 渲染渠道详情字段
 * @param editor 是否可以编辑
 * @param params 带入的判断参数 { handler }
 * @returns
 */
export const RenderChannelFields = (editor: boolean, params: EmptyObjectType) => {
	return {
		baseInfo: {
			key: '基础信息',
			render: 'object',
			isNotRenderShow: false,
			value: {
				name: { key: '营业执照名称', value: '', maxlength: 50, rules: [{ validator: checkSpaceText, trigger: 'blur' }] },
				code: { key: '统一社会信用代码', value: '', maxlength: 30, rules: [{ validator: checkSpaceText, trigger: 'blur' }] },
				personName: {
					key: '法定代表人姓名',
					value: '',
					maxlength: 16,
					rules: [{ pattern: U.verifyExp.userName, message: '法定代表人姓名格式错误', trigger: 'blur' }]
				},
				personIdNo: {
					key: '法定代表人身份证号',
					value: '',
					maxlength: 18,
					rules: [{ pattern: U.verifyExp.idCardNo, message: '法定代表人身份证号格式错误', trigger: 'blur' }]
				},
				contactName: {
					key: '联系人姓名',
					value: '',
					maxlength: 16,
					rules: [{ pattern: U.verifyExp.userName, message: '联系人姓名格式错误', trigger: 'blur' }]
				},
				contactPhone: {
					key: '联系人电话',
					value: '',
					maxlength: 11,
					rules: [{ pattern: U.verifyExp.mobile, message: '联系人电话格式错误', trigger: 'blur' }]
				},
				registeredCapital: {
					key: '注册资本',
					value: '',
					_suffix: '万元',
					maxlength: 15,
					rules: [{ pattern: U.verifyExp.amount, message: '注册资本必须为数字，且最多只能有两位小数', trigger: 'blur' }]
				},
				citys: {
					key: '公司地址',
					valueField: ['provinceCode', 'cityCode', 'districtCode'],
					textFileds: ['province', 'city', 'district'],
					cascader: { ref: 'citys', separator: '-', data: cityData },
					cascaderProps: { emitPath: true },
					isRuleNotDeep: true,
					value: {
						provinceCode: { value: '' },
						province: { value: '' },
						cityCode: { value: '' },
						city: { value: '' },
						districtCode: { value: '' },
						district: { value: '' }
					}
				},
				address: { key: '公司详细地址', value: '', maxlength: 50, rules: [{ validator: checkSpaceText, trigger: 'blur' }] },
				establishedDate: { key: '公司成立日期', value: '', datetime: true },
				scope: { key: '公司经营范围', value: '', textarea: true, maxlength: 1024 },
				simpleName: { key: '渠道简称', value: '', maxlength: 10, rules: [{ validator: checkSpaceText, trigger: 'blur' }] }
			}
		},
		companyInfo: {
			key: '企业信息',
			render: 'object',
			isNotRenderShow: true,
			value: {
				productIds: {
					key: '业务类型',
					value: [],
					checkboxGroupArray: [],
					isRuleNotDeep: true,
					change: params.productChange
				},
				productConfig: {
					key: '产品配置',
					conditionField: 'productIds',
					isNotDeep: true,
					isRuleDeep: true,
					value: {}
				}
			}
		},
		managerInfo: {
			key: '管理员信息',
			render: 'object',
			isNotRenderShow: true,
			handleList: [{ text: '新增管理员', ref: 'managerInfo', handleKey: 'itemAdded', emit: 'tableAdd', callback: params.handler }],
			value: {
				manager: {
					table: true,
					block: true,
					showFields: {
						createTime: { key: '创建时间', value: '', timestamp: true },
						name: { key: '管理员姓名', value: '' },
						userName: { key: '登录账号', value: '' },
						role: { key: '角色权限', value: '' },
						status: { key: '状态', value: '', convert: U.enum2Array(C.jrEnum.ChannelStatus) },
						handler: {
							key: '操作',
							width: '250px',
							statusFields: 'status',
							buttons: [
								{ text: '禁用', type: 'danger', emit: 'update', data: { updateStatus: 'DISABLE' }, includeStatus: ['ENABLE'] },
								{ text: '启用', type: 'success', emit: 'update', data: { updateStatus: 'ENABLE' }, includeStatus: ['DISABLE'] },
								{ text: '编辑', type: 'primary', emit: 'edit', includeStatus: ['ENABLE', 'DISABLE'] },
								{ text: '解锁', type: 'success', emit: 'unlock', aloneStatusField: 'isLocked', aloneStatusValue: 1 }
							]
						}
					},
					pages: { page: 1, size: 20, total: 1 },
					handlePaginationChange: params.pageChange,
					value: []
				}
			}
		}
	};
};
