import req from '/@/plugins/request';

/**
 * @description 查询对账类型
 * @returns
 */
export const queryReconciliationTypes = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/system/reconciliation/search/queryReconciliationTypes`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 查询对账记录
 * @returns
 */
export const queryReconciliationList = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/system/reconciliation/search/queryReconciliationList`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 查询对账失败明细
 * @returns
 */
export const queryReconciliationFailureList = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/system/reconciliation/edit/queryReconciliationFailureList`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 对账失败明细处理
 * @returns
 */
export const failureItemProcess = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/system/reconciliation/edit/failureItemProcess`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 对账操作记录
 * @returns
 */
export const queryReconciliationOperateRecord = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/system/reconciliation/edit/queryReconciliationOperateRecord`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 重新对账
 * @returns
 */
export const reconciliationRetry = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/system/reconciliation/edit/reconciliationRetry`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 人工对账
 * @returns
 */
export const reconciliationManualProcess = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/system/reconciliation/edit/reconciliationManualProcess`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 分页查询关账数据
 * @returns
 */
export const queryCloseAccount = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/system/accounting/search/queryCloseAccount`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 新增关账
 * @returns
 */
export const addCloseAccount = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/system/accounting/edit/addCloseAccount`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 敏感词过滤
 * @returns
 */
export const sensitiveWordFilter = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/system/sensitive/edit/sensitiveWordFilter`;
	return req.post({ url, params, type, isTips });
};
