import req from '/@/plugins/request';

/**
 * @description 客户管理列表
 * @returns
 */
export const queryCustomerInfo = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/user/record/search/queryCustomerInfo`;
	return req.post({ url, params, type, isTips });
};
