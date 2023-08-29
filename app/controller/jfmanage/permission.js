'use strict';

const Controller = require('egg').Controller;

/**
 * @description 综合管理 权限处理器
 * @author virgoheRomAn
 * @date 2021-12-19
 */
class JfManagePermissionController extends Controller {
	// 查询全部权限
	async queryPermission() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jfmanage.permissionService.queryPermission(params);
		ctx.body = rs;
	}

	// 新增权限
	async insertPermission() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jfmanage.permissionService.insertPermission(params);
		ctx.body = rs;
	}

	// 修改权限
	async updatePermission() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jfmanage.permissionService.updatePermission(params);
		ctx.body = rs;
	}

	// 查询角色列表全量
	async queryRoleList() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jfmanage.permissionService.queryRoleList(params);
		ctx.body = rs;
	}

	// 分页查询角色而列表
	async queryRoleByPage() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jfmanage.permissionService.queryRoleByPage(params);
		ctx.body = rs;
	}

	// 新增角色
	async insertRole() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jfmanage.permissionService.insertRole(params);
		ctx.body = rs;
	}

	// 修改角色
	async updateRole() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jfmanage.permissionService.updateRole(params);
		ctx.body = rs;
	}

	// 查询角色绑定权限
	async queryBindPermissionByRoleId() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jfmanage.permissionService.queryBindPermissionByRoleId(params);
		ctx.body = rs;
	}

	// 查询组织机构列表
	async queryOrganizationList() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jfmanage.permissionService.queryOrganizationList(params);
		ctx.body = rs;
	}

	// 分页查询用户
	async queryUserByPage() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jfmanage.permissionService.queryUserByPage(params);
		ctx.body = rs;
	}

	// 创建用户并绑定角色
	async createUser() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jfmanage.permissionService.createUser(params);
		ctx.body = rs;
	}

	// 修改用户并绑定角色
	async updateUser() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jfmanage.permissionService.updateUser(params);
		ctx.body = rs;
	}

	// 查询用户绑定的角色
	async queryUserRole() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jfmanage.permissionService.queryUserRole(params);
		ctx.body = rs;
	}

	// 管理员重置用户密码
	async resetUserPassword() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jfmanage.permissionService.resetUserPassword(params);
		ctx.body = rs;
	}
}

module.exports = JfManagePermissionController;
