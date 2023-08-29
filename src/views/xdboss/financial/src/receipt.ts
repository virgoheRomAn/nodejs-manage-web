import { C } from '/@/dicts';
import { U } from '/@/utils';
import { greaterThanZero } from '/@/plugins/verify';
import { fileUploadOptions } from '/@/hooks/customForm/useFormUpload';

/**
 * @description 根据条件计算合并的单元格
 * @param key 表格key
 * @param data 表格数据
 * @returns
 */
export const getTableMergeSpanArray = (key: string, data: EmptyArrayType): any[] => {
	// tableMergeArray中 大于1的值表示合并的多行数，1表示记录不变，0表示记录不显示
	const tableMergeArray: number[] = [];
	let index = 0;

	for (let i = 0; i < data.length; i++) {
		// 如果是第一行
		if (i === 0) {
			tableMergeArray.push(1);
			index = 0;
		} else {
			// 还款记录明细
			if (key === 'repayRecord') {
				// 还款记录明细表 判断还款流水、还款时间、还款金额、还款方式、溢缴款出入 和上一条记录的值是否相同
				if (
					data[i].repaySn === data[i - 1].repaySn &&
					data[i].repayTime === data[i - 1].repayTime &&
					data[i].repayWay === data[i - 1].repayWay &&
					data[i].repayAmt === data[i - 1].repayAmt &&
					data[i].balanceAmt === data[i - 1].balanceAmt
				) {
					tableMergeArray[index] += 1;
					tableMergeArray.push(0);
				} else {
					tableMergeArray.push(1);
					index = i;
				}
			}
		}
	}

	return tableMergeArray;
};

/**
 * @description 借据详情
 * @param editor 是否可以编辑
 * @param params 带入的判断参数 { handler }
 * @returns
 */
export const RenderReceiptDetailFields = (editor: boolean, params: EmptyObjectType) => {
	return {
		receiptInfo: {
			key: '基本信息',
			render: 'object',
			value: {
				receiptNum: { key: '借据编号', value: '' },
				productName: { key: '产品名称', value: '' },
				hr1: { hr: true, isNotFormat: true, isNotAjax: true, isNotRenderShow: true, isNotrequired: true },
				debtorName: { key: '用户姓名', value: '' },
				customerMobile: { key: '手机号', value: '' },
				debtorIdNo: { key: '身份证号', value: '' },
				hr2: { hr: true, isNotFormat: true, isNotAjax: true, isNotRenderShow: true, isNotrequired: true },
				repayingStatus: { key: '借据状态', value: '', convert: C.xdDict['IouRepayingStatus'] },
				overdueStatus: { key: '逾期状态', value: '', convert: C.xdDict['IouOverdesStatus'] },
				verification_status: { key: '核销状态', value: '', convert: C.xdDict['IouVerificationStatus'] },
				overdueDays: { key: '最大逾期天数', value: '', _suffix: '天' },
				hr3: { hr: true, isNotFormat: true, isNotAjax: true, isNotRenderShow: true, isNotrequired: true },
				loanTerm: { key: '期数', value: '', _suffix: '期' },
				loanAmount: { key: '放款金额', value: '', _suffix: '元' },
				loanDate: { key: '放款时间', value: '', timestamp: true }
			}
		},
		collectInfo: {
			key: '汇总信息',
			render: 'object',
			width: '150px',
			value: {
				currentTerm: { key: '当前所在期数', value: '' },
				overdueMaxDays: { key: '最大逾期天数', value: '', _suffix: '天' },
				notRepayPrincipal: { key: '当前未还金额', value: '', _suffix: '元' },
				loanSurplusAmount: { key: '已出帐剩余未还本金', value: '', _suffix: '元' }
			}
		},
		repayPlanBox: {
			key: '还款计划',
			render: 'object',
			value: {
				repayPlan: {
					table: true,
					block: true,
					fixed: true,
					attrs: { isSummary: false },
					showFields: {
						currentTerm: { key: '当期期数', value: '', width: '90px' },
						shouldRepayPrincipal: { key: '当期应还本金', value: '', moneyFormat: true },
						shouldRepayInterest: { key: '当期应还利息', value: '', moneyFormat: true },
						shouldRepayOverduePenalty: { key: '当期应还罚息', value: '', moneyFormat: true },
						shouldRepayFee: { key: '当期应还费用', value: '', moneyFormat: true },
						derateAmount: { key: '当期减免总额', value: '', moneyFormat: true },
						shouldRepayAmount: { key: '当期应还总额', value: '', moneyFormat: true },
						repayedPrincipal: { key: '当期实还本金', value: '', moneyFormat: true },
						repayedInterest: { key: '当期实还利息', value: '', moneyFormat: true },
						repayedOverduePenalty: { key: '当期实还罚息', value: '', moneyFormat: true },
						repayedFee: { key: '当期实还费用', value: '', moneyFormat: true },
						repayedAmount: { key: '当期实还总金额', value: '', moneyFormat: true },
						outstandingAmount: { key: '未还合计', value: '', moneyFormat: true },
						overdueDays: { key: '逾期天数', value: '', width: '90px' },
						currentPaidDate: { key: '应还款时间', value: '', width: '110px' },
						repayingStatus: { key: '借据状态', value: '', convert: C.xdDict['IouRepayingStatus'], width: '90px' },
						overdueStatus: { key: '逾期状态', value: '', convert: C.xdDict['IouOverdesStatus'], width: '90px' }
					},
					value: []
				}
			}
		},
		repayRecordBox: {
			key: '还款记录明细',
			render: 'object',
			value: {
				repayRecord: {
					table: true,
					block: true,
					fixed: true,
					attrs: { 'span-method': params.rapayRecordMergeMethod },
					showFields: {
						transferDate: { key: '还款日期', value: '', timestamp: true, timeFormat: '{y}-{m}-{d}' },
						repayTime: { key: '入账日期', value: '', timestamp: true, timeFormat: '{y}-{m}-{d}' },
						repayAmt: { key: '还款金额', value: '', moneyFormat: true },
						repayWay: { key: '还款方式', value: '', convert: C.xdDict['RepaymentWay'] },
						balanceAmt: { key: '溢缴款出入帐', value: '', moneyFormat: true },
						currentTerm: { key: '还款期次', value: '' },
						currentPaidDate: { key: '应还款时间', value: '', timestamp: true, timeFormat: '{y}-{m}-{d}' },
						matchPrincipal: { key: '实还本金', value: '', moneyFormat: true },
						matchInterest: { key: '实还利息', value: '', moneyFormat: true },
						matchOverduePenalty: { key: '实还罚息', value: '', moneyFormat: true },
						matchFee: { key: '实还费用', value: '', moneyFormat: true },
						repaymentAmount: { key: '入账金额', value: '', moneyFormat: true }
					},
					pages: { page: 1, size: 20, total: 0 },
					handlePaginationChange: params.pageChange,
					value: []
				}
			}
		},
		offlineRepayRecordBox: {
			key: '登账记录',
			render: 'object',
			value: {
				offlineRepayRecord: {
					table: true,
					block: true,
					fixed: true,
					showFields: {
						transferCredential: { key: '还款流水', value: '' },
						repayAmount: { key: '还款金额', value: '', moneyFormat: true },
						creatorName: { key: '操作员', value: '' },
						createTime: { key: '创建时间', value: '', timestamp: true },
						repayDate: { key: '还款时间', value: '' }
					},
					pages: { page: 1, size: 20, total: 0 },
					handlePaginationChange: params.pageChange,
					value: []
				}
			}
		}
	};
};

/**
 * @description 线下登账渲染
 * @param editor 是否可以编辑
 * @param params 带入的判断参数 { handler }
 * @returns
 */
export const RenderOfflineRepayFields = (editor: boolean, params: EmptyObjectType) => {
	return {
		// 只读区域字段
		viewShowFields: {
			receiptInfo: {
				key: '基本信息',
				render: 'object',
				editor: false,
				value: {
					receiptNum: { key: '借据编号', value: '', isReadonly: true },
					productName: { key: '产品名称', value: '', isReadonly: true },
					hr: { hr: true, isNotRenderShow: true, isNotAjax: true },
					debtorName: { key: '用户姓名', value: '', isReadonly: true },
					customerNum: { key: '用户Id', value: '', isNotRenderShow: true, isReadonly: true },
					debtorIdNo: { key: '身份证号码', value: '', isReadonly: true },
					customerMobile: { key: '手机号', value: '', isReadonly: true }
				}
			}
		},

		// 编辑区域字段
		showFields: {
			collectInfo: {
				key: '录入登账信息',
				render: 'object',
				width: '220px',
				editor: true,
				value: {
					incomeType: {
						key: '还款类型',
						value: '1',
						select: C.xdDict['OfflineRepayType'],
						neighbor: [{ icon: 'ele-QuestionFilled', click: params.showDialog }],
						clearable: false,
						change: params.change
					},
					repayTrailDate: {
						key: '还款试算日期',
						value: U.getFormatDateByTime(new Date(), 'date'),
						datetime: true,
						column: true,
						isNotrequired: true,
						change: params.change
					},
					shouldRepayAmount: {
						key: '试算金额',
						value: '0',
						_suffix: '元',
						viewClass: 'auto-width',
						moneyFormat: true,
						column: true,
						editor: false,
						isNotrequired: true,
						neighbor: [{ text: '明细', click: params.showDialog, disabled: false }]
					},
					remainingAmount: {
						key: '溢缴款余额',
						value: '0',
						_suffix: '元',
						moneyFormat: true,
						column: true,
						editor: false,
						readonly: true,
						isNotrequired: true
					},
					transferCredential: { key: '还款流水', value: '', column: true },
					transferDate: {
						key: '还款流水日期',
						value: U.getFormatDateByTime(new Date(), 'date'),
						datetime: true,
						column: true,
						disabledDate(time: Date) {
							return time.getTime() > Date.now();
						}
					},
					repayChannel: { key: '还款来源', value: '', select: C.xdDict['OfflineRepayChannel'], column: true },
					repayDate: {
						key: '入账日期',
						value: U.getFormatDateByTime(new Date(), 'date'),
						datetime: true,
						column: true,
						disabledDate(time: Date) {
							return time.getTime() > Date.now();
						}
					},
					repayAmount: {
						key: '实际还款金额',
						value: '',
						column: true,
						rules: [
							{ pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' },
							{ validator: greaterThanZero, message: '实际还款金额必须大于0', trigger: 'blur' }
						]
					},
					repayType: { key: '资金来源', value: '', select: C.xdDict['OfflineRepayCommutationType'], column: true },
					transferCredentials: {
						key: '附件',
						form: [],
						isUpload: true,
						column: true,
						isNotrequired: true,
						value: [],
						...fileUploadOptions({ isFile: true })
					},
					comment: { key: '备注', value: '', textarea: true, maxlength: 500, column: true, isNotrequired: true }
				}
			}
		}
	};
};
