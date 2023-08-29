import { U } from '/@/utils';
import { queryAuditRecord, queryRepayRecord, queryOfflineRepayRecord } from '/@/api/common';

/**
 * @description 自定义表单事件处理集合
 * @author virgoheRomAn
 * @date 2023-04-26
 */

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
 * @description 分页查询
 * @param key 区分接口的标识
 * @param form 当前渲染表单集合[数据、渲染、规则]
 * @param pages 选择分页数据返回的结果
 * @param item 当前有分页数据的渲染项
 * @param ajaxParams 需要查询的参数
 * @param loading
 */
export async function queryListByPageHandler(key: string, form: EmptyObjectType, pages: any, item: any, ajaxParams: any, loading: boolean = true) {
	let rs: ResponesResult = { code: '', message: '', data: '' };
	item.pages = pages;

	// 历史审批记录
	if (key === 'historicalApprovalRecord') {
		rs = await queryAuditRecord({ ...ajaxParams, pages: item.pages }, loading);
	}

	// 还款记录明细
	if (key === 'repayRecord') {
		rs = await queryRepayRecord({ ...ajaxParams, pages: item.pages }, loading);
	}

	// 线下登账记录
	if (key === 'offlineRepayRecord') {
		rs = await queryOfflineRepayRecord({ ...ajaxParams, pages: item.pages }, loading);
	}

	// 成功赋值
	if (rs.code === 'SUCCESS') {
		if (form.viewFormData) {
			form.viewFormData[key] = rs.data;
		} else {
			form.formData[key] = rs.data;
		}

		item.pages.total = rs.total;
	}

	return rs;
}
