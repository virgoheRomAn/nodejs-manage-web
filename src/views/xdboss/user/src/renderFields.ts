import { C } from '/@/dicts';
import { U } from '/@/utils';
import { fileUploadOptions } from '/@/hooks/customForm/useFormUpload';

const cityData: any[] = C.cityData();

/**
 * @description 借据详情
 * @param editor 是否可以编辑
 * @param params 带入的判断参数 { handler }
 * @returns
 */
export const RenderUserFields = (editor: boolean, params: EmptyObjectType) => {
	return {
		baseInfo: {
			key: '基本信息',
			render: 'object',
			cardContCls: 'card-item-width-big',
			value: {
				realName: { key: '姓名', value: '' },
				mobile: { key: '手机号', value: '', AES: true },
				idCardNo: { key: '身份证号', value: '', AES: true },
				maritalStatus: { key: '婚姻状况', value: '', select: C.filterDictsByProId('marital', ''), toStr: true },
				educationLevel: { key: '教育程度', value: '', select: C.filterDictsByProId('educationLevel', ''), toStr: true },
				house: { key: '居住状况', value: '', select: C.filterDictsByProId('residenceType', ''), toStr: true },
				houseAddress: {
					key: '居住地址',
					valueField: ['houseProvinceCode', 'houseCityCode', 'houseDistrictCode'],
					textFileds: ['houseProvince', 'houseCity', 'houseDistrict'],
					cascader: { ref: 'houseAddress', separator: '-', data: cityData },
					cascaderProp: { emitPath: true },
					isRuleNotDeep: true,
					value: {
						registeredProvinceCode: { value: '' },
						registeredProvince: { value: '' },
						registeredCityCode: { value: '' },
						registeredCity: { value: '' },
						registeredDistrictCode: { value: '' },
						registeredDistrict: { value: '' }
					}
				},
				houseAddressDetail: { key: '居住详细地址', value: '' },
				workUnitName: { key: '单位名称', value: '' },
				workTel: { key: '单位电话', value: '', AES: true },
				workUnitType: { key: '行业类别', value: '', select: C.filterDictsByProId('industry', ''), toStr: true },
				workAddress: {
					key: '单位地址',
					valueField: ['workProvinceCode', 'workCityCode', 'workDistrictCode'],
					textFileds: ['workProvince', 'workCity', 'workDistrict'],
					cascader: { ref: 'workAddress', separator: '-', data: cityData },
					cascaderProp: { emitPath: true },
					isRuleNotDeep: true,
					value: {
						registeredProvinceCode: { value: '' },
						registeredProvince: { value: '' },
						registeredCityCode: { value: '' },
						registeredCity: { value: '' },
						registeredDistrictCode: { value: '' },
						registeredDistrict: { value: '' }
					}
				},
				workAddressDetail: { key: '单位详细地址', value: '' },
				occupation: { key: '入职职位', value: '', select: C.filterDictsByProId('occupation', ''), toStr: true },
				workUnitJob: { key: '入职职务', value: '', select: C.filterDictsByProId('position', ''), toStr: true },

				encrypt_mobile: { isNotRenderShow: true, isNotrequired: true, value: '' },
				encrypt_idCardNo: { isNotRenderShow: true, isNotrequired: true, value: '' },
				encrypt_workTel: { isNotRenderShow: true, isNotrequired: true, value: '' }
			}
		},
		bankCardInfo: {
			key: '银行卡信息',
			render: 'object',
			value: {
				bankCardNum: { key: '银行卡卡号', value: '', AES: true },
				bankAccountName: { key: '银行开户名', value: '' },
				bankMobile: { key: '银行预留手机号', value: '', AES: true },
				bankName: { key: '所属银行', value: '' },

				encrypt_bankCardNum: { isNotRenderShow: true, isNotrequired: true, value: '' },
				encrypt_bankMobile: { isNotRenderShow: true, isNotrequired: true, value: '' }
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
						contractRelType: { key: '与借款人关系', convert: C.filterDictsByProId('relationship', params.productId), toStr: true },
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
		userStatus: {
			key: '客户状态',
			render: 'object',
			value: {
				isRealName: {
					key: '实名状态',
					value: '',
					select: [
						{ code: 0, text: '未实名' },
						{ code: 1, text: '已实名' }
					]
				},
				isBindPaymentCard: {
					key: '绑卡信息',
					value: '',
					select: [
						{ code: false, text: '未绑卡' },
						{ code: true, text: '已绑卡' }
					]
				}
			}
		},
		idCardAttachments: {
			key: '附件信息',
			render: 'object',
			cardContCls: 'plr20',
			value: {
				idCardFront: {
					key: '身份证人像面',
					isUpload: true,
					top: true,
					value: [],
					...fileUploadOptions({ isImage: true, valueType: 'json' })
				},
				idCardBack: {
					key: '身份证国徽面',
					isUpload: true,
					top: true,
					value: [],
					...fileUploadOptions({ isImage: true, valueType: 'json' })
				}
			}
		}
	};
};
