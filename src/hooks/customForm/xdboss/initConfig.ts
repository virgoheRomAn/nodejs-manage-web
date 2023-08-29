import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { queryOrderDetails } from '/@/api/xdboss/order';
import { setRenderFormByAjaxData } from '/@/hooks/customForm/useFormFields';

// 需要获取的附件类型
export const attachmentType = {
	CreditAuthorizationContract: '征信及信息授权协议',
	WithholdContract: '委托扣款授权书',
	LoanReceiptContract: '个人消费贷款合同',
	LoanNoteContract: '借款凭据及贷款用途承诺书',
	ZbjOrderContract: '服务合同',
	CustomerRightsNotice: '客户权益告知书',
	PersonIdCardFront: '身份证人像面',
	PersonIdCardBack: '身份证国徽面',
	AuditAttachment: '审批附件',
	CompanyBussinessLicense: '营业执照',
	ElecSignAuth: '电子签章授权书',
	InfoAuthContract: '信息授权书'
};

/**
 * @description 设置渲染字段的值
 * @param form 页面渲染字段 规则集 等
 * @param params 控制参数集合
 * @returns
 */
export const setFormRenderByData = async (form: EmptyObjectType, params: EmptyObjectType = {}, ajaxParams: EmptyObjectType = {}) => {
	const loading = jBox.loading('数据加载中...');

	try {
		// 生成form
		form.formData = U.formatFormData(form.showFields);
		// 生成规则
		params.createRuleData && (form.rulesData = U.createRuleData(form.showFields));

		// 获取订单详情
		const rs = await queryOrderDetails({ orderNo: params.orderId, attachmentType, ...ajaxParams }, false);
		if (rs.code === 'SUCCESS') {
			jBox.closeById(loading);

			// 设置渲染数据
			setRenderFormByAjaxData(form, form.formData, form.showFields, rs);
		}
	} catch (error) {
		jBox.closeById(loading);
		throw new Error((<Error>error).message);
	}
};
