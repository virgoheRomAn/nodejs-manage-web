import req from '/@/plugins/request';

/**
 * @description 查询渠道列表
 * @returns
 */
export const queryChannelList = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/channel/record/search/queryChannelList`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 查询渠道详情
 * @returns
 */
export const queryChannelDetails = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/channel/record/search/queryChannelDetails`;
	return req.post({ url, params, type, isTips, isCaptureError: false });
};

/**
 * @description 产品渠道配置（渠道关联产品时候，需要填写的配置项）
 * @returns
 */
export const queryJRProductConfig = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/channel/record/search/queryJRProductConfig`;
	return req.post({ url, params, type, isTips, isCaptureError: false });
};

/**
 * @description 查询渠道合作产品
 * @returns
 */
export const queryChannelProducts = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/channel/record/search/queryChannelProducts`;
	return req.post({ url, params, type, isTips, isCaptureError: false });
};

/**
 * @description 保存渠道合作产品
 * @returns
 */
export const saveChannelProducts = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/channel/record/edit/saveChannelProducts`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 新增渠道信息
 * @returns
 */
export const createJrChannel = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/channel/record/edit/createJrChannel`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 修改渠道信息
 * @returns
 */
export const updateJrChannel = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/channel/record/edit/updateJrChannel`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 查询渠道管理员信息
 * @returns
 */
export const queryPageJrOperator = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/channel/record/search/queryPageJrOperator`;
	return req.post({ url, params, type, isTips });
};
