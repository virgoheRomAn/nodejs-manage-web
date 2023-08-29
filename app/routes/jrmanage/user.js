'use strict';

/**
 * @description 综合管理 - 用户管理
 * @param {Egg.Application} app - egg application
 */
class JFmanageUserRoutes {
	constructor(app) {
		this.app = app;
	}

	setRoutes() {
		const { router, controller } = this.app;
		router.post('/jfmanage/user/record/search/queryCustomerInfo', controller.tydata.queryCustomerInfo);
	}
}

module.exports = JFmanageUserRoutes;
