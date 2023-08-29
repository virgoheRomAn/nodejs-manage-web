import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { disabledFields, setRenderFieldByData, setRenderFormByAjaxData } from '/@/hooks/customForm/useFormFields';
import { queryFormConfig, queryRepaymentPlanList } from '/@/api/common';
import { queryOrderDetails } from '/@/api/jrboss/order';
import { queryTaskDetails } from '/@/api/jrboss/task';

/**
 * @param isOrderDetails 是否获取订单详情
 * @param setAjaxData 是否设置回显数据
 * @param createRules 是否生成规则集
 * @param ajaxParams 获取订单详情的参数
 */
interface ExtendFormConfigInterface {
	[k: string]: any;
	isOrderDetails?: boolean;
	setAjaxData?: boolean;
	createRules?: boolean;
	ajaxParams?: EmptyObjectType;
}

/**
 * @description 初始化大表单配置
 * @param type 类别 区分订单详情还是任务详情
 * @param form 页面渲染字段 规则集 等
 * @param routeParams 路由参数对象
 * @param extendFormConfig 获取订单详情的额外参数
 * @returns
 */
export const InitFormConfig = async (
	type: string,
	form: EmptyObjectType,
	routeParams: EmptyObjectType = {},
	ajaxParams: EmptyObjectType = {},
	extendFormConfig: ExtendFormConfigInterface = { isOrderDetails: true, setAjaxData: true, createRules: true }
) => {
	const loading = jBox.loading('数据加载中...');

	try {
		// 将展示的字段全部设置为不展示。根据表单数据展示
		disabledFields(form.showFields);

		// 生成form
		form.formData = U.formatFormData(form.showFields, { cutting: false, submit: true });

		const configRs = await queryFormConfig({ ...routeParams, type: 'jrboss' }, false);
		if (configRs.code === 'SUCCESS') {
			form.formConfig = configRs.data.formConfig;
			form.productConfig = configRs.data.productConfig;

			// 设置大表单
			setRenderFieldByData(form, form.showFields, configRs.data.formConfig, configRs.data.productConfig);

			// 生成规则
			!!extendFormConfig.createRules && (form.rulesData = U.createRuleData(form.showFields));

			// 获取订单详情
			if (!!extendFormConfig.isOrderDetails && !!routeParams.orderId) {
				const opts = { ...{ id: routeParams.orderId, formKey: routeParams.formKey }, ...ajaxParams };
				let rs: ResponesResult = { code: '', data: {}, message: '' };

				if (type === 'order') {
					rs = await queryOrderDetails(opts, false);
				} else if (type === 'task') {
					rs = await queryTaskDetails(opts, false);
				}

				if (rs.code === 'SUCCESS') {
					jBox.closeById(loading);

					// 设置渲染数据
					setRenderFormByAjaxData(form, form.formData, form.showFields, rs, (key, formData, showField, data) => {
						// 特殊值处理 放款金额默认为审批金额 通道业务默认为申请金额
						if (key === 'order_loanAmount') {
							if (showField.editor) {
								if (!routeParams.isTongdao && U.isFalse(data[`order_loanAmount`])) {
									formData[key] = U.isFalse(data[`order_approvalAmount`]) ? '' : data[`order_approvalAmount`];
								}

								if (!routeParams.isTongdao && U.isFalse(data[`order_loanAmount`])) {
									formData[key] = U.isFalse(data[`order_applyAmount`]) ? '' : data[`order_applyAmount`];
								}
							}
						}

						// 特殊处理 产品利率
						if (key === 'order_applyRate') {
							const rateConfig = rs.data['rateList'];
							const ratePickeList = rateConfig ? rateConfig.rates.map((x: any) => ({ code: parseFloat(x), text: x + '%' })) : [];
							showField.select = ratePickeList;
						}
					});

					// 获取还款计划
					const financialRepayPlan = U.getObjectItemByKey({ value: form.showFields }, 'financialRepayPlan');
					const financialRepayPlanTable = financialRepayPlan.value.repayPlanTable;
					if (financialRepayPlan.isNotRenderShow === false) {
						const plan = await queryRepaymentPlanList({ id: routeParams.orderId }, false);
						if (plan.code === 'SUCCESS') {
							U.emptyArray(financialRepayPlanTable.value);
							financialRepayPlanTable.value = plan.data;
							form.formData['repayPlanTable'] = plan.data;
						}
					}
				}
			} else {
				jBox.closeById(loading);
			}
		}
	} catch (error) {
		jBox.closeById(loading);
		throw new Error((<Error>error).message);
	}
};
