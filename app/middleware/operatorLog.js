'user strict';
const PermissionBaseClient = require('../client/java-permission-base');

const OPERATOR_LOG_INFO = [
	{ url: `/jfmanage/permission/menu/edit/insertPermission`, params: { menuName: '权限管理/权限管理', operation: '新增权限' } },
	{ url: `/jfmanage/permission/menu/edit/updatePermission`, params: { menuName: '权限管理/权限管理', operation: '修改权限' } },
	{ url: `/jfmanage/permission/role/edit/insertRole`, params: { menuName: '权限管理/角色管理', operation: '新增角色' } },
	{ url: `/jfmanage/permission/role/edit/updateRole`, params: { menuName: '权限管理/角色管理', operation: '修改角色' } },
	{ url: `/jfmanage/permission/operator/edit/createUser`, params: { menuName: '权限管理/操作员管理', operation: '新增操作员' } },
	{ url: `/jfmanage/permission/operator/edit/updateUser`, params: { menuName: '权限管理/操作员管理', operation: '修改操作员' } },
	{ url: `/jfmanage/permission/operator/edit/resetUserPassword`, params: { menuName: '权限管理/操作员管理', operation: '重置操作员密码' } },
	{ url: `/xdboss/financial/receipt/edit/offlineRepayByReceipt`, params: { menuName: '账务管理/借据查询', operation: '线下登账' } }
];

/**
 * @description 操作员日志
 * @description 特定的接口需要记录操作员操作日志
 * @param {Object} options 中间件的参数
 * @returns
 */
module.exports = (options) => {
	return async function operatorLog(ctx, next) {
		const { ip: ipAddress, url, method } = ctx;
		const { operatorName: operator } = ctx.session;
		const interceptUrls = OPERATOR_LOG_INFO.map((x) => x.url);
		const isIntercept = interceptUrls.some((x) => url === x);

		if (!!isIntercept) {
			await next();

			const operation = OPERATOR_LOG_INFO.find((x) => x.url === url);
			const requestData = method === 'GET' ? ctx.request.params || ctx.request.query : ctx.request.rawBody;
			const responseData = JSON.stringify(ctx.body);

			// 调用接口
			const params = { url, ipAddress, operator, requestData, responseData, ...operation.params };
			await PermissionBaseClient.createOperatorLog(ctx, params);
		} else {
			// 继续执行
			await next();
		}
	};
};
