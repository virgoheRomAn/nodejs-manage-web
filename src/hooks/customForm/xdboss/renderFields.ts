import { C } from '/@/dicts';
import { U } from '/@/utils';
import { fileUploadOptions } from '/@/hooks/customForm/useFormUpload';
import { attachmentType } from './initConfig';

/**
 * @description 初始化渲染字段信息
 * @param editor 是否可以编辑
 * @param params 带入的判断参数 { handler }
 * @returns
 */
export const RenderFieldsInit = (editor: boolean, params: EmptyObjectType) => {
	// 生成附件渲染列表
	const userAttachments: EmptyObjectType = {};
	for (let key in attachmentType) {
		if (key !== 'PersonIdCardFront' && key !== 'PersonIdCardBack' && key !== 'AuditAttachment') {
			userAttachments[key] = {
				key: attachmentType[key],
				isUpload: true,
				upload: true,
				isNotRenderShow: true,
				value: [],
				...fileUploadOptions({ isImageOrPdf: true, valueType: 'json' }, { max: 10 })
			};
		}
	}

	return {
		userInfo: {
			key: '用户信息',
			render: 'object',
			value: {
				zbjUserId: { key: '猪八戒ID', value: '', column: true },
				applyName: { key: '用户姓名', value: '' },
				mobile: { key: '手机号', value: '', showOriginal: '' },
				idNo: { key: '身份证号', value: '', showOriginal: '' },
				sex: { key: '性别', value: '', select: C.filterDictsByProId('sex', params.productId), toStr: true },
				age: { key: '年龄', value: '' },
				maritalStatus: { key: '婚姻状况', value: '', select: C.filterDictsByProId('marital', params.productId), toStr: true },
				educationLevel: { key: '教育程度', value: '', select: C.filterDictsByProId('educationLevel', params.productId), toStr: true },
				house: { key: '居住状况', value: '', select: C.filterDictsByProId('residenceType', params.productId), toStr: true },
				houseAddressDetail: {
					key: '居住地址',
					cityCode: ['houseProvinceCode', 'houseCityCode', 'houseDistrictCode'],
					value: ''
				},
				hr1: { hr: true, isNotFormat: true, isNotAjax: true, isNotRenderShow: true, isNotrequired: true },
				workSummary: { key: '工作情况', value: '', select: C.filterDictsByProId('workCondition', params.productId), toStr: true },
				workUnitType: { key: '单位所属行业', value: '', select: C.filterDictsByProId('industry', params.productId), toStr: true },
				hr2: { hr: true, isNotFormat: true, isNotAjax: true, isNotRenderShow: true, isNotrequired: true },
				workUnitName: { key: '单位名称', value: '' },
				workAddressDetail: { key: '单位地址', value: '' },
				workTel: { key: '单位电话', value: '', showOriginal: '' },
				occupation: { key: '职业', value: '', select: C.filterDictsByProId('occupation', params.productId), toStr: true },
				workUnitJob: { key: '职务', value: '', select: C.filterDictsByProId('jobLevel', params.productId), toStr: true },
				income: { key: '收入', value: '', moneyFormat: true }
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
		applyInfo: {
			key: '申请信息',
			render: 'object',
			value: {
				productName: { key: '产品名称', value: '' },
				orderNo: { key: '订单编号', value: '' },
				hr1: { hr: true, isNotFormat: true, isNotAjax: true, isNotRenderShow: true, isNotrequired: true },
				applyAmt: { key: '申请金额', value: '', moneyFormat: true },
				period: { key: '申请期数', value: '' },
				applyTime: { key: '申请日期', value: '', timestamp: true },
				rate: { key: '利率', value: '', _suffix: '%' },
				repayMode: { key: '还款方式', value: '', select: C.filterDictsByProId('repaymentMode', params.productId), toStr: true },
				loanUsage: { key: '借款用途', value: '' },
				quota: { key: '审批金额', value: '', moneyFormat: true },
				auditTime: { key: '审批日期', value: '', timestamp: true },
				hr2: { hr: true, isNotFormat: true, isNotAjax: true, isNotRenderShow: true, isNotrequired: true },
				loanAmt: { key: '放款金额', value: '', moneyFormat: true },
				loanTime: { key: '放款日期', value: '', timestamp: true },
				settleTime: { key: '结清日期', value: '', timestamp: true }
			}
		},
		bankCardInfo: {
			key: '银行卡信息',
			render: 'object',
			value: {
				bankCardList: {
					table: true,
					block: true,
					fixed: true,
					showFields: {
						accountType: {
							key: '账户类型',
							width: '110px',
							convert: [
								{ code: 0, text: '私人' },
								{ code: 1, text: '公司' }
							]
						},
						cardType: { key: '银行卡类型', width: '110px' },
						accountNo: { key: '银行卡卡号', AES: true },
						accountName: { key: '开户名' },
						accountMobile: { key: '预留手机号', AES: true },
						accountBankCode: { key: '所属银行', convert: C.filterDictsByProId('bankCode', params.productId), toStr: true }
					},
					value: []
				}
			}
		},
		sceneInfo: {
			key: '场景信息',
			render: 'object',
			isNotRenderShow: !params.getSceneInfo,
			value: {
				orderId: { key: '交易订单ID', value: '' },
				channelFundSign: {
					key: '订单来源',
					value: '',
					select: [
						{ code: '1', text: '花果山' },
						{ code: '0', text: '其他' }
					]
				},
				mainMerchantTitle: { key: '主商品名称', value: '' },
				mainMerchantPrice: { key: '主商品金额（元）', value: '', moneyFormat: true },
				maxLoanLimit: { key: '主商品最大贷款期限', value: '' },
				sellerId: { key: '销售人员ID', value: '' },
				sellerName: { key: '销售人员姓名', value: '' },
				contractPartyA: { key: '服务合同甲方', value: '' },
				contractPartyB: { key: '服务合同乙方', value: '' },
				sellerAddress: { key: '销售人员所在城市', value: '' },
				subMerchants: {
					table: true,
					block: true,
					fixed: true,
					cls: 'mt15',
					showFields: {
						subMerchantId: { key: '商品ID' },
						subMerchantTitle: { key: '商品名称' },
						subMerchantUnitPrice: { key: '商品单价', moneyFormat: true },
						subMerchantLimit: { key: '商品期限', suffix: '个月' },
						subMerchantPrice: { key: '商品金额', moneyFormat: true },
						subMerchantSp: { key: '商品规格' }
					},
					value: []
				}
			}
		},
		idCardAttachments: {
			key: '影像资料',
			render: 'object',
			cardContCls: 'plr20',
			value: {
				PersonIdCardFront: {
					key: '身份证人像面',
					isUpload: true,
					top: true,
					value: [],
					...fileUploadOptions({ isImage: true, valueType: 'json' })
				},
				PersonIdCardBack: {
					key: '身份证国徽面',
					isUpload: true,
					top: true,
					value: [],
					...fileUploadOptions({ isImage: true, valueType: 'json' })
				}
			}
		},
		userAttachments: {
			key: '用户附件',
			render: 'object',
			cardContCls: 'plr20',
			value: { ...userAttachments }
		},
		auditAttachmentList: {
			key: '审批附件',
			render: 'object',
			cardContCls: 'plr20',
			value: {
				AuditAttachment: { key: '审批附件', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }, { max: 100 }) }
			}
		},
		auditRecordBox: {
			key: '审核记录',
			render: 'object',
			value: {
				auditRecord: {
					table: true,
					block: true,
					fixed: true,
					showFields: {
						optionUser: { key: '审核角色' },
						createTime: { key: '审核时间', timestamp: true },
						optionTypeCode: {
							key: '审核类型',
							convert: [
								{ code: '0', text: '人工审核' },
								{ code: '1', text: '系统自动审核' }
							]
						},
						optionResultCode: {
							key: '审核结果',
							convert: [
								{ code: 'reject', text: '拒绝' },
								{ code: 'prompt', text: '待付款' },
								{ code: 'approve', text: '通过' }
							]
						},
						optionDesc: { key: '审核说明' }
					},
					value: []
				}
			}
		}
	};
};

/**
 * @description 初始化渲染联系人字段信息
 * @param editor 是否可以编辑
 * @param params 带入的判断参数
 * @returns
 */
export const RenderContactFieldsInit = (editor: boolean, params: EmptyObjectType) => {
	return {
		contractName: { key: '联系人姓名', value: '', column: true },
		contractPhone: {
			key: '联系人手机号',
			value: '',
			number: true,
			column: true,
			AESshow: true,
			rules: [{ pattern: U.verifyExp.mobile, message: '手机号格式错误', trigger: 'blur' }]
		},
		contractRelType: {
			key: '与借款人关系',
			value: '',
			disabled: false,
			select: C.filterDictsByProId('relationship', params.productId),
			allSelect: C.filterDictsByProId('relationship', params.productId),
			toStr: true,
			column: true,
			change: params.selectChangeCall
		},
		idCardNo: {
			key: '联系人身份证号',
			value: '',
			isNotRenderShow: true,
			requiredFixed: true,
			fixed: true,
			column: true,
			AESshow: true,
			rules: [{ pattern: U.verifyExp.idCardNo, message: '身份证号格式错误', trigger: 'blur' }]
		},
		encrypt_contractPhone: { key: '加密联系人手机号', value: '', isNotRenderShow: true, requiredFixed: true, fixed: true, column: true },
		encrypt_idCardNo: { key: '加密联系人身份证号', value: '', isNotRenderShow: true, requiredFixed: true, fixed: true, column: true },
		contractWorkUnitName: { key: '联系人单位名称', value: '', isNotRenderShow: true, requiredFixed: true, fixed: true, column: true },
		contractWorkUnitTel: { key: '联系人单位电话', value: '', isNotRenderShow: true, fixed: true, column: true }
	};
};
