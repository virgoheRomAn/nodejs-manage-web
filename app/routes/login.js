'use strict';

/**
 * @description 登录路由
 * @param {Egg.Application} app - egg application
 */
class LoginRoutes {
	constructor(app) {
		this.app = app;
	}

	setRoutes() {
		const { router, controller } = this.app;

		// 初始化极验验证码
		router.get('/login/createGeetestCaptcha', controller.login.createGeetestCaptcha);

		// 用户登录
		router.post('/login/userLogin', controller.login.userLogin);

		// 用户修改密码
		router.post('/login/updatePassword', controller.login.updatePassword);

		// 登出
		router.post('/login/userLogout', controller.login.userLogout);

		// 获取当前登录信息
		router.get('/login/getLoginUserInfo', controller.login.getLoginUserInfo);

		// 刷新权限
		router.post('/login/refreshUserPermission', controller.login.refreshUserPermission);
	}
}

module.exports = LoginRoutes;
