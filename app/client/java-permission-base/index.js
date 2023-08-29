'use strict';

/**
 * @description 接口文档地址
 * http://java-permission-base.bjjr-dev/swagger-ui.html
 */

const servename = `http://java-permission-base.bjjr-${process.env.NODE_ENV}`;

/**
 * @description [java-permission-base]
 * @author virgoheRomAn
 * @date 2021-12-23
 */
module.exports = {
	/**
	 * @description 保存操作员日志
	 * @param {Object} params
	 * @argument {String} ipAddress IP地址
	 * @argument {String} menuName 菜单名称
	 * @argument {String} operation 操作名称
	 * @argument {String} operator 操作人
	 * @argument {String} requestData 请求数据
	 * @argument {String} responseData 响应数据
	 * @argument {String} url 操作URL
	 * @returns
	 */
	createOperatorLog: async (ctx, params) => {
		const action = servename + `/jrOperatorLog/create`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询操作员
	 * @param {Object} params
	 * @argument {String} name 姓名
	 * @argument {String} userName 用户名
	 * @argument {String} status 状态：正常（ENABLE）、禁用（DISABLE）
	 * @argument {String} orgId 组织标识
	 * @argument {Array} operatorGroupCodes 用户组CODE
	 * @argument {Array} operatorGroupIds 用户组ID
	 * @returns
	 */
	queryPageJrOperator: async (ctx, params) => {
		const action = servename + `/jrOperator/query`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询操作员
	 * @param {Object} params
	 * @argument {Array} operatorIds 操作员ID
	 * @returns
	 */
	queryJrOperatorGroups: async (ctx, params) => {
		const action = servename + `/jrOperator/queryJrOperatorGroups`;
		return ctx.clientPost(action, params);
	}
};
