'use strict';

const Service = require('egg').Service;
const WorkflowClient = require('../client/java-workflow-biz');
const JRorderClient = require('../client/java-jrorder-biz');

/**
 * @description 工作流系统
 * @author virgoheRomAn
 * @date 2023-03-09
 */
class WorkflowService extends Service {
	/**
	 * @description 分页查询审核结果
	 * @param {Object} params
	 * @argument {String} orderId 订单号
	 * @returns
	 */
	async queryAuditRecord(params) {
		const { ctx } = this;
		return await WorkflowClient.queryAuditRecord(ctx, params);
	}

	/**
	 * @description 流程图查询
	 * @param {Object} params
	 * @argument {String} orderId 订单号
	 * @argument {String} processInstancesId 流程ID
	 * @returns
	 */
	async getProcessInstancesDiagram(params) {
		const { ctx } = this;
		const { processInstanceId } = params;
		let processId = processInstanceId;

		if (!processId) {
			const rs = await WorkflowClient.getProcessInstances(ctx, params);
			const data = rs.data;
			processId = data[0].id;
		}

		const r = await WorkflowClient.getProcessInstancesDiagram(ctx, { processInstancesId: processId });
		const buffer = await ctx.helper.streamToBuffer(r);
		const base = buffer.toString('base64');

		const imgType = 'png';
		let imgPrefix = `data:image/${imgType};base64,`;
		let imgUrl = imgPrefix + base;

		return ctx.success(imgUrl);
	}

	/**
	 * @description 获取自定义表单
	 * @param {Object} params 参数
	 * @returns
	 */
	async queryFormConfig(params) {
		const { ctx } = this;
		const { formKey, taskId, productId, orderId, type } = params;
		let productConfigData = {};
		let formConfigData = {};
		let orderConfigData = {};
		let hasTask = false;

		// 获取任务详情
		if (taskId) {
			const task = await WorkflowClient.queryTaskInfo(ctx, { taskId });
			hasTask = task.code !== 'SUCCESS' ? false : true;
		}

		if (type === 'jrboss') {
			// 获取产品配置
			const productConfig = await JRorderClient.queryProductConfig(ctx, { id: productId });
			productConfigData = productConfig.data;

			// 获取自定义表单
			const formConfig = await WorkflowClient.queryFormConfig(ctx, { key: formKey, type: 'pc' });
			formConfigData = formConfig.data;

			// 根据订单获取表单配置
			const orderConfig = await JRorderClient.queryFormConfigByOrder(ctx, { orderId, formKey });
			orderConfigData = orderConfig.data;
		} else if (type === 'xdboss') {
			// 获取自定义表单
			const formConfig = await WorkflowClient.queryFormConfig(ctx, { key: formKey, type: 'pc' });
			formConfigData = formConfig.data;
		}

		// 对配置合并
		const config = ctx.helper.lodash.merge({}, formConfigData, orderConfigData);

		return ctx.success({ formConfig: config, productConfig: productConfigData, hasTask });
	}

	/**
	 * @description 查询待办任务[通用]
	 * @param {Object} params
	 * @argument {String} tenantId 租户ID 默认：YCXD
	 * @argument {String} includeProcessVariables 包含查询条件
	 * @argument {Array<{name, operation, value, type}>} processInstanceVariables 查询的条件
	 * @returns
	 */
	async queryTodoServiceTasks(params) {
		const { ctx } = this;
		const { operatorId: candidateOrAssigned, role } = ctx.session;
		const candidateGroupIn = role.map((x) => x.roleCode);
		const { taskDescription } = params;

		const pages = {
			page: params.pages.page,
			size: params.pages.size
		};

		const param = {
			paging: 'start',
			sort: 'createTime',
			order: 'desc',
			tenantId: 'YCXD',
			includeProcessVariables: true,
			candidateOrAssigned,
			candidateGroupIn
		};

		// 查询字段
		if (!!taskDescription) {
			param.processInstanceVariables = [
				{
					name: 'taskDescription',
					operation: 'like',
					value: `%${taskDescription}%`,
					type: 'string'
				}
			];

			delete params['taskDescription'];
		}

		// 任务列表
		const rs = await WorkflowClient.queryServiceTasks(ctx, { ...param, pages });

		const taskList = {};
		taskList.data = rs.data || [];
		taskList.total = rs.total;

		taskList.data.forEach((item) => {
			item.variables.forEach((subItem) => {
				if (subItem.name == 'derateId') {
					item.derateId = subItem.value;
				}
				if (subItem.name == 'createName') {
					item.createName = subItem.value;
				}
				if (subItem.name == 'taskDescription') {
					item.taskDescription = subItem.value;
				}
				if (subItem.name == 'receiptId') {
					item.receiptId = subItem.value;
				}
				if (subItem.name == 'receiptNum') {
					item.receiptNum = subItem.value;
				}
			});
		});

		return ctx.success(rs.data, { total: rs.total, size: pages.size, page: pages.page || 1 });
	}

	/**
	 * @description 查询办结任务列表
	 * @param {Object} params
	 * @argument {String} tenantId 租户ID
	 * @argument {String} involvedUser 操作人
	 * @argument {Array} processVariables 查询条件
	 * @returns
	 */
	async queryFinishedTasks(params) {
		const { ctx } = this;
		const { operatorId: involvedUser } = ctx.session;
		const { taskDescription } = params;

		const pages = {
			page: params.pages.page,
			size: params.pages.size
		};

		const param = { tenantId: 'YCXD', involvedUser };

		// 查询字段
		if (!!taskDescription) {
			param.processVariables = [
				{
					name: 'taskDescription',
					operation: 'like',
					value: `%${taskDescription}%`,
					type: 'string'
				}
			];

			delete params['taskDescription'];
		}

		// 任务列表
		const rs = await WorkflowClient.queryFinishedTasks(ctx, { ...param, pages });

		const taskList = {};
		taskList.data = rs.data || [];
		taskList.total = rs.total;

		taskList.data.forEach((item) => {
			item.derateId = item.variables.derateId;
			item.createName = item.variables.createName;
			item.businessKey = item.variables.businessKey;
			item.taskDescription = item.variables.taskDescription;
		});

		return ctx.success(rs.data, { total: rs.total, size: pages.size, page: pages.page || 1 });
	}
}

module.exports = WorkflowService;
