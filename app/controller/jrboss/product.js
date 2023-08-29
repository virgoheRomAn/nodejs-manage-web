'use strict';

const Controller = require('egg').Controller;

/**
 * @description 金融boss 产品管理
 * @author virgoheRomAn
 * @date 2021-12-19
 */
class JrBossProductController extends Controller {
	// 查询产品列表
	async queryProductList() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrOrderService.queryProductList(params);
		ctx.body = rs;
	}
}

module.exports = JrBossProductController;
