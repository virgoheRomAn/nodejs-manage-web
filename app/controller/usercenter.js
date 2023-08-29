'use strict';

const Controller = require('egg').Controller;

/**
 * @description 用户中心
 * @author virgoheRomAn
 * @date 2021-12-19
 */
class UsercenterController extends Controller {
	// 查询客户列表
	async queryUserList() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.userCenterService.queryUserList(params);
		ctx.body = rs;
	}

	// 查询客户信息
	async queryUserInfo() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.userCenterService.queryUserInfo(params);
		ctx.body = rs;
	}
}

module.exports = UsercenterController;
