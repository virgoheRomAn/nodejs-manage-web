import { C } from '/@/dicts';
import { U } from '/@/utils';
import { checkYearRate, greaterThanZero } from '/@/plugins/verify';
import { fileUploadOptions } from '/@/hooks/customForm/useFormUpload';
import { downOssFile } from '/@/api/file';

const cityData: any[] = C.cityData();

/**
 * @description 下载还款计划模板
 */
async function downloadFile() {
	let loading = jBox.loading('下载中...');
	const rs = await downOssFile({ fileName: 'template_fb65704328544f7b87a51e4e5f714ddd.xlsx' });
	jBox.closeById(loading, () => {
		if (rs.code === 'SUCCESS') {
			window.open(rs.data);
		} else {
			jBox.error('文件下载失败！');
		}
	});
}

// 绑定的按钮操作
async function handler(key: string, data: EmptyObjectType, rows: EmptyObjectType, button: EmptyObjectType) {
	console.log(key);
}

// 表格新增数据
function addTableData(item: EmptyObjectType) {
	console.log(item);
}

// 选择框 操作方法
function selectChangeCall(value: any, cRender: EmptyObjectType, pRender: EmptyObjectType, key: string, form: EmptyObjectType) {
	console.log(value, cRender, pRender, key, form);
}

// 链接点击操作
function tapClickCall(event: any, cRender: EmptyObjectType, pRender: EmptyObjectType, key: string, form: EmptyObjectType) {
	console.log(event, cRender, pRender, key, form);
}

/**
 * @description 初始化渲染字段信息
 * @param editor 是否可以编辑
 * @param params 带入的判断参数 { isTongdao, handler }
 * @returns
 */
export const RenderFieldsInit = (editor: boolean, params: EmptyObjectType) => {
	return {
		userInfo: {
			key: '主借人基本信息',
			render: 'object',
			value: {
				user_name: { key: '姓名', value: '', rules: [{ pattern: U.verifyExp.userName, message: '姓名格式错误' }] },
				user_phone: { key: '手机号', value: '', maxlength: 11, rules: [{ pattern: U.verifyExp.mobile, message: '手机号格式错误' }] },
				user_idNo: { key: '身份证号', value: '', upperCase: true, rules: [{ pattern: U.verifyExp.idCardNo, message: '身份证号格式错误' }] },
				user_marital: { key: '婚姻情况', value: '', dict: '', select: [] },
				user_registered: {
					key: '户籍地址',
					valueField: ['user_registeredProvinceCode', 'user_registeredCityCode', 'user_registeredDistrictCode'],
					textFileds: ['user_registeredProvince', 'user_registeredCity', 'user_registeredDistrict'],
					cascader: { ref: 'user_registered', separator: '-', data: cityData },
					cascaderProps: { emitPath: true },
					isRuleNotDeep: true,
					value: {
						user_registeredProvinceCode: { value: '' },
						user_registeredProvince: { value: '' },
						user_registeredCityCode: { value: '' },
						user_registeredCity: { value: '' },
						user_registeredDistrictCode: { value: '' },
						user_registeredDistrict: { value: '' }
					}
				},
				user_registeredAddress: { key: '户籍详细地址', value: '' },
				user_residence: {
					key: '居住地址',
					valueField: ['user_residenceProvinceCode', 'user_residenceCityCode', 'user_residenceDistrictCode'],
					textFileds: ['user_residenceProvince', 'user_residenceCity', 'user_residenceDistrict'],
					cascader: { ref: 'user_residence', separator: '-', data: cityData },
					cascaderProp: { emitPath: true },
					isRuleNotDeep: true,
					value: {
						user_residenceProvinceCode: { value: '' },
						user_residenceProvince: { value: '' },
						user_residenceCityCode: { value: '' },
						user_residenceCity: { value: '' },
						user_residenceDistrictCode: { value: '' },
						user_residenceDistrict: { value: '' }
					}
				},
				user_residenceAddress: { key: '居住详细地址', value: '' },
				user_residenceType: { key: '居住状况', value: '', dict: '', select: [] },
				user_educationLevel: { key: '教育程度', value: '', dict: '', select: [], filterList: [] },
				user_workCondition: { key: '工作情况', value: '', dict: '', select: [] },
				user_companyPhone: { key: '单位电话', value: '' },
				user_companyName: { key: '单位名称', value: '' },
				user_companyIndustry: { key: '单位所属行业', value: '' },
				user_occupation: { key: '职业', value: '', dict: '', select: [] },
				user_companyJobLevel: { key: '职务', value: '', dict: '', select: [] },
				user_company: {
					key: '单位地址',
					valueField: ['user_companyProvinceCode', 'user_companyCityCode', 'user_companyDistrictCode'],
					textFileds: ['user_companyProvince', 'user_companyCity', 'user_companyDistrict'],
					cascader: { ref: 'user_company', separator: '-', data: cityData },
					cascaderProp: { emitPath: true },
					isRuleNotDeep: true,
					value: {
						user_companyProvinceCode: { value: '' },
						user_companyProvince: { value: '' },
						user_companyCityCode: { value: '' },
						user_companyCity: { value: '' },
						user_companyDistrictCode: { value: '' },
						user_companyDistrict: { value: '' }
					}
				},
				user_companyAddress: { key: '单位详细地址', value: '' },
				user_companyDepartment: { key: '所属部门', value: '' },
				user_companyBasicWage: {
					key: '基本工资',
					value: '',
					_suffix: '月/元',
					rules: { pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' }
				},
				user_incomeSource: { key: '收入来源', value: '', dict: '', select: [] },
				user_repaymentSource: { key: '还款来源', value: '' },
				user_creditRecord: { key: '个人征信记录', value: '', dict: '', select: [] },
				user_creditRecordDesc: { key: '个人征信逾期情况', value: '', isNotRenderShow: true, requiredFixed: true, fixed: true }
			}
		},
		bankAccountInfo: {
			key: '主借人银行卡信息',
			render: 'object',
			value: {
				bankAccount_accountNo: {
					key: '银行账号',
					value: '',
					rules: [{ pattern: U.verifyExp.positiveInteger, message: '必须为数字值', trigger: 'blur' }]
				},
				bankAccount_phone: {
					key: '银行预留手机号',
					value: '',
					number: true,
					rules: [{ pattern: U.verifyExp.mobile, message: '手机号格式错误', trigger: 'blur' }]
				},
				bankAccount_signChannel: { key: '签约渠道', value: '', dict: '', select: [] },
				bankAccount_bankCode: { key: '所属银行', value: '', dict: '', select: [] },
				bankAccount_bankName: { key: '所属银行名', value: '', isNotRenderShow: true, requiredFixed: true, fixed: true },
				bankAccount_branchName: { key: '开户支行', value: '' }
			}
		},
		orderBorrowers: {
			key: '共借人信息',
			render: 'object',
			sameName: true,
			handleList: [{ text: '新增共借人', ref: 'orderBorrowers', handleKey: 'itemAdded', emit: 'tableAdd', callback: params.handler }],
			value: {
				orderBorrowers: {
					table: true,
					block: true,
					fixed: true,
					isNotRenderShow: false,
					subFormRenderKey: 'orderBorrowers',
					parentGroupField: 'showFields.orderBorrowers',
					handlerList: { handler: params.handler },
					showFields: {
						name: { key: '姓名', value: '' },
						phone: { key: '手机号', value: '' },
						idNo: { key: '身份证号', value: '' },
						handler: {
							key: '操作',
							ref: 'orderBorrowers',
							buttons: [
								{ handleKey: 'itemDetails', text: '详情', type: 'primary', hidden: false, fixed: true, icon: 'ele-Tickets', emit: 'tableDetails' },
								{ handleKey: 'itemEdited', text: '编辑', type: 'primary', hidden: !editor, icon: 'ele-Edit', emit: 'tableChange' },
								{ handleKey: 'itemDeleted', text: '删除', type: 'primary', hidden: !editor, icon: 'ele-Delete', emit: 'tableDelete' }
							]
						}
					},
					value: []
				}
			}
		},
		contactInfo: {
			key: '联系人信息',
			render: 'object',
			handleList: [{ text: '新增联系人', ref: 'orderContacts', handleKey: 'itemAdded', emit: 'tableAdd', callback: params.handler }],
			value: {
				orderContacts: {
					block: true,
					table: true,
					fixed: true,
					isNotRenderShow: false,
					subFormRenderKey: 'orderContacts',
					parentGroupField: 'showFields.contactInfo',
					handlerList: { handler: params.handler },
					showFields: {
						name: { key: '姓名', value: '' },
						relationship: { key: '与借款人关系', value: '', convert: C.filterDictsByProId('relationship', params.productId as string) },
						phone: { key: '移动电话', value: '' },
						handler: {
							key: '操作',
							ref: 'orderContacts',
							buttons: [
								{ handleKey: 'itemDetails', text: '详情', type: 'primary', hidden: false, fixed: true, icon: 'ele-Tickets', emit: 'tableDetails' },
								{ handleKey: 'itemEdited', text: '编辑', type: 'primary', hidden: !editor, icon: 'ele-Edit', emit: 'tableChange' },
								{ handleKey: 'itemDeleted', text: '删除', type: 'primary', hidden: !editor, icon: 'ele-Delete', emit: 'tableDelete' }
							]
						}
					},
					value: []
				}
			}
		},
		orderCollaterals: {
			key: '抵押物信息',
			render: 'object',
			sameName: true,
			handleList: [{ text: '新增抵押物信息', ref: 'orderCollaterals', handleKey: 'itemAdded', emit: 'tableAdd', callback: params.handler }],
			value: {
				orderCollaterals: {
					block: true,
					table: true,
					fixed: true,
					isNotRenderShow: false,
					subFormRenderKey: 'orderCollaterals',
					parentGroupField: 'showFields.orderCollaterals',
					handlerList: { handler: params.handler },
					showFields: {
						communityName: { key: '小区名称', value: '' },
						pawnNumber: { key: '抵押物权证号', value: '' },
						pawnNature: { key: '抵押物性质', value: '', dict: '', convert: C.filterDicts('pawnNature', null) },
						handler: {
							key: '操作',
							ref: 'orderCollaterals',
							buttons: [
								{ handleKey: 'itemDetails', text: '详情', type: 'primary', hidden: false, fixed: true, icon: 'ele-Tickets', emit: 'tableDetails' },
								{ handleKey: 'itemEdited', text: '编辑', type: 'primary', hidden: !editor, icon: 'ele-Edit', emit: 'tableChange' },
								{ handleKey: 'itemDeleted', text: '删除', type: 'primary', hidden: !editor, icon: 'ele-Delete', emit: 'tableDelete' }
							]
						}
					},
					value: []
				}
			}
		},
		otherAsset: {
			key: '其他资产',
			render: 'object',
			value: {
				orderSceneAdvance_otherAsset: { key: '', value: '', placeholder: '其他资产', textarea: true, block: true }
			}
		},
		debtSituation: {
			key: '个人及企业负债情况',
			render: 'object',
			width: '200px',
			value: {
				orderSceneAdvance_monthlyDebt: {
					key: '月负债额',
					value: '',
					_suffix: '元',
					rules: { pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' }
				},
				orderSceneAdvance_annualDebt: {
					key: '年负债额',
					value: '',
					_suffix: '元',
					rules: { pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' }
				},
				orderSceneAdvance_bankMortgageLoanAmount: {
					key: '银行类抵押借款总额',
					value: '',
					_suffix: '元',
					rules: { pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' }
				},
				orderSceneAdvance_bankCreditLoanAmount: {
					key: '银行类信用借款总额',
					value: '',
					_suffix: '元',
					rules: { pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' }
				},
				orderSceneAdvance_otherDebt: {
					key: '其他负债',
					value: '',
					_suffix: '元',
					rules: { pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' }
				}
			}
		},
		businessSituation: {
			key: '企业经营情况',
			render: 'object',
			value: {
				orderSceneAdvance_companyName: { key: '企业名称', value: '' },
				orderSceneAdvance_mainBorrowerPosition: { key: '主借人所在职务', value: '', select: [] },
				orderSceneAdvance_enterpriseAnnualIncome: {
					key: '年营业收入',
					value: '',
					_suffix: '元',
					rules: { pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' }
				},
				orderSceneAdvance_enterpriseAnnualProfit: {
					key: '年利润总额',
					value: '',
					_suffix: '元',
					rules: { pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' }
				},
				orderSceneAdvance_enterpriseMainBusiness: { key: '企业主营业务', value: '' }
			}
		},
		applyInfo: {
			key: '申请信息',
			render: 'object',
			value: {
				order_applyAmount: {
					key: '申请额度',
					value: '',
					placeholder: '例：10000.00',
					_suffix: '元',
					rules: [
						{ pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' },
						{ validator: greaterThanZero, message: '必须大于0', trigger: 'blur' }
					]
				},
				order_repaymentMode: { key: '还款方式', value: '', dict: 'repaymentMode', select: [] },
				order_repaymentModeDesc: { key: '还款方式', value: '', isNotRenderShow: true, requiredFixed: true, fixed: true },
				order_applyPeriod: {
					key: '申请期数',
					value: '',
					number: true,
					isNotRenderShow: true,
					requiredFixed: true,
					fixed: true,
					rules: [
						{ pattern: U.verifyExp.integer, message: '必须为整数值', trigger: 'blur' },
						{ validator: greaterThanZero, message: '必须大于0', trigger: 'blur' }
					]
				},
				order_applyPeriodUnit: { key: '期数单位', value: '', dict: '', select: [], isNotRenderShow: true, requiredFixed: true, fixed: true },
				order_applyUnitValues: {
					key: '单位值',
					value: '',
					number: true,
					isNotRenderShow: true,
					requiredFixed: true,
					fixed: true,
					rules: [
						{ pattern: U.verifyExp.integer, message: '必须为整数值', trigger: 'blur' },
						{ validator: greaterThanZero, message: '必须大于0', trigger: 'blur' }
					]
				},
				order_applyRate: params.isTongdao
					? {
							key: '申请利率(年化)',
							value: '',
							_suffix: '%',
							rules: [
								{ pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' },
								{ validator: checkYearRate, message: '必须大于0%且小于等于24%', trigger: 'blur' }
							]
					  }
					: {
							key: '申请利率(年化)',
							value: '',
							select: []
					  },
				order_applyEarlySettlementLiquidatedDamages: {
					key: '提前结清违约金所占百分比',
					value: '',
					cls: 'long',
					_suffix: '%',
					width: '230px',
					column: true
				},
				order_applyContract: {
					key: '合同签署地址',
					valueField: ['order_applyContractProvinceCode', 'order_applyContractCityCode', 'order_applyContractDistrictCode'],
					textFileds: ['order_applyContractProvince', 'order_applyContractCity', 'order_applyContractDistrict'],
					cascader: { ref: 'order_applyContract', separator: '-', data: cityData },
					cascaderProp: { emitPath: true },
					isRuleNotDeep: true,
					value: {
						order_applyContractProvinceCode: { value: '' },
						order_applyContractProvince: { value: '' },
						order_applyContractCityCode: { value: '' },
						order_applyContractCity: { value: '' },
						order_applyContractDistrictCode: { value: '' },
						order_applyContractDistrict: { value: '' }
					}
				},
				order_applyContractAddress: { key: '详细地址', value: '' },
				order_loanPurpose: { key: '贷款用途', value: '', dict: 'loanPurpose', select: [] },
				order_loanPurposeDesc: { key: '贷款用途描述', value: '', isNotRenderShow: true, requiredFixed: true, fixed: true },
				order_loanContractNo: { key: '借款合同编号', value: '' },
				order_mortgageContractNo: { key: '抵押合同编号', value: '' },
				hr: { isNotAjax: true, isNotRenderShow: true, isNotrequired: true, fixed: true, hr: true },
				order_applyLitigation: {
					key: '诉讼地址',
					valueField: ['order_applyLitigationProvinceCode', 'order_applyLitigationCityCode', 'order_applyLitigationDistrictCode'],
					textFileds: ['order_applyLitigationProvince', 'order_applyLitigationCity', 'order_applyLitigationDistrict'],
					cascader: { ref: 'order_applyLitigation', separator: '-', data: cityData },
					cascaderProp: { emitPath: true },
					isRuleNotDeep: true,
					value: {
						order_applyLitigationProvinceCode: { value: '' },
						order_applyLitigationProvince: { value: '' },
						order_applyLitigationCityCode: { value: '' },
						order_applyLitigationCity: { value: '' },
						order_applyLitigationDistrictCode: { value: '' },
						order_applyLitigationDistrict: { value: '' }
					}
				},
				order_applyLitigationMechanism: { key: '诉讼机构', value: '', dict: '', select: [] }
			}
		},
		houseVisitInfo: {
			key: '下户信息',
			render: 'object',
			sameName: true,
			value: {
				rvisit_isReturnVisit: { key: '是否回访', value: '', select: C.ChooseString, column: true },
				rvisit_returnVisitInfo: { key: '回访内容', value: '', column: true },
				orderCollateralVisits: {
					block: true,
					table: true,
					fixed: true,
					isNotRenderShow: false,
					subFormRenderKey: 'orderCollateralVisits',
					handlerList: { handler: params.handler },
					showFields: {
						visitOperatorName: { key: '下户办理人员', value: '' },
						communityName: { key: '小区名称', value: '' },
						handler: {
							key: '操作',
							ref: 'orderCollateralVisits',
							buttons: [
								{ handleKey: 'itemDetails', text: '详情', type: 'primary', hidden: false, fixed: true, icon: 'ele-Tickets', emit: 'tableDetails' }
							]
						}
					},
					value: []
				}
			}
		},
		evaluationReference: {
			key: '评估参考',
			render: 'object',
			width: '170px',
			value: {
				orderCollateralAppraisals: {
					render: 'array',
					width: '170px',
					isRuleNotDeep: true,
					subFormRenderKey: 'showFields.evaluationReference.value.orderCollateralAppraisals.formatField',
					formatField: {
						pawnNumber: { key: '抵押物权证号', value: '', column: true, formRenderFixed: true, link: true, tap: params.tapClickCall },
						lianjiaAppraisal: {
							key: '估价一（元）',
							value: '',
							_suffix: '元',
							rules: [{ pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' }]
						},
						gongpingAppraisal: {
							key: '估价二（元）',
							value: '',
							_suffix: '元',
							rules: [{ pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' }]
						},
						beikeAppraisal: {
							key: '估价三（元）',
							value: '',
							_suffix: '元',
							rules: [{ pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' }]
						},
						averageAppraisal: {
							key: '平均估价（元）',
							value: '',
							_suffix: '元',
							readonly: true,
							rules: [{ pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' }]
						},
						salesmanAppraisal: {
							key: '审核员估价（元）',
							value: '',
							_suffix: '元',
							readonly: params.isTongdao,
							rules: [{ pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' }]
						},
						pawnPercent: {
							key: '抵押成数（%）',
							value: '',
							_suffix: '%',
							rules: [{ pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' }]
						},
						firstPawnRepayingAmt: {
							key: '一抵在贷金额（元）',
							value: '',
							_suffix: '元',
							rules: [{ pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' }]
						},
						secondPawnRepayingAmt: {
							key: ' 二抵在贷金额（元）',
							value: '',
							_suffix: '元',
							rules: [{ pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' }]
						},
						loanableAmount: { key: '可贷金额（元）', value: '', _suffix: '元', readonly: true }
					},
					value: []
				},
				order_approvalAmount: {
					key: '审批金额（元）',
					value: '',
					_suffix: '元',
					moneyFormat: true,
					column: true,
					rules: [
						{ pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' },
						{ validator: greaterThanZero, message: '必须大于0', trigger: 'blur' }
					]
				},
				attachment_50: { key: '评估附件', isUpload: true, column: true, value: [], ...fileUploadOptions({ isFile: true }) },
				attachment_51: { key: '审批附件', isUpload: true, column: true, value: [], ...fileUploadOptions({ isFile: true }) }
			}
		},
		loanInfo: {
			key: '放款信息',
			render: 'object',
			handleList: [{ text: '下载还款计划模板', handleKey: 'itemAdded', callback: downloadFile }],
			value: {
				attachment_35: {
					key: '还款计划',
					isUpload: true,
					column: true,
					value: [],
					parentGroupField: 'showFields.loanInfo',
					...fileUploadOptions({ isOnlyExcel: true, max: 1 })
				},
				order_channelContributiveAmount: {
					key: '渠道出资金额',
					value: '',
					_suffix: '元',
					moneyFormat: true,
					column: true,
					rules: [{ pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' }]
				},
				order_loanAmount: {
					key: '放款金额',
					value: '',
					_suffix: '元',
					moneyFormat: true,
					rules: [
						{ pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' },
						{ validator: greaterThanZero, message: '必须大于0', trigger: 'blur' }
					]
				}
			}
		},
		financialRepayPlan: {
			key: '财务还款计划',
			render: 'object',
			isNotAjax: true,
			value: {
				repayPlanTable: {
					block: true,
					table: true,
					fixed: true,
					isNotRenderShow: false,
					showFields: {
						currentTerm: { key: '当期期数', value: '' },
						shouldRepayPrincipal: { key: '当期应还本金', value: '', moneyFormat: true },
						shouldRepayInterest: { key: '当期应还利息', value: '', moneyFormat: true },
						shouldRepayServiceFee: { key: '应收服务费', value: '', moneyFormat: true },
						shouldRepayOverduePenalty: { key: '当期应还罚息', value: '', moneyFormat: true },
						shouldRepayFee: { key: '当期应还费用', value: '', moneyFormat: true },
						derateAmount: { key: '当期减免总额', value: '', moneyFormat: true },
						shouldAmount: { key: '当期应还总额', value: '', moneyFormat: true },
						currentPaidDate: { key: '应还款时间', value: '' },
						repayedPrincipal: { key: '当期实还本金', value: '', moneyFormat: true },
						repayedInterest: { key: '当期实还利息', value: '', moneyFormat: true },
						repaidServiceFee: { key: '实收服务费', value: '', moneyFormat: true },
						repayedOverduePenalty: { key: '当期实还罚息', value: '', moneyFormat: true },
						repayedFee: { key: '当期实还费用', value: '', moneyFormat: true },
						repayedAmount: { key: '当期实还总金额', value: '', moneyFormat: true },
						overdueDays: { key: '逾期天数', value: '' },
						repayingStatus: { key: '借据状态', value: '', convert: C.jrDict['IouRepayingStatus'] },
						overdueStatus: { key: '逾期状态', value: '', convert: C.jrDict['IouOverdesStatus'] }
					},
					value: []
				}
			}
		},
		identityRelationshipAttachment: {
			key: '身份关系类',
			render: 'object',
			cardContCls: 'plr20',
			value: {
				attachment_1: { key: '身份证正面', isUpload: true, top: true, value: [], ...fileUploadOptions({ isImage: true }) },
				attachment_2: { key: '身份证反面', isUpload: true, top: true, value: [], ...fileUploadOptions({ isImage: true }) },
				attachment_14: { key: '户口本', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) },
				attachment_15: { key: '婚姻关系证明', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) }
			}
		},
		bankInfo: {
			key: '银行信息类',
			render: 'object',
			cardContCls: 'plr20',
			value: {
				attachment_3: { key: '银行卡卡号面', isUpload: true, top: true, value: [], ...fileUploadOptions({ isImage: true }) }
			}
		},
		collateralStatusAttachment: {
			key: '抵押物状况类',
			render: 'object',
			cardContCls: 'plr20',
			tips: '支持 jpg png pdf 文件，单个文件不超过 20Mb',
			value: {
				attachment_16: { key: '房产证', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }, { max: 10 }) },
				attachment_18: { key: '抵押物照片', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) },
				attachment_19: { key: '产调', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) }
			}
		},
		platformInfoAttachment: {
			key: '平台信息类',
			render: 'object',
			cardContCls: 'plr20',
			tips: '支持 jpg png pdf 文件，单个文件不超过 20Mb',
			value: {
				attachment_20: { key: '平台注册截图', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) }
			}
		},
		transferVoucherAttachment: {
			key: '凭证类',
			render: 'object',
			cardContCls: 'plr20',
			tips: '支持 jpg png pdf 文件，单个文件不超过 20Mb',
			value: {
				attachment_36: { key: '转账凭证', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) }
			}
		},
		approvalInfoAttachment: {
			key: '批复资料',
			render: 'object',
			cardContCls: 'plr20',
			tips: '支持 jpg png pdf 文件，单个文件不超过 20Mb',
			value: {
				attachment_21: { key: '批复信息', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) }
			}
		},
		notarizedMaterialsAttachment: {
			key: '公证资料类',
			render: 'object',
			cardContCls: 'plr20',
			tips: '支持 jpg png pdf 文件，单个文件不超过 20Mb',
			value: {
				attachment_22: { key: '借款公证', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) },
				attachment_23: { key: '委托公证', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) },
				attachment_39: { key: '婚姻公证', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) }
			}
		},
		contractMaterialsAttachment: {
			key: '合同资料类',
			render: 'object',
			cardContCls: 'plr20',
			tips: '支持 jpg png pdf 文件，单个文件不超过 20Mb',
			value: {
				attachment_30: { key: '借款合同', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) },
				attachment_31: { key: '抵押合同', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) },
				attachment_34: { key: '借据', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) },
				attachment_32: { key: '居间协议', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) },
				attachment_33: { key: '保证合同', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) },
				attachment_6: { key: '委托扣款协议', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) },
				attachment_38: { key: '八戒增值包协议', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) }
			}
		},
		businessInfoAttachment: {
			key: '经营资料类',
			render: 'object',
			cardContCls: 'plr20',
			tips: '支持 jpg png pdf 文件，单个文件不超过 20Mb',
			value: {
				attachment_13: { key: '营业执照', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) },
				attachment_24: { key: '银行流水', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) },
				attachment_25: { key: '收入证明', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) },
				attachment_26: { key: '其他经营资料', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) }
			}
		},
		creditInfoAttachment: {
			key: '征信资料类',
			render: 'object',
			cardContCls: 'plr20',
			tips: '支持 jpg png pdf 文件，单个文件不超过 20Mb',
			value: {
				attachment_27: { key: '征信报告', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) },
				attachment_59: { key: '自动查询征信报告', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) },
				attachment_37: { key: '线下征信授权书', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) },
				attachment_5: { key: '线上征信授权书', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) },
				attachment_62: { key: '信息授权书', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) }
			}
		},
		otherInfoAttachment: {
			key: '其他资料',
			render: 'object',
			cardContCls: 'plr20',
			tips: '支持 jpg png pdf 文件，单个文件不超过 20Mb',
			value: {
				attachment_41: { key: '面签照', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) },
				attachment_28: { key: '其他资料', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }, { max: 10 }) },
				attachment_48: { key: '补充资料', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) }
			}
		},
		financialInfo: {
			key: '财务资料',
			render: 'object',
			tips: '支持 jpg png pdf 文件，单个文件不超过 20Mb',
			value: {
				order_realLoanTime: { key: '实际打款日', value: '', datetime: true },
				attachment_29: { key: '放款凭证', isUpload: true, column: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) }
			}
		},
		attachmentInfo: {
			key: '附件信息',
			render: 'object',
			cardContCls: 'plr20',
			tips: '支持 jpg png pdf rar zip 文件，单个文件不超过 20Mb',
			value: {
				attachment_43: { key: '身份信息汇总', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isFile: true }, { max: 10 }) },
				attachment_44: { key: '资产信息汇总', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isFile: true }) },
				attachment_45: { key: '面签资料汇总', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isFile: true }) },
				attachment_46: { key: '合同信息汇总', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isFile: true }) },
				attachment_49: { key: '电子签章合同信息', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isFile: true }) },
				attachment_47: { key: '其他信息汇总', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isFile: true }) }
			}
		},
		remarks: {
			key: '备注',
			render: 'object',
			value: {
				order_remarks: { key: '', value: '', placeholder: '备注', textarea: true, block: true }
			}
		},
		historicalApprovalRecord: {
			key: '历史审批记录',
			render: 'object',
			sameName: true,
			value: {
				historicalApprovalRecord: {
					block: true,
					table: true,
					fixed: true,
					isNotRenderShow: false,
					showFields: {
						taskName: { key: '审批节点', value: '' },
						optionUser: { key: '审核人', value: '' },
						optionResultDesc: { key: '审核结果', value: '' },
						optionDesc: { key: '审核意见', value: '' },
						createTime: { key: '审核时间', value: '', timestamp: true }
					},
					pages: { page: 1, size: 20, total: 0 },
					handlePaginationChange: params.pageChange,
					value: []
				}
			}
		},

		formOperationInfo: {
			key: '操作处理',
			render: 'object',
			value: {
				form_outcome: { key: '审批结果', value: '', column: true, dict: '', select: [] },
				form_opinion: { key: '审批意见', value: '', column: true, textarea: true }
			}
		}
	};
};

/**
 * @description 初始化渲染共借人字段信息
 * @param editor 是否可以编辑
 * @param params 带入的判断参数
 * @returns
 */
export const RenderBorrowerFieldsInit = (editor: boolean, params: EmptyObjectType) => {
	return {
		orderBorrowerBaseInfo: {
			key: '共借人基本信息',
			render: 'object',
			value: {
				id: { key: '共借人Id', value: '', isNotRenderShow: true, fixed: true },
				name: { key: '姓名', value: '' },
				phone: { key: '手机号', value: '', number: true, rules: [{ pattern: U.verifyExp.mobile, message: '手机号格式错误', trigger: 'blur' }] },
				idNo: {
					key: '身份证号',
					value: '',
					upperCase: true,
					rules: [{ pattern: U.verifyExp.idCardNo, message: '身份证号格式错误', trigger: 'blur' }]
				},
				marital: { key: '婚姻情况', value: '', dict: '', select: [] },
				registered: {
					key: '户籍地址',
					valueField: ['registeredProvinceCode', 'registeredCityCode', 'registeredDistrictCode'],
					textFileds: ['registeredProvince', 'registeredCity', 'registeredDistrict'],
					cascader: { ref: 'registered', separator: '-', data: cityData },
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
				registeredAddress: { key: '户籍详细地址', value: '' },
				residence: {
					key: '居住地址',
					valueField: ['residenceProvinceCode', 'residenceCityCode', 'residenceDistrictCode'],
					textFileds: ['residenceProvince', 'residenceCity', 'residenceDistrict'],
					cascader: { ref: 'residence', separator: '-', data: cityData },
					cascaderProp: { emitPath: true },
					isRuleNotDeep: true,
					value: {
						residenceProvinceCode: { value: '' },
						residenceProvince: { value: '' },
						residenceCityCode: { value: '' },
						residenceCity: { value: '' },
						residenceDistrictCode: { value: '' },
						residenceDistrict: { value: '' }
					}
				},
				residenceAddress: { key: '居住详细地址', value: '' },
				educationLevel: { key: '教育程度', value: '', dict: '', select: [] },
				companyName: { key: '单位名称', value: '' },
				companyDepartment: { key: '所属部门', value: '' },
				companyJobLevel: { key: '职务', value: '', dict: '', select: [] },
				companyPhone: { key: '单位电话', value: '' },
				companyBasicWage: {
					key: '基本工资',
					value: '',
					_suffix: '月/元',
					rules: { pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' }
				},
				incomeSource: { key: '收入来源', value: '', dict: '', select: [] },
				company: {
					key: '单位地址',
					valueField: ['companyProvinceCode', 'companyCityCode', 'companyDistrictCode'],
					textFileds: ['companyProvince', 'companyCity', 'companyDistrict'],
					cascader: { ref: 'company', separator: '-', data: cityData },
					cascaderProp: { emitPath: true },
					isRuleNotDeep: true,
					value: {
						companyProvinceCode: { value: '' },
						companyProvince: { value: '' },
						companyCityCode: { value: '' },
						companyCity: { value: '' },
						companyDistrictCode: { value: '' },
						companyDistrict: { value: '' }
					}
				},
				companyAddress: { key: '单位详细地址', value: '' },
				creditRecord: { key: '个人征信记录', value: '', rule: 'borrowRulesData', dict: '', select: [] },
				creditRecordDesc: { key: '个人征信逾期情况', value: '', isNotRenderShow: true, requiredFixed: true, fixed: true }
			}
		},
		orderBorrowerAttachmentInfo: {
			key: '身份关系类',
			render: 'object',
			cardContCls: 'plr20',
			value: {
				attachment_1: { key: '身份证正面', isUpload: true, top: true, value: [], ...fileUploadOptions({ isImage: true }) },
				attachment_2: { key: '身份证反面', isUpload: true, top: true, value: [], ...fileUploadOptions({ isImage: true }) },
				hr: { isNotAjax: true, isNotRenderShow: true, isNotrequired: true, fixed: true, hr: true },
				attachment_14: { key: '户口本', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) },
				attachment_15: { key: '婚姻关系证明', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isImageOrPdf: true }) }
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
		name: { key: '姓名', value: '', column: true },
		phone: {
			key: '移动电话',
			value: '',
			number: true,
			column: true,
			rules: [{ pattern: U.verifyExp.mobile, message: '手机号格式错误', trigger: 'blur' }]
		},
		relationship: { key: '与借款人关系', value: '', disabled: false, select: [], column: true, change: params.selectChangeCall },
		idNo: {
			key: '身份证号',
			value: '',
			isNotRenderShow: true,
			requiredFixed: true,
			fixed: true,
			column: true,
			rules: [{ pattern: U.verifyExp.idCardNo, message: '身份证号格式错误', trigger: 'blur' }]
		},
		companyName: { key: '单位名称', value: '', isNotRenderShow: true, requiredFixed: !params.isTongdao, fixed: true, column: true },
		companyPhone: { key: '单位电话', value: '', isNotRenderShow: true, fixed: true, column: true }
	};
};

/**
 * @description 初始化渲染抵押物字段信息
 * @param editor 是否可以编辑
 * @param params 带入的判断参数
 * @returns
 */
export const RenderCollateralFieldsInit = (editor: boolean, params: EmptyObjectType) => {
	return {
		orderCollateralBaseInfo: {
			key: '抵押物信息',
			parentIcon: 'el-icon-s-grid',
			render: 'object',
			value: {
				id: { key: '抵押物Id', value: '', isNotRenderShow: true, fixed: true },
				pawn: {
					key: '抵押物区域',
					valueField: ['pawnProvinceCode', 'pawnCityCode', 'pawnDistrictCode'],
					textFileds: ['pawnProvince', 'pawnCity', 'pawnDistrict'],
					cascader: { ref: 'pawn', separator: '-', data: cityData },
					cascaderProp: { emitPath: true },
					isRuleNotDeep: true,
					value: {
						pawnProvinceCode: { value: '' },
						pawnProvince: { value: '' },
						pawnCityCode: { value: '' },
						pawnCity: { value: '' },
						pawnDistrictCode: { value: '' },
						pawnDistrict: { value: '' }
					}
				},
				pawnAddress: { key: '抵押物详细地址', value: '' },
				communityName: { key: '小区名称', value: '' },
				constructionArea: {
					key: '建筑面积',
					value: '',
					rules: [{ pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' }]
				},
				constructionAge: { key: '建筑年代', value: '' },
				renovationCondition: { key: '装修情况', value: '', dict: '', select: [] },
				pawnNumber: { key: '抵押物权证号', value: '' },
				pawnNature: { key: '抵押物性质', value: '', dict: '', select: [] },
				pawnAppraisal: {
					key: '抵押物估值(元)',
					value: '',
					rules: [
						{ pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' },
						{ pattern: greaterThanZero, message: '必须大于0', trigger: 'blur' }
					]
				}
			}
		},
		orderCollateralOwner: {
			key: '抵押物归属人',
			parentIcon: 'el-icon-s-grid',
			render: 'array',
			name: '第 %no% 个归属人',
			itemIcon: 'el-icon-user-solid',
			handleList: [{ text: '新增归属人', ref: 'orderCollaterals', handleKey: 'itemAdded', emit: 'tableAdd', callback: params.childrenHandler }],
			isRuleNotDeep: true,
			subFormRenderKey: 'showFields.orderCollateralOwner.formatField',
			formatField: {
				pawnOwner: { key: '产权归属人', value: '' },
				pawnOwnerCardId: {
					key: '归属人身份证号',
					value: '',
					upperCase: true,
					rules: [{ pattern: U.verifyExp.idCardNo, message: '身份证号格式错误', trigger: 'blur' }]
				},
				pawnOwnerPhoneNumber: {
					key: '归属人手机号',
					value: '',
					number: true,
					rules: [{ pattern: U.verifyExp.mobile, message: '手机号格式错误', trigger: 'blur' }]
				}
			},
			value: []
		}
	};
};

/**
 * @description 初始化渲染下户回访字段信息
 * @param editor 是否可以编辑
 * @param params 带入的判断参数
 * @returns
 */
export const RenderCollateralVisitFieldsInit = (editor: boolean, params: EmptyObjectType) => {
	return {
		orderCollateralVisits: {
			key: '下户信息',
			render: 'object',
			showNotGroups: true,
			value: {
				visitOperatorName: { key: '下户办理人员', value: '' },
				communityName: { key: '小区名称', value: '' },
				visitTime: { key: '下户日期', value: '', text: '', timestamp: true },
				oneMortgage: { key: '是否办理一抵', value: '', dict: '', select: [] },
				oneMortgageMortgagee: { key: '一抵抵押权人', value: '' },
				oneMortgageAmount: { key: '一抵金额', value: '' },
				oneMortgageTime: { key: '一抵时间', value: '', text: '', timestamp: true },
				housingAgencyAppraisal: { key: '房屋中介估值', value: '', _suffix: '元' },
				accountManagerAppraisal: { key: '客户经理估值', value: '', _suffix: '元' }
			}
		},
		attachmentInfo: {
			key: '办理附件',
			render: 'object',
			cardContCls: 'plr20',
			showNotGroups: true,
			value: {
				attachment_53: { key: '小区门口及街道号', value: [], isUpload: true, upload: true, ...fileUploadOptions({ isFile: true }) },
				attachment_54: { key: '单元号/楼栋号', value: [], isUpload: true, upload: true, ...fileUploadOptions({ isFile: true }) },
				attachment_55: { key: '楼层及房号', value: [], isUpload: true, upload: true, ...fileUploadOptions({ isFile: true }) },
				attachment_56: { key: '押品外观', value: [], isUpload: true, upload: true, ...fileUploadOptions({ isFile: true }) },
				attachment_57: { key: '对外视野', value: [], isUpload: true, upload: true, ...fileUploadOptions({ isFile: true }) },
				attachment_58: { key: '室内状况', value: [], isUpload: true, upload: true, ...fileUploadOptions({ isFile: true }) }
			}
		}
	};
};
