'use strict';

/**
 * @description 接口文档地址
 * http://java-reconciliation-infra.bjjk-public-dev/swagger-ui.html
 */

const servename = `http://java-reconciliation-infra.bjjk-public-${process.env.NODE_ENV}`;

/**
 * @description [java-reconciliation-infra]
 * @author virgoheRomAn
 * @date 2021-12-23
 */
module.exports = {
	/**
	 * @description 查询对账类型
	 * @param {Object} params
	 * @returns
	 */
	queryReconciliationTypes: async (ctx, params) => {
		const action = servename + `/reconciliationType/reconciliationTypes`;
		return ctx.clientPost(action, params);
	},

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
	queryReconciliationList: async (ctx, params) => {
		const action = servename + `/reconciliationRecord/queryList`;
		return ctx.clientPost(action, params);
	},

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
	queryReconciliationFailureList: async (ctx, params) => {
		const action = servename + `/reconciliationFailureItem/queryList`;
		return ctx.clientPost(action, params);
	},

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
	failureItemProcess: async (ctx, params) => {
		const action = servename + `/reconciliation/failureItemProcess`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 对账操作记录
	 * @param {Object} params
	 * @argument {String} reconciliationId 对账记录ID
	 * @returns
	 */
	queryReconciliationOperateRecord: async (ctx, params) => {
		const action = servename + `/reconciliationOperateRecord/queryList`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 重新对账
	 * @param {Object} params
	 * @argument {String} id 对账记录ID
	 * @argument {String} operatorId 操作人ID
	 * @argument {String} operatorName 操作人
	 * @argument {String} fileA 对账文件A
	 * @returns
	 */
	reconciliationRetry: async (ctx, params) => {
		const action = servename + `/reconciliation/retry`;
		return ctx.clientPost(action, params);
	},

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
	reconciliationManualProcess: async (ctx, params) => {
		const action = servename + `/reconciliation/manualProcess`;
		return ctx.clientPost(action, params);
	}
};
