'use strict';

const Controller = require('egg').Controller;

/**
 * @description 登录处理器
 * @author virgoheRomAn
 * @date 2021-12-19
 */
class LoginController extends Controller {
	// 初始化极验验证码
	async createGeetestCaptcha() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.loginService.createGeetestCaptcha(params);
		ctx.body = rs;
	}

	// 用户登录
	async userLogin() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.loginService.login(params);
		ctx.body = rs;
	}

	// 用户修改密码
	async updatePassword() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.loginService.updatePassword(params);
		ctx.body = rs;
	}

	// 退出登录
	async userLogout() {
		const { ctx } = this;
		ctx.session = {};
		ctx.body = ctx.success('退出成功');
	}

	// 获取登录用户信息
	async getLoginUserInfo() {
		const { ctx } = this;
		const { token, permission, activeSystemId, activeSystemText } = ctx.session;
		const { authorization } = ctx.headers;

		// 没有 token 用户没有登录
		if (!token) {
			ctx.body = ctx.failed({ code: 'AUTHOR_ERROR', message: '用户未登录！' });
			return;
		}

		// 有 token 但是和后端保存的不一致，用户登录过期
		if (`Bearer ${token}` !== authorization) {
			ctx.body = ctx.failed({ code: 'AUTHOR_ERROR', message: '用户登录已过期！' });
			return;
		}

		ctx.body = ctx.success({ token: 'abcdef123456789', activeSystemId, activeSystemText, permission });
	}

	// 刷新登录用户系统权限
	async refreshUserPermission() {
		const { ctx, service } = this;
		const rs = await service.loginService.refreshUserPermission();
		ctx.body = rs;
	}
}

module.exports = LoginController;
