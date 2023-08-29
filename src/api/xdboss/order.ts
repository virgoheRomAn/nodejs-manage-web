import req from '/@/plugins/request';

/**
 * @description 查询订单列表
 * @returns
 */
export const queryOrderList = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/xdboss/order/record/search/queryOrderList`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 查询订单详情
 * @returns
 */
export const queryOrderDetails = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/xdboss/order/record/search/queryOrderDetails`;
	return req.post({ url, params, type, isTips });
};
