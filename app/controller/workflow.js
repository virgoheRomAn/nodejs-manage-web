'use strict';

const Controller = require('egg').Controller;

/**
 * @description 工作流
 * @author virgoheRomAn
 * @date 2021-12-19
 */
class WorkflowController extends Controller {
	// 获取审批记录
	async queryAuditRecord() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.workflowService.queryAuditRecord(params);
		ctx.body = rs;
	}

	// 获取工作流图片
	async getProcessInstancesDiagram() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.workflowService.getProcessInstancesDiagram(params);
		ctx.body = rs;
	}

	// 获取自定义表单
	async queryFormConfig() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.workflowService.queryFormConfig(params);
		ctx.body = rs;
	}

	// 查询查询待办任务
	async queryTodoServiceTasks() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.workflowService.queryTodoServiceTasks(params);
		ctx.body = rs;
	}

	// 查询办结任务
	async queryFinishedTasks() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.workflowService.queryFinishedTasks(params);
		ctx.body = rs;
	}
}

module.exports = WorkflowController;
