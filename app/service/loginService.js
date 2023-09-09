'use strict';

const Service = require('egg').Service;
const UUID = require('uuid');
const PermissionInfraClient = require('../client/java-permission-infra');
const DataresourceClient = require('../client/java-dataresource-resource');

const areaData = require('../mock/area');
const dictData = require('../mock/area');
const userData = require('../mock/user');
const roleData = require('../mock/role');
const permissionData = require('../mock/permission');

/**
 * @description 登录服务 不做拦截
 * @author virgoheRomAn
 * @date 2023-03-09
 */
class LoginService extends Service {
	/**
	 * @description 初始化极验验证码
	 * @returns
	 */
	async createGeetestCaptcha(params) {
		const { ctx } = this;
		return ctx.success({ gt: '1', challenge: '1', offline: '1' });
		// return await DataresourceClient.createGeetestCaptcha(ctx, params);
	}

	/**
	 * @description 用户登录
	 * @argument account 用户名
	 * @argument password 密码
	 * @argument validateStatus 是否极验校验，默认不需要校验
	 * @argument secCode 图形验证码校验数据
	 * @argument challenge 图形验证码流水号
	 * @returns
	 */
	async login(params) {
		const token = UUID.v4();
		const { ctx, service } = this;

		// 鉴权
		// const loginRs = await PermissionInfraClient.login(ctx, params);
		// const { id: userId, name: userName, orgId, needReset } = loginRs.data;
		const { id: userId, name: userName, orgId, needReset } = userData;

		// 需要重置密码
		if (needReset === 1) {
			ctx.session.operatorId = userId;
			throw { code: 'PERMISSION_ERROR', message: '您好，首次登录需要重置密码！', error: { type: 'warn' } };
		}

		// 查询角色
		// const roleRs = await PermissionInfraClient.queryUserRole(ctx, { userId });

		// 获取权限
		// const permissionRs = await PermissionInfraClient.getPermission(ctx, { userId, systemId: 'boss' });

		// 获取基础数据
		// const database = await service.commonService.queryDatabaseInfo({});
		// const { area, dict } = database.data;

		// ctx.session = {};
		// ctx.session.operatorId = userId;
		// ctx.session.operatorName = userName;
		// ctx.session.orgId = orgId;
		// ctx.session.token = token;
		// ctx.session.role = roleRs.data;
		// ctx.session.permission = permissionRs.data;
		// ctx.session.operatorInfo = loginRs.data;

		// return ctx.success({ token, ...loginRs.data, permission: permissionRs.data, role: roleRs.data, area, dict });

		ctx.session = {};
		ctx.session.operatorId = userId;
		ctx.session.operatorName = userName;
		ctx.session.orgId = orgId;
		ctx.session.token = token;
		ctx.session.role = roleData;
		ctx.session.permission = permissionData;
		ctx.session.operatorInfo = userData;

		return ctx.success({ token, ...userData, permission: permissionData, role: roleData, area: areaData, dict: dictData });
	}

	/**
	 * @description 修改密码
	 * @argument id 用户Id
	 * @argument oldPassword 原密码
	 * @argument newPassword 新密码
	 * @returns
	 */
	async updatePassword(params) {
		const { ctx } = this;
		params.id = ctx.session.operatorId;

		return await PermissionInfraClient.updatePassword(ctx, params);
	}

	/**
	 * @description 刷新登录用户系统权限
	 * @returns
	 */
	async refreshUserPermission() {
		const { ctx } = this;
		const userId = ctx.session.operatorId;
		const systemId = 'boss';

		// 查询角色
		const roleRs = await PermissionInfraClient.queryUserRole(ctx, { userId });
		const role = roleRs.data;

		// 获取权限
		const rs = await PermissionInfraClient.getPermission(ctx, { userId, systemId });
		const permission = rs.data;
		ctx.session.role = role;
		ctx.session.permission = permission;

		return ctx.success(permission);
	}
}

module.exports = LoginService;
