'use strict';

/**
 * @description 金融boss - 客户入库白名单
 * @param {Egg.Application} app - egg application
 */
class JRbossCustomerRoutes {
	constructor(app) {
		this.app = app;
	}

	setRoutes() {
		const { router, controller } = this.app;
		router.post('/jrboss/whitetask/record/search/queryUserApplyList', controller.jrboss.order.queryUserApplyList);
		router.post('/jrboss/whitetask/record/search/queryUserApplyDetail', controller.jrboss.order.queryUserApplyDetail);
		router.post('/jrboss/whitetask/record/edit/approvalUserApply', controller.jrboss.order.approvalUserApply);
	}
}

module.exports = JRbossCustomerRoutes;
