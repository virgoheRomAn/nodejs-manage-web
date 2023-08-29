'use strict';

/**
 * @description 小贷boss - 订单管理
 * @param {Egg.Application} app - egg application
 */
class XDbossOrderRoutes {
	constructor(app) {
		this.app = app;
	}

	setRoutes() {
		const { router, controller } = this.app;
		router.post('/xdboss/order/record/search/queryOrderList', controller.xdboss.order.queryOrderList);
		router.post('/xdboss/order/record/search/queryOrderDetails', controller.xdboss.order.queryOrderDetails);
	}
}

module.exports = XDbossOrderRoutes;
