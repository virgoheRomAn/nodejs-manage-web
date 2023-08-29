'use strict';

const Service = require('egg').Service;
const ReconciliationClient = require('../client/java-reconciliation-infra');

/**
 * @description 对账
 * @author virgoheRomAn
 * @date 2023-03-09
 */
class ReconciliationService extends Service {
	/**
	 * @description 查询对账类型
	 * @param {Object} params
	 * @returns
	 */
	async queryReconciliationTypes(params) {
		const { ctx } = this;
		return await ReconciliationClient.queryReconciliationTypes(ctx, params);
	}

	/**
	 * @description 查询对账记录
	 * @param {Object} params
	 * @argument {String} tenantId 租户ID
	 * @argument {String} code 对账类型编码
	 * @argument {String} type 放回款类型：PAYOUT（放款）、WITHHOLD（回款）
	 * @argument {String} startDate 对账日期（开始），格式：2023-04-05
	 * @argument {String} endDate 对账日期（结束），格式：2023-04-05
	 * @argument {String} startOperationTime 操作时间（开始）
	 * @argument {String} endOperationTime 操作时间（结束）
	 * @returns
	 */
	async queryReconciliationList(params) {
		const { ctx } = this;
		params.tenantId = 'YCXD';

		return await ReconciliationClient.queryReconciliationList(ctx, params);
	}

	/**
	 * @description 查询对账失败明细
	 * @param {Object} params
	 * @argument {String} reconciliationId 对账记录ID
	 * @argument {String} status 状态：UNPROCESSED（未处理）、PROCESSED（已处理）、EXCLUDED（已排除）
	 * @argument {String} party 对账方
	 * @argument {String} serialNo 流水号
	 * @argument {String} startOperationTime 操作时间（开始）
	 * @argument {String} endOperationTime 操作时间（结束）
	 * @returns
	 */
	async queryReconciliationFailureList(params) {
		const { ctx } = this;
		return await ReconciliationClient.queryReconciliationFailureList(ctx, params);
	}

	/**
	 * @description 对账失败明细处理
	 * @param {Object} params
	 * @argument {String} id 对账记录ID
	 * @argument {Array} failureItemIds 对账失败明细ID列表
	 * @argument {String} status 对账失败明细状态：PROCESSED（已处理）、EXCLUDED（已排除）
	 * @argument {String} operatorId 操作人ID
	 * @argument {String} operatorName 操作人
	 * @argument {String} remark 备注
	 * @returns
	 */
	async failureItemProcess(params) {
		const { ctx } = this;
		params.operatorId = ctx.session.operatorId;
		params.operatorName = ctx.session.operatorName;

		return await ReconciliationClient.failureItemProcess(ctx, params);
	}

	/**
	 * @description 对账操作记录
	 * @param {Object} params
	 * @argument {String} reconciliationId 对账记录ID
	 * @returns
	 */
	async queryReconciliationOperateRecord(params) {
		const { ctx } = this;
		return await ReconciliationClient.queryReconciliationOperateRecord(ctx, params);
	}

	/**
	 * @description 重新对账
	 * @param {Object} params
	 * @argument {String} id 对账记录ID
	 * @argument {String} operatorId 操作人ID
	 * @argument {String} operatorName 操作人
	 * @argument {String} fileA 对账文件A
	 * @returns
	 */
	async reconciliationRetry(params) {
		const { ctx } = this;
		params.operatorId = ctx.session.operatorId;
		params.operatorName = ctx.session.operatorName;

		return await ReconciliationClient.reconciliationRetry(ctx, params);
	}

	/**
	 * @description 人工对账
	 * @param {Object} params
	 * @argument {String} code 对账类型编码
	 * @argument {String} operatorId 操作人ID
	 * @argument {String} operatorName 操作人
	 * @argument {String} fileA 对账文件A
	 * @argument {String} date 对账日期（开始）
	 * @argument {String} date2 对账日期（结束）
	 * @returns
	 */
	async reconciliationManualProcess(params) {
		const { ctx } = this;
		params.operatorId = ctx.session.operatorId;
		params.operatorName = ctx.session.operatorName;

		return await ReconciliationClient.reconciliationManualProcess(ctx, params);
	}
}

module.exports = ReconciliationService;
