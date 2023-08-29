'use strict';

/**
 * @description 小贷boss - 客户管理
 * @param {Egg.Application} app - egg application
 */
class XDbossUserRoutes {
	constructor(app) {
		this.app = app;
	}

	setRoutes() {
		const { router, controller } = this.app;
		router.post('/xdboss/user/record/search/queryUserList', controller.usercenter.queryUserList);
		router.post('/xdboss/user/record/search/queryUserInfo', controller.usercenter.queryUserInfo);
	}
}

module.exports = XDbossUserRoutes;
