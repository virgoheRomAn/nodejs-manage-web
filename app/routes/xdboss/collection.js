'use strict';

/**
 * @description 小贷boss - 催收管理
 * @param {Egg.Application} app - egg application
 */
class XDbossCollectionRoutes {
	constructor(app) {
		this.app = app;
	}

	setRoutes() {
		const { router, controller } = this.app;
		router.post('/xdboss/collection/task/search/queryCollectionTasks', controller.xdboss.collection.queryCollectionTasks);
	}
}

module.exports = XDbossCollectionRoutes;
