'use strict';

/**
 * @description 接口文档地址
 * http://java-workflow-biz.bjjr-dev/swagger-ui.html
 */

const servename = `http://java-workflow-biz.bjjr-${process.env.NODE_ENV}`;

/**
 * @description [java-workflow-biz]
 * @author virgoheRomAn
 * @date 2021-12-23
 */
module.exports = {
	/**
	 * @description 流程图查询第一步 通过 orderId 查询 ProcessInstancesId
	 * @param {Object} params
	 * @argument {String} orderId 订单号
	 * @returns
	 */
	getProcessInstances: async (ctx, params) => {
		const action = servename + `/service/runtime/process-instances`;
		const rs = await ctx.clientGet(action, params, { target: 'wrokflow' });

		if (rs.status === 200) {
			rs.data.code = 'SUCCESS';
			return rs.data;
		} else {
			throw ctx.creatError('SYSTEM_ERROR', '系统异常');
		}
	},

	/**
	 * @description 流程图查询第二步，通过ProcessInstancesId查询流程图
	 * @param {Object} params
	 * @argument {String} processInstancesId 流程Id
	 * @returns
	 */
	getProcessInstancesDiagram: async (ctx, params) => {
		const action = servename + `/service/runtime/process-instances/${params.processInstancesId}/diagram`;
		const rs = await ctx.clientGet(action, params, { target: 'wrokflow', streaming: true });

		if (rs.status === 200) {
			rs.data = {};
			rs.data.code = 'SUCCESS';
			ctx.set(rs.headers);
			return rs.res;
		} else {
			throw ctx.creatError('SYSTEM_ERROR', '系统异常');
		}
	},

	/**
	 * @description 查询待办任务[通用]
	 * @param {Object} params
	 * @argument {String} tenantId 租户ID 默认：YCXD
	 * @argument {String} includeProcessVariables 包含查询条件
	 * @argument {Array<{name, operation, value, type}>} processInstanceVariables 查询的条件
	 * @returns
	 */
	queryServiceTasks: async (ctx, params) => {
		const action = servename + `/service/query/tasks`;
		const rs = await ctx.clientPost(action, params, { target: 'wrokflow' });

		if (rs.status === 200) {
			rs.data.code = 'SUCCESS';
			return rs.data;
		} else {
			throw ctx.creatError('SYSTEM_ERROR', '系统异常');
		}
	},

	/**
	 * @description 查询办结流程[通用]
	 * @param {Object} params
	 * @argument {String} tenantId 租户ID 默认：YCXD
	 * @argument {String} involvedUser 操作员ID
	 * @argument {Array<{name, operation, value, type}>} processVariables 流程变量 查询条件
	 * @returns
	 */
	queryServiceHistoricTaskInstances: async (ctx, params) => {
		const action = servename + `/service/query/historic-task-instances`;
		const rs = await ctx.clientPost(action, params, { target: 'wrokflow' });

		if (rs.status === 200) {
			rs.data.code = 'SUCCESS';
			return rs.data;
		} else {
			throw ctx.creatError('SYSTEM_ERROR', '系统异常');
		}
	},

	/**
	 * @description 获取任务详情
	 * @param {Object} params
	 * @returns
	 */
	queryTaskInfo: async (ctx, params) => {
		const action = servename + `/service/runtime/tasks/${params.taskId}`;
		const rs = await ctx.clientGet(action, params, { target: 'wrokflow' });

		if (rs.status === 200) {
			rs.data.code = 'SUCCESS';
			return rs.data;
		} else if (rs.status === 404) {
			return rs.data;
		} else {
			throw ctx.creatError('SYSTEM_ERROR', '系统异常');
		}
	},

	/**
	 * @description GET 方法查询待办任务
	 * @param {Object} params
	 * @returns
	 */
	getTodoTasks: async (ctx, params) => {
		const action = servename + `/service/runtime/tasks`;
		const rs = await ctx.clientGet(action, params, { target: 'wrokflow' });

		if (rs.status === 200) {
			rs.data.code = 'SUCCESS';
			return rs.data;
		} else {
			throw ctx.creatError('SYSTEM_ERROR', '系统异常');
		}
	},

	/**
	 * @description 更新任务
	 * @param {Object} params
	 * @returns
	 */
	updateTask: async (ctx, params) => {
		const action = servename + `/service/runtime/tasks/${params.taskId}`;
		const rs = await ctx.clientPost(action, params, { target: 'wrokflow' });

		if (rs.status === 200) {
			rs.code = 'SUCCESS';
			return rs;
		} else {
			throw ctx.creatError('SYSTEM_ERROR', '系统异常');
		}
	},

	/**
	 * @description 工作流启动流程实例
	 * @param {Object} params 请求参数
	 * @returns
	 */
	workflowStartProcess: async (ctx, params) => {
		const action = servename + `/workflowProcess/startProcess`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 根据条件查询单个任务
	 * @param {Object} params
	 * @argument {String} taskId 任务Id
	 * @argument {String} formType 表单类型[m、pc]
	 * @argument {String} includeProcessVariables 是否包含流程参数
	 * @returns
	 */
	queryTask: async (ctx, params) => {
		const action = servename + `/workflowTask/queryTask`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 根据条件查询待办任务列表
	 * @param {Object} params
	 * @argument {Boolean} includeTaskLocalVariables
	 * @argument {Boolean} includeProcessVariables
	 * @argument {String} processDefinitionKey 产品Key
	 * @argument {String} candidateOrAssigned 操作人
	 * @argument {Array} candidateGroupIn 角色组
	 * @argument {Array} processInstanceVariables 查询条件
	 * @returns
	 */
	queryTodoTasks: async (ctx, params) => {
		const action = servename + `/workflowTask/queryTasks`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询办结任务列表
	 * @param {Object} params
	 * @argument {String} tenantId 租户ID
	 * @argument {String} involvedUser 操作人
	 * @argument {Array} processVariables 查询条件
	 * @returns
	 */
	queryFinishedTasks: async (ctx, params) => {
		const action = servename + `/workflowTask/queryFinishedTasks`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 完成任务
	 * @param {Object} params
	 * @argument {String} assignee 受理人
	 * @argument {String} taskId 任务Id
	 * @argument {Object} variables 条件
	 * @returns
	 */
	completeTask: async (ctx, params) => {
		const action = servename + `/workflowTask/completeTask`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 获取自定义表单
	 * @param {Object} params
	 * @argument {String} key 表单 formKey
	 * @argument {String} type pc端[pc]、移动端[m]
	 * @argument {String} fieldsetKey 分组 key
	 * @argument {String} orderId 订单号
	 * @returns
	 */
	queryFormConfig: async (ctx, params) => {
		const action = servename + `/form/query`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 验证表单
	 * @param {Object} params
	 * @returns
	 */
	formVerify: async (ctx, params) => {
		const action = servename + `/form/verify`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 添加到审批记录
	 * @param {Object} params
	 * @argument {String} formKey 表单 formKey
	 * @argument {String} optionDesc 操作说明
	 * @argument {String} optionResultCode 操作结果code
	 * @argument {String} optionResultDesc 操作结果desc
	 * @argument {String} optionTypeCode 操作类型code(1:系统自动审核；0:人工审核)
	 * @argument {String} optionUser 操作人（系统;人工审核人员）
	 * @argument {String} optionUserId 操作人ID（系统;人工审核人员）
	 * @argument {String} orderId 订单号
	 * @argument {String} processInstanceId 流程执行ID
	 * @argument {String} taskName 任务名
	 * @returns
	 */
	addAuditRecord: async (ctx, params) => {
		const action = servename + `/auditRecord/add`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 分页查询审核结果
	 * @param {Object} params
	 * @argument {String} orderId 订单号
	 * @returns
	 */
	queryAuditRecord: async (ctx, params) => {
		const action = servename + `/auditRecord/query`;
		return ctx.clientPost(action, params);
	}
};
