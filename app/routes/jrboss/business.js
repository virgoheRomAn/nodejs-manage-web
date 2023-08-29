'use strict';

/**
 * @description 金融boss - 业务岗管理
 * @param {Egg.Application} app - egg application
 */
class JRbossBusinessRoutes {
	constructor(app) {
		this.app = app;
	}

	setRoutes() {
		const { router, controller } = this.app;
		router.post('/jrboss/business/record/search/queryjrBusinessStaffList', controller.jrboss.order.queryjrBusinessStaffList);
		router.post('/jrboss/business/record/edit/savejrBusinessStaff', controller.jrboss.order.savejrBusinessStaff);
		router.post('/jrboss/business/record/edit/updatejrBusinessStaff', controller.jrboss.order.updatejrBusinessStaff);
	}
}

module.exports = JRbossBusinessRoutes;
