'use strict';

/**
 * @description 金融boss - 订单管理
 * @param {Egg.Application} app - egg application
 */
class JRbossOrderRoutes {
	constructor(app) {
		this.app = app;
	}

	setRoutes() {
		const { router, controller } = this.app;
		router.post('/jrboss/order/record/search/queryRepaymentOfflineDetails', controller.jrboss.order.queryRepaymentOfflineDetails);
		router.post('/jrboss/order/record/search/queryJRorderList', controller.jrboss.order.queryJRorderList);
		router.post('/jrboss/order/record/search/queryOrderDetails', controller.jrboss.order.queryOrderDetails);

		router.post('/jrboss/order/record/edit/queryUserDetail', controller.jrboss.order.queryUserDetail);
		router.post('/jrboss/order/record/edit/queryClaimConfirmation', controller.jrboss.order.queryClaimConfirmation);
	}
}

module.exports = JRbossOrderRoutes;
