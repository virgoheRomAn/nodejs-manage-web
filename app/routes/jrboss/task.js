'use strict';

/**
 * @description 金融boss - 任务管理
 * @param {Egg.Application} app - egg application
 */
class JRbossTaskRoutes {
	constructor(app) {
		this.app = app;
	}

	setRoutes() {
		const { router, controller } = this.app;
		router.post('/jrboss/task/todo/search/queryTodoTaskList', controller.jrboss.workflow.queryTodoTaskList);
		router.post('/jrboss/task/details/search/queryTaskDetails', controller.jrboss.order.queryOrderDetails);

		router.post('/jrboss/task/todo/edit/approveTask', controller.jrboss.workflow.approveTask);
	}
}

module.exports = JRbossTaskRoutes;
