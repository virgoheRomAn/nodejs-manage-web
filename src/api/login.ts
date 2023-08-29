import req from '/@/plugins/request';

/**
 * @description 初始化极验验证码
 * @returns
 */
export const createGeetestCaptcha = (params: object = {}, type?: boolean, isTips?: boolean): any => {
	let url = `/login/createGeetestCaptcha`;
	return req.get({ url, params, type, isTips });
};

/**
 * @description 登录
 * @returns
 */
export const userLogin = (params: object = {}, type?: boolean, isTips?: boolean): any => {
	let url = `/login/userLogin`;
	return req.post({ url, params, type, isTips, text: '登录中...' });
};

/**
 * @description 用户修改密码
 * @returns
 */
export const updatePassword = (params: object = {}, type?: boolean, isTips?: boolean): any => {
	let url = `/login/updatePassword`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 登出
 * @returns
 */
export const userLogout = (params: object = {}, type?: boolean, isTips?: boolean): any => {
	let url = `/login/userLogout`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 获取登录用户信息
 * @returns
 */
export const getLoginUserInfo = (params: object = {}, type: boolean = false, isTips: boolean = false): any => {
	let url = `/login/getLoginUserInfo`;
	return req.get({ url, params, type, isTips });
};

/**
 * @description 刷新登录用户系统权限
 * @returns
 */
export const refreshUserPermission = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/login/refreshUserPermission`;
	return req.post({ url, params, type, isTips, text: '刷新中...' });
};
