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
			ycxdHtDebtTransferInfo: {
				key: '债转信息',
				render: 'object',
				value: {
					date: { key: '债转日期', value: '', datetime: true, column: true },
					amount: { key: '债转金额汇总', value: '', moneyFormat: true, _suffix: '元', column: true },
					hr1: { isNotAjax: true, isNotRenderShow: true, isNotrequired: true, fixed: true, hr: true },
					principal: { key: '本金余额汇总', value: '', moneyFormat: true, _suffix: '元' },
					interest: { key: '利息余额汇总', value: '', moneyFormat: true, _suffix: '元' },
					total: { key: '合计', value: '', moneyFormat: true, _suffix: '元' },
					hr2: { isNotAjax: true, isNotRenderShow: true, isNotrequired: true, fixed: true, hr: true },
					itemNum: { key: '合计笔数', value: '', _suffix: '笔', column: true },
					loanAmount: { key: '合同放款金额汇总', value: '', moneyFormat: true, _suffix: '元' },
					loanInterest: { key: '合同利息余额汇总', value: '', moneyFormat: true, _suffix: '元' },
					loanTransferAmount: { key: '合同债转金额汇总', value: '', moneyFormat: true, _suffix: '元' },
					hr3: { isNotAjax: true, isNotRenderShow: true, isNotrequired: true, fixed: true, hr: true },
					accruedInterest: { key: '应计利息', value: '', moneyFormat: true, _suffix: '元', column: true }
				}
			},

			ycxdHtDebtTransferAttachmentInfo: {
				key: '债转附件',
				render: 'object',
				cardContCls: 'plr20',
				value: {
					attachment_60: { key: '债转协议', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isOnlyPDF: true }, { max: 1 }) },
					attachment_61: { key: '债转清单', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isOnlyPDF: true }, { max: 1 }) },
					attachment_63: { key: '债转协议终稿', isUpload: true, upload: true, value: [], ...fileUploadOptions({ isOnlyPDF: true }, { max: 1 }) }
				}
			},

			// 审批相关
			historicalApprovalRecord: {
				key: '历史审批记录',
				render: 'object',
				isNotAjax: true,
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
						pages: {
							page: 1,
							size: 20,
							total: 0
						},
						handlePaginationChange: params.pageChange,
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
					date: { key: '债转日期', value: '', cls: 'u-mb-20', datetime: true, column: true },
					attachment_60: {
						key: '债转协议',
						isUpload: true,
						column: true,
						value: [],
						...fileUploadOptions({ isOnlyPDF: true, isTips: true }, { max: 1 })
					},
					attachment_61: {
						key: '债转清单',
						isUpload: true,
						column: true,
						value: [],
						...fileUploadOptions({ isOnlyExcel: true, isTips: true }, { max: 1 })
					},
					attachment_63: {
						key: '债转协议终稿',
						isUpload: true,
						column: true,
						value: [],
						...fileUploadOptions({ isOnlyPDF: true, isTips: true }, { max: 1 })
					},

					form_outcome: { key: '审批结果', value: '', column: true, dict: '', select: [] },
					form_opinion: { key: '审批意见', value: '', column: true, textarea: true }
				}
			}
		}
	};
};
