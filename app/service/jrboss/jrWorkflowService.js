'use strict';

const Service = require('egg').Service;
const WorkflowClient = require('../../client/java-workflow-biz');
const JRorderClient = require('../../client/java-jrorder-biz');

/**
 * @description 金融工作流系统
 * @author virgoheRomAn
 * @date 2023-03-09
 */
class JRworkflowService extends Service {
	/**
	 * @description 根据条件查询待办任务列表
	 * @param {Object} params
	 * @argument {String} candidateOrAssigned 审批人
	 * @argument {Array} processInstanceVariables 查询条件
	 * @returns
	 */
	async queryTodoTaskList(params) {
		const { ctx } = this;
		const { operatorId: candidateOrAssigned, role } = ctx.session;
		const { processDefinitionKey, channelName, userName, userIdNo, userPhone, orderId } = params;
		const processInstanceVariables = [];
		const candidateGroupIn = role.map((x) => x.roleCode);

		if (channelName) {
			processInstanceVariables.push({
				name: 'channelName',
				operation: 'like',
				value: `%${channelName}%`,
				type: 'string'
			});
		}

		if (userName) {
			processInstanceVariables.push({
				name: 'userName',
				operation: 'like',
				value: `%${userName}%`,
				type: 'string'
			});
		}

		if (userIdNo) {
			processInstanceVariables.push({
				name: 'userIdNo',
				operation: 'equals',
				value: `${userIdNo}`,
				type: 'string'
			});
		}

		if (userPhone) {
			processInstanceVariables.push({
				name: 'userPhone',
				operation: 'equals',
				value: `${userPhone}`,
				type: 'string'
			});
		}

		if (orderId) {
			processInstanceVariables.push({
				name: 'orderId',
				operation: 'equals',
				value: `${orderId}`,
				type: 'string'
			});
		}

		const pages = {
			page: params.pages.page,
			size: params.pages.size,
			sort: 'createTime',
			order: 'desc'
		};

		const param = {
			formType: 'pc',
			includeTaskLocalVariables: true,
			includeProcessVariables: true,
			processDefinitionKey,
			candidateOrAssigned,
			candidateGroupIn,
			processInstanceVariables
		};

		// 任务列表
		const rs = await WorkflowClient.queryTodoTasks(ctx, { ...param, pages });

		// 根据任务查询订单数据
		let orderIds = [];
		rs.data.forEach((item) => {
			for (let key in item.variables) {
				if (key === 'orderId') {
					orderIds.push(item.variables[key]);
					continue;
				}
			}
		});

		const r = await JRorderClient.queryJRorderList(ctx, { ids: orderIds, pages: { page: 1, size: 100 } });

		for (let task of rs.data) {
			for (let order of r.data) {
				if (task.variables.orderId === order.id) {
					task.completeTask = task.completeTask;
					task.orderId = order.id;
					task.applyTime = order.createTime;
					task.userName = order.userName;
					task.userPhone = order.userPhone;
					task.userIdNo = order.userIdNo;
					task.orderStatus = order.status;
					task.productId = order.productId;
					task.productName = order.productName;
					task.channelName = order.channelName;
					task.channelSimpleName = order.channelSimpleName;
					task.loanAmount = order.loanAmount;
					task.applyAmount = order.applyAmount;

					continue;
				}
			}
		}

		return ctx.success(rs.data, { total: rs.total, size: pages.size, page: pages.page || 1 });
	}

	/**
	 * @description 审批订单
	 * @param {Object} params 参数
	 * @returns
	 */
	async approveTask(params) {
		const { ctx } = this;
		const { step, form, workflow } = params;

		// 修改订单的返回结果
		let resultOrderInfo = {};

		// 先获取当前任务是否还存在
		const taskInfo = await WorkflowClient.queryTaskInfo(ctx, { taskId: workflow.taskId });
		if (taskInfo.code !== 'SUCCESS') {
			throw ctx.creatError('BUSINESS_ERROR', '任务已结束!');
		}

		// 没有步骤信息
		if (!step) {
			throw ctx.creatError('BUSINESS_ERROR', '保存异常，没有保存步骤信息!');
		}

		// 步骤信息 [当前操作 | 当前操作描述 | 是否验证表单 | 是否保存表单 | 是否修改订单状态 | 修改订单状态的值]
		const { outcome, outcomeDesc, verification, saveOrder, modifyOrderStatus, orderStatus } = step;
		const { operatorId, operatorName, orgId: channelId } = ctx.session;
		const { taskId, taskName, form_key, productId, processKey, processInstanceId } = workflow;
		const opts = {
			...form,
			...{ operatorId, operatorName, channelId },
			...{ taskId, taskName, form_key, productId, processKey, processInstanceId }
		};

		// 需要验证表单
		if (verification) {
			await WorkflowClient.formVerify(ctx, opts);
		}

		// 需要保存表单
		if (saveOrder) {
			const rs = await JRorderClient.formValuesSave(ctx, { ...opts, ...{ form_operatorId: operatorId } });
			resultOrderInfo = rs.data;
		}

		// 需要修改订单状态
		if (modifyOrderStatus) {
			await JRorderClient.updateOrderStatus(ctx, { orderId: form.orderId || resultOrderInfo.id, orderStatus });
		}

		// 更新工作流
		const workflowParams = {
			taskId,
			assignee: operatorId,
			variables: {
				[`form_${form_key}_outcome`]: outcome,
				[`form_${form_key}_assignee`]: operatorId
			}
		};

		if (form.user_name) {
			workflowParams.variables.userName = form.user_name;
		}

		if (form.user_phone) {
			workflowParams.variables.userPhone = form.user_phone;
		}

		if (form.user_idNo) {
			workflowParams.variables.userIdNo = form.user_idNo;
		}

		// 完成任务
		await WorkflowClient.completeTask(ctx, workflowParams);

		// 保存审批列表
		const recordParams = {
			formKey: form_key,
			optionDesc: form.form_opinion,
			optionResultCode: outcome,
			optionResultDesc: outcomeDesc,
			optionTypeCode: '0',
			optionUser: operatorName,
			optionUserId: operatorId,
			orderId: form.orderId,
			processInstanceId: processInstanceId,
			taskName: taskName,
			formContent: JSON.stringify(form)
		};

		await WorkflowClient.addAuditRecord(ctx, recordParams);

		return ctx.success(resultOrderInfo);
	}
}

module.exports = JRworkflowService;
