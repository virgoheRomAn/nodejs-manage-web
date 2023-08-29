'use strict';

const Service = require('egg').Service;
const WorkflowClient = require('../../client/java-workflow-biz');
const CollectionClient = require('../../client/java-collection-biz');
const UserCenterClient = require('../../client/java-usercenter-biz');
const BuddhaClient = require('../../client/java-buddha-biz');
const TYdataClient = require('../../client/java-tydata-biz');

/**
 * @description 小贷boss - 催收管理
 * @author virgoheRomAn
 * @date 2023-03-09
 */
class XDbossCollectionService extends Service {
	/**
	 * @description 获取催收任务列表
	 * @param {String} assignee 操作员Id
	 * @param {String} nameLike 任务名称
	 * @param {String} createdAfter 开始时间
	 * @param {String} createdBefore 结束时间
	 * @param {String} processDefinitionKey 流程Key
	 * @param {Boolean} includeProcessVariables 是否包含流程变量查询
	 * @param {String} sort 排序字段 'createTime'
	 * @param {String} order 排序方式 'desc'
	 * @param {Number} size 分页条数
	 * @param {Number} start 分页页数
	 * @param {Array<{name, operation, value, type}>} processInstanceVariables 查询的条件
	 * @returns
	 */
	async queryCollectionTasks(params) {
		const { ctx } = this;
		const { operatorId: assignee } = ctx.session;
		const { taskName, productNum, userName, idCardNo, minDay, maxDay, beginDate, endDate } = params;

		const pages = {
			page: params.pages.page,
			size: params.pages.size
		};

		const param = {
			paging: 'start',
			sort: 'createTime',
			order: 'desc',
			processDefinitionKey: 'ugre_payoff',
			includeProcessVariables: true,
			assignee: '2',
			nameLike: taskName ? `%${taskName}%` : undefined,
			createdAfter: beginDate || undefined,
			createdBefore: endDate || undefined,
			processInstanceVariables: []
		};

		// 查询字段
		if (!!productNum) {
			param.processInstanceVariables.push({
				name: 'productNum',
				operation: 'equals',
				value: `%${productNum}%`,
				type: 'string'
			});

			delete params['productNum'];
		}

		if (!!userName) {
			param.processInstanceVariables.push({
				name: 'userName',
				operation: 'equals',
				value: `%${userName}%`,
				type: 'string'
			});

			delete params['userName'];
		}

		if (!!idCardNo) {
			param.processInstanceVariables.push({
				name: 'idCardNo',
				operation: 'like',
				value: `%${idCardNo}%`,
				type: 'string'
			});

			delete params['idCardNo'];
		}

		if (!!maxDay) {
			param.processInstanceVariables.push({
				name: 'overdueMax',
				operation: 'greaterThan',
				value: parseInt(minDay),
				type: 'integer'
			});

			param.processInstanceVariables.push({
				name: 'overdueMax',
				operation: 'lessThanOrEquals',
				value: parseInt(maxDay),
				type: 'integer'
			});

			delete params['minDay'];
			delete params['maxDay'];
		}

		// 任务列表
		const rs = await WorkflowClient.queryServiceTasks(ctx, { ...param, pages });
		const data = rs.data;

		data.forEach((item) => {
			item.variables.forEach((variable) => {
				if (variable.name === 'name') {
					item['userName'] = variable.value;
				} else if (variable.name === 'overdueMax') {
					item['overdueMax'] = variable.value;
					item['overdueLevel'] = variable.value;
				} else {
					item[variable.name] = variable.value;
				}
			});

			delete item.variables;
		});

		return rs;
	}

	/**
	 * @description 催收记录查询
	 * @param {String} urgeCalcHisId 入催id
	 */
	async queryCollectionTaskHandle(params) {
		const { ctx } = this;
		return await CollectionClient.queryCollectionTaskHandle(ctx, params);
	}

	/**
	 * @description 根据zbjUserId查扣款数据
	 * @param {String} zbjUserId 猪八戒userId
	 * @param {String} order 排序 默认desc
	 * @param {String} orderBy 排序字段 默认create_time
	 */
	async queryDeductions(params) {
		const { ctx, service } = this;
		return await service.tydataService.queryDeductions(params);
	}

	/**
	 * @description 获取催收任务相关数据
	 * @param {String} taskId 任务Id
	 * @param {String} origin 查询的数据源 buddha、tydata
	 * @param {String} urgeCalcHisId 入催id
	 * @param {String} idCardNo 身份证号码
	 * @param {String} zbjUserId 猪八戒userId
	 * @param {String} customerNum 客户编号
	 * @param {String} productNum 产品编号
	 */
	async queryCollectionDetail(params) {
		const { ctx, service } = this;
		const { taskId, idCardNo, origin, urgeCalcHisId, productNum } = params;
		const promises = [];

		// 先根据来源和身份信息获取用户信息和借据信息
		switch (origin) {
			case 'buddha':
				promises.push(UserCenterClient.queryUserInfoByIDCard(ctx, { idCardNo }));
				promises.push(BuddhaClient.queryReceiptCalculation(ctx, { idCardNo }));
				break;
			case 'tianyang':
				promises.push(TYdataClient.queryUserInfo(ctx, { idCardNo }));
				promises.push(TYdataClient.queryReceiptCalculation(ctx, { idCardNo }));
				break;
			default:
				break;
		}

		// 再根据是否有taskId来查任务信息
		if (taskId) {
			promises.push(WorkflowClient.queryTaskInfo(ctx, { taskId }));
			promises.push(CollectionClient.queryCollectionTaskAssign(ctx, { urgeCalcHisId }));
		} else {
			// 没有taskid的时候，查催收历史和出入催记录
			promises.push(CollectionClient.queryCollectionCalcHis(ctx, { idCardNo, productNum }));
		}

		return await Promise.all(promises);
	}
}

module.exports = XDbossCollectionService;
