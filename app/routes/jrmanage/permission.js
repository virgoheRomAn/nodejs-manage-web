'use strict';

/**
 * @description 综合管理 - 权限路由
 * @param {Egg.Application} app - egg application
 */
class JFmanagePermissionRoutes {
	constructor(app) {
		this.app = app;
	}

	setRoutes() {
		const { router, controller } = this.app;
		router.post('/jfmanage/permission/menu/search/queryPermission', controller.jfmanage.permission.queryPermission);
		router.post('/jfmanage/permission/menu/edit/insertPermission', controller.jfmanage.permission.insertPermission);
		router.post('/jfmanage/permission/menu/edit/updatePermission', controller.jfmanage.permission.updatePermission);

		router.post('/jfmanage/permission/role/search/queryRoleList', controller.jfmanage.permission.queryRoleList);
		router.post('/jfmanage/permission/role/search/queryRoleByPage', controller.jfmanage.permission.queryRoleByPage);
		router.post('/jfmanage/permission/role/search/queryBindPermissionByRoleId', controller.jfmanage.permission.queryBindPermissionByRoleId);
		router.post('/jfmanage/permission/role/edit/insertRole', controller.jfmanage.permission.insertRole);
		router.post('/jfmanage/permission/role/edit/updateRole', controller.jfmanage.permission.updateRole);

		router.post('/jfmanage/permission/operator/search/queryOrganizationList', controller.jfmanage.permission.queryOrganizationList);
		router.post('/jfmanage/permission/operator/search/queryUserByPage', controller.jfmanage.permission.queryUserByPage);
		router.post('/jfmanage/permission/operator/search/queryUserRole', controller.jfmanage.permission.queryUserRole);
		router.post('/jfmanage/permission/operator/edit/createUser', controller.jfmanage.permission.createUser);
		router.post('/jfmanage/permission/operator/edit/updateUser', controller.jfmanage.permission.updateUser);
		router.post('/jfmanage/permission/operator/edit/resetUserPassword', controller.jfmanage.permission.resetUserPassword);
	}
}

module.exports = JFmanagePermissionRoutes;
