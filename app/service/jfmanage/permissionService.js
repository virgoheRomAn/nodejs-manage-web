'use strict';

const Service = require('egg').Service;
const PermissionInfraClient = require('../../client/java-permission-infra');

/**
 * @description 综合管理 - 权限服务
 * @author virgoheRomAn
 * @date 2023-03-09
 */
class JRmanagePermissionService extends Service {
	/**
	 * @description 查询所有权限
	 * @argument systemId 系统id
	 * @returns
	 */
	async queryPermission(params) {
		const { ctx } = this;
		params.systemId = 'boss';

		const rs = await PermissionInfraClient.queryPermission(ctx, params);
		const permission = rs.data;

		// 处理成树形结构
		const tree = await ctx.helper.createPermissionRouteTree(permission, '-1');
		return ctx.success({ permission, tree });
	}

	/**
	 * @description 新增权限
	 * @param id 权限Id
	 * @param parentId 上级权限Id
	 * @param orderNumber 序号
	 * @param systemId 系统标识
	 * @param permissionName 权限名
	 * @param permissionCode 权限code
	 * @param permissionType 权限类型：MENU-菜单，POINT-控制点
	 * @param urls 接口请求拦截
	 * @param icon 图标
	 * @param routes 路由列表
	 * @returns
	 */
	async insertPermission(params) {
		const { ctx } = this;

		// 新增权限
		const rs = await PermissionInfraClient.insertPermission(ctx, params);
		const { id: permissionId } = rs.data;

		// 新增路由
		if (params.permissionType === 'MENU') {
			await PermissionInfraClient.insertRoute(ctx, { permissionId, routes: params.routes });
		}

		return ctx.success(rs.data);
	}

	/**
	 * @description 修改权限
	 * @param id 权限Id
	 * @param orderNumber 序号
	 * @param systemId 系统标识
	 * @param permissionName 权限名
	 * @param permissionCode 权限code
	 * @param permissionType 权限类型：MENU-菜单，POINT-控制点
	 * @param urls 接口请求拦截
	 * @param icon 图标
	 * @param routes 路由列表
	 * @returns
	 */
	async updatePermission(params) {
		const { ctx } = this;
		const permissionId = params.id;

		// 修改权限
		const rs = await PermissionInfraClient.updatePermission(ctx, params);

		// 修改路由
		if (params.permissionType === 'MENU') {
			await PermissionInfraClient.updateRoute(ctx, { permissionId, routes: params.routes });
		}

		return ctx.success(rs.data);
	}

	/**
	 * @description 查询角色列表全量
	 * @param systemGroup 系统组标识（1：boss系统:2：金服渠道前台:3：金服机构前台:4：金服产品方前台:5：小贷渠道前台）
	 * @returns
	 */
	async queryRoleList(params) {
		const { ctx } = this;
		return await PermissionInfraClient.queryRoleList(ctx, params);
	}

	/**
	 * @description 分页查询角色列表
	 * @param systemGroup 系统组标识（1：boss系统:2：金服渠道前台:3：金服机构前台:4：金服产品方前台:5：小贷渠道前台）
	 * @param roleCode 角色编码
	 * @param roleName 角色名称
	 * @returns
	 */
	async queryRoleByPage(params) {
		const { ctx } = this;
		return await PermissionInfraClient.queryRoleByPage(ctx, params);
	}

	/**
	 * @description 新增角色
	 * @param systemGroup 系统组标识（1：boss系统:2：金服渠道前台:3：金服机构前台:4：金服产品方前台:5：小贷渠道前台）
	 * @param roleCode 角色编码
	 * @param roleName 角色名称
	 * @returns
	 */
	async insertRole(params) {
		const { ctx } = this;

		// 新增角色
		const rs = await PermissionInfraClient.insertRole(ctx, params);
		const { id: roleId } = rs.data;

		// 绑定权限
		await PermissionInfraClient.bindPermissionByRoleId(ctx, { roleId, permissionIds: params.permissionIds });

		return ctx.success(rs.data);
	}

	/**
	 * @description 修改角色
	 * @param id 角色编码
	 * @param systemGroup 系统组标识（1：boss系统:2：金服渠道前台:3：金服机构前台:4：金服产品方前台:5：小贷渠道前台）
	 * @param roleCode 角色编码
	 * @param roleName 角色名称
	 * @returns
	 */
	async updateRole(params) {
		const { ctx } = this;

		// 修改角色
		const rs = await PermissionInfraClient.updateRole(ctx, params);
		const roleId = params.id;

		// 修改
		await PermissionInfraClient.bindPermissionByRoleId(ctx, { roleId, permissionIds: params.permissionIds });

		return ctx.success(rs.data);
	}

	/**
	 * @description  查询角色绑定权限
	 * @param id 角色编码
	 * @returns
	 */
	async queryBindPermissionByRoleId(params) {
		const { ctx } = this;
		return await PermissionInfraClient.queryBindPermissionByRoleId(ctx, params);
	}

	/**
	 * @description 查询组织机构列表
	 * @returns
	 */
	async queryOrganizationList(params) {
		const { ctx } = this;
		return await PermissionInfraClient.queryOrganizationList(ctx, params);
	}

	/**
	 * @description 分页查询用户
	 * @param orgId 组织标识
	 * @param account 账号
	 * @param name 姓名
	 * @returns
	 */
	async queryUserByPage(params) {
		const { ctx } = this;

		// 查询机构列表
		const r = await this.queryOrganizationList();
		// 查询用户
		const rs = await PermissionInfraClient.queryUserByPage(ctx, params);

		return ctx.success({ orgs: r.data, users: rs.data, total: rs.total });
	}

	/**
	 * @description 创建用户并绑定角色
	 * @param orgId 组织标识
	 * @param account 账号
	 * @param password 密码
	 * @param name 姓名
	 * @param roleIds 角色id列表
	 * @returns
	 */
	async createUser(params) {
		const { ctx } = this;
		const rs = await PermissionInfraClient.createUser(ctx, params);
		const { id: userId } = rs.data;

		// 绑定角色
		await PermissionInfraClient.bindUserRole(ctx, { userId, roleIds: params.roleIds });

		return ctx.success(rs.data);
	}

	/**
	 * @description 修改用户并绑定角色
	 * @param id 用户Id
	 * @param name 姓名
	 * @param status 状态：正常（ENABLE）、禁用（DISABLE）
	 * @param isLocked 是否锁定:0-否，1-是
	 * @param roleIds 角色id列表
	 * @returns
	 */
	async updateUser(params) {
		const { ctx } = this;
		const rs = await PermissionInfraClient.updateUser(ctx, params);
		const userId = params.id;

		// 绑定角色
		if (!!params.roleIds) {
			await PermissionInfraClient.bindUserRole(ctx, { userId, roleIds: params.roleIds });
		}

		return ctx.success(rs.data);
	}

	/**
	 * @description 查询用户绑定的角色
	 * @param userId 用户Id
	 * @returns
	 */
	async queryUserRole(params) {
		const { ctx } = this;
		return await PermissionInfraClient.queryUserRole(ctx, params);
	}

	/**
	 * @description 管理员重置用户密码
	 * @param id 用户Id
	 * @param password 密码
	 * @returns
	 */
	async resetUserPassword(params) {
		const { ctx } = this;
		return await PermissionInfraClient.resetUserPassword(ctx, params);
	}
}

module.exports = JRmanagePermissionService;
