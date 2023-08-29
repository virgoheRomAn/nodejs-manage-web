import { U } from '/@/utils';
import { queryAuditRecord } from '/@/api/common';

/**
 * @description 自定义表单事件处理集合
 * @author virgoheRomAn
 * @date 2023-04-26
 */

/**
 * @description 监听渲染数据变化 对应修改展示内容
 * @param showFields 渲染展示数据
 * @param formData 返回的数据
 * @param routeParams 路由参数对象
 */
export function watchFormData(showFields: EmptyObjectType, formData: EmptyObjectType, routeParams: EmptyObjectType) {
	// 个人逾期
	const user_creditRecordDesc = U.getObjectItemByKey({ value: showFields }, 'user_creditRecordDesc');
	user_creditRecordDesc.isNotRenderShow = formData['user_creditRecord'] !== '2';

	// 贷款用途
	const order_loanPurposeDesc = U.getObjectItemByKey({ value: showFields }, 'order_loanPurposeDesc');
	order_loanPurposeDesc.isNotRenderShow = formData['order_loanPurpose'] !== '10';

	// 选择了其他 展示输入银行名称
	const bankAccount_bankCode = U.getObjectItemByKey({ value: showFields }, 'bankAccount_bankCode');
	const bankAccount_bankName = U.getObjectItemByKey({ value: showFields }, 'bankAccount_bankName');
	bankAccount_bankName.isNotRenderShow = formData['bankAccount_bankCode'] !== 'OTHER';
	if (formData['bankAccount_bankCode'] !== 'OTHER') {
		formData['bankAccount_bankName'] = U.getArrayValueById(formData['bankAccount_bankCode'], bankAccount_bankCode.select) ?? '';
	}

	// 还款方式
	const repaymentMode = formData['order_repaymentMode'];
	const applyInfo = showFields.applyInfo.value;
	if (repaymentMode) {
		applyInfo.order_applyPeriod.isNotRenderShow = !['3', '4', '2', '5', '1', '100'].includes(repaymentMode);
		applyInfo.order_applyPeriodUnit.isNotRenderShow = ['3', '4', '2', '5', '1'].includes(repaymentMode);
		applyInfo.order_applyUnitValues.isNotRenderShow = ['3', '4', '2', '5', '1'].includes(repaymentMode);
		applyInfo.order_repaymentModeDesc.isNotRenderShow = repaymentMode !== '100';
	}

	// 评估参考
	const orderCollateralAppraisals = formData['orderCollateralAppraisals'];
	if (orderCollateralAppraisals) {
		for (let item of orderCollateralAppraisals) {
			// 计算平均估价
			const average = Number(item.lianjiaAppraisal) + Number(item.gongpingAppraisal) + Number(item.beikeAppraisal);
			item.averageAppraisal = average !== 0 ? (average / 3).toFixed(2) : '';

			// 计算可贷金额  统一为可贷金额=审核员估价*抵押成数-一抵在贷金额-二抵在贷金额
			if (!!item.salesmanAppraisal && !!item.pawnPercent && !!item.firstPawnRepayingAmt && !!item.secondPawnRepayingAmt) {
				const a = U.count.mul(item.salesmanAppraisal, U.count.div(item.pawnPercent, 100));
				const b = U.count.add(item.firstPawnRepayingAmt, item.secondPawnRepayingAmt);
				item.loanableAmount = U.count.sub(a, b);
			}
		}
	}

	// 通道业务业务员评估价 计算 [所有抵押物估值之和]
	if (routeParams.isTongdao && U.isArray(formData['orderCollaterals'])) {
		formData['orderSceneAdvance_salesmanAppraisal'] =
			(<any[]>formData['orderCollaterals']).reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue.pawnAppraisal ?? 0), 0) ||
			0;
	}
}

/**
 * @description 共借人、联系人、抵押物等操作按钮[新增、编辑、详情]
 * @param key 触发事件的名字
 * @param rows 当前行的数据
 * @param index 当前行的索引
 * @param item 表格操作按钮项
 * @param form 当前渲染表单集合[数据、渲染、规则]
 * @param refs dialog 集合
 */
export function tableHandler(key: string, rows: EmptyObjectType, index: number, item: EmptyObjectType, form: EmptyObjectType, refs: EmptyObjectType) {
	refs[item.ref].openDialog(key, {}, rows, index, form.formData[item.ref]);
}

/**
 * @description 点击链接方法
 * @param key 点击项的key
 * @param data 请求返回的数据集合
 * @param form 当前渲染表单集合[数据、渲染、规则]
 * @param ref 需要操作的ref
 */
export function tapClickHandler(key: string, data: EmptyObjectType, form: EmptyObjectType, ref: any) {
	// 评估参考中的抵押物产权号
	if (key === 'pawnNumber') {
		const orderCollateral = form.formData['orderCollaterals'].find((x: any) => x.pawnNumber === data[key]);
		const orderCollateralIndex = form.formData['orderCollaterals'].findIndex((x: any) => x.pawnNumber === data[key]);
		ref.openDialog('tableDetails', {}, orderCollateral, orderCollateralIndex);
	}
}

/**
 * @description 分页查询
 * @param key 区分接口的标识
 * @param form 当前渲染表单集合[数据、渲染、规则]
 * @param pages 选择分页数据返回的结果
 * @param item 当前有分页数据的渲染项
 * @param ajaxParams 需要查询的参数
 */
export async function queryListByPageHandler(key: string, form: EmptyObjectType, pages: any, item: any, ajaxParams: any) {
	item.pages = pages;

	// 历史审批记录
	if (key === 'historicalApprovalRecord') {
		const rs = await queryAuditRecord({ ...ajaxParams, pages: item.pages });
		if (rs.code === 'SUCCESS') {
			form.formData['historicalApprovalRecord'] = rs.data;
			item.pages.total = rs.total;
		}
	}
}
