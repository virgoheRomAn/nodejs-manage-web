'use strict';

const Controller = require('egg').Controller;

/**
 * @description 金融工作流
 * @author virgoheRomAn
 * @date 2021-12-19
 */
class JrWorkflowController extends Controller {
	// 查询待办任务
	async queryTodoTaskList() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrWorkflowService.queryTodoTaskList(params);
		ctx.body = rs;
	}

	// 审批任务
	async approveTask() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrWorkflowService.approveTask(params);
		ctx.body = rs;
	}
}

module.exports = JrWorkflowController;
