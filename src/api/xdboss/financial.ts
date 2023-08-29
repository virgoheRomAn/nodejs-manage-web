import req from '/@/plugins/request';

/**
 * @description 查询借据列表
 * @returns
 */
export const queryLoanReceipts = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/xdboss/financial/receipt/search/queryLoanReceipts`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 查询借据详情
 * @returns
 */
export const queryReceiptDetail = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/xdboss/financial/receipt/search/queryReceiptDetail`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 通用产品-还款试算
 * @returns
 */
export const settleRepayTrial = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/xdboss/financial/receipt/search/settleRepayTrial`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 线下还款成功-根据借据入账
 * @returns
 */
export const offlineRepayByReceipt = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/xdboss/financial/receipt/edit/offlineRepayByReceipt`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 分页查询批量债转
 * @returns
 */
export const queryDebtTransferList = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/xdboss/financial/receipt/search/queryDebtTransferList`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 分页查询批量债转
 * @returns
 */
export const queryDebtTransferItemList = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/xdboss/financial/receipt/search/queryDebtTransferItemList`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 创建债转信息（合通业务）
 * @returns
 */
export const debtTransferTdCreate = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/xdboss/financial/receipt/edit/debtTransferTdCreate`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 金融办上报
 * @returns
 */
export const financeOfficeReport = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/xdboss/financial/office/edit/financeOfficeReport`;
	return req.post({ url, params, type, isTips });
};
