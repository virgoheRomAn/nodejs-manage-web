import req from '/@/plugins/request';

/**
 * @description 查询客户列表
 * @returns
 */
export const queryUserList = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/xdboss/user/record/search/queryUserList`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 查询客户信息
 * @returns
 */
export const queryUserInfo = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/xdboss/user/record/search/queryUserInfo`;
	return req.post({ url, params, type, isTips });
};
