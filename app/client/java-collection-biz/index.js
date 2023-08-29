'use strict';

/**
 * @description 接口文档地址
 * http://java-collection-biz.bjjr-dev/swagger-ui.html
 */

const servename = `http://java-collection-biz.bjjr-${process.env.NODE_ENV}`;

/**
 * @description [java-collection-biz]
 * @author virgoheRomAn
 * @date 2021-12-23
 */
module.exports = {
	/**
	 * @description 查询催收的操作记录
	 * @param {Object} 参数
	 * @argument {String} urgeCalcHisId 入催id
	 */
	queryCollectionTaskAssign: async (ctx, params) => {
		const action = servename + `/taskAssignLog/get`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 催收记录查询
	 * @param {Object} 参数
	 * @argument {String} urgeCalcHisId 入催id
	 */
	queryCollectionTaskHandle: async (ctx, params) => {
		const action = servename + `/taskHandle/get`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询入催出催记录
	 * @param {Object} 参数
	 * @argument {String} idCardNo 身份证号
	 * @argument {String} order 排序 默认desc/asc
	 * @argument {String} orderBy 排序字段 默认create_time/overdue_current
	 */
	queryCollectionCalcHis: async (ctx, params) => {
		const action = servename + `/overdueData/queryCalcHis`;
		return ctx.clientPost(action, params);
	}
};
