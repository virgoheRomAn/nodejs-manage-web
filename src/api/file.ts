import req from '/@/plugins/request';

/**
 * @description 获取上传文件的token
 * @returns
 */
export const getFileToken = (params: object = {}, type?: boolean, isTips?: boolean): any => {
	let url = `/file/getFileToken`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 下载文件
 * @returns
 */
export const downOssFile = (params: object = {}, type?: boolean, isTips?: boolean): any => {
	let url = `/file/downOssFile`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 重定向下载地址
 * @returns
 */
export const redirect = (params: object = {}, type: boolean = false, isTips?: boolean): any => {
	let url = `/file/redirect`;
	return req.get({ url, params, type, isTips });
};
