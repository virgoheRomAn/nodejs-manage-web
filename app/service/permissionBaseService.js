'use strict';

const Service = require('egg').Service;
const PermissionBaseClient = require('../client/java-permission-base');

/**
 * @description 基础权限系统
 * @author virgoheRomAn
 * @date 2023-03-09
 */
class PermissionBaseService extends Service {
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
	async queryPageJrOperator(params) {
		const { ctx } = this;
		const { getGroups } = params;
		params.orgId = ctx.session.orgId;

		if (!getGroups) {
			return await PermissionBaseClient.queryPageJrOperator(ctx, params);
		} else {
			const rs = await PermissionBaseClient.queryPageJrOperator(ctx, params);
			const data = rs.data;
			const operatorIds = data && data.map((x) => x.operatorId);

			const groupRs = await PermissionBaseClient.queryJrOperatorGroups(ctx, { operatorIds });
			const group = groupRs.data;

			data.forEach((x) => {
				group.forEach((d) => {
					if (x.operatorId === d.operatorId) {
						x.role = d.jrOperatorGroups.map((m) => m.operatorGroupName).join('、');
						x.roleCode = d.jrOperatorGroups.map((m) => m.operatorGroupCode);
						x.isOperatorRole = d.jrOperatorGroups.map((m) => m.operatorGroupCode).includes('6') ? 1 : 0;
					}
				});
			});

			return ctx.success(data, { total: rs.total });
		}
	}
	/**
	 * @description 查询操作员
	 * @param {Object} params
	 * @argument {Array} operatorIds 操作员ID
	 * @returns
	 */
	async queryJrOperatorGroups(params) {
		const { ctx } = this;
		return await PermissionBaseClient.queryJrOperatorGroups(ctx, params);
	}
}

module.exports = PermissionBaseService;
