import req from '/@/plugins/request';

/**
 * @description 查询渠道列表
 * @returns
 */
export const queryChannelList = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/order/record/search/queryChannelList`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 查询产品列表
 * @returns
 */
export const queryProductList = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/order/record/search/queryProductList`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 查询订单列表
 * @returns
 */
export const queryJRorderList = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/order/record/search/queryJRorderList`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 查询订单详情
 * @returns
 */
export const queryOrderDetails = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/order/record/search/queryOrderDetails`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 导出客户明细表
 * @returns
 */
export const queryUserDetail = (params: object = {}, type: boolean = false, isTips: boolean = true): any => {
	let url = `/jrboss/order/record/edit/queryUserDetail`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 导出债权确认单
 * @returns
 */
export const queryClaimConfirmation = (params: object = {}, type: boolean = false, isTips: boolean = true): any => {
	let url = `/jrboss/order/record/edit/queryClaimConfirmation`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 线下还款详情查询
 * @returns
 */
export const queryRepaymentOfflineDetails = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/order/record/search/queryRepaymentOfflineDetails`;
	return req.post({ url, params, type, isTips });
};
