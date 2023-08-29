'use strict';

/**
 * @description 小贷boss - 任务管理
 * @param {Egg.Application} app - egg application
 */
class XDbossTaskRoutes {
	constructor(app) {
		this.app = app;
	}

	setRoutes() {
		const { router, controller } = this.app;
		router.post('/xdboss/task/todo/search/queryTodoServiceTasks', controller.workflow.queryTodoServiceTasks);
		router.post('/xdboss/task/todo/edit/debtTransferTdApproval', controller.buddha.debtTransferTdApproval);

		router.post('/xdboss/task/history/search/queryFinishedTasks', controller.workflow.queryFinishedTasks);
	}
}

module.exports = XDbossTaskRoutes;
