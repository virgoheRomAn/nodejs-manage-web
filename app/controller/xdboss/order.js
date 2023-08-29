'use strict';

const Controller = require('egg').Controller;

/**
 * @description 小贷boss 订单处理器
 * @author virgoheRomAn
 * @date 2021-12-19
 */
class XdBossOrderController extends Controller {
	// 查询订单列表
	async queryOrderList() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.xdboss.orderService.queryOrderList(params);
		ctx.body = rs;
	}

	// 查询订单详情
	async queryOrderDetails() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.xdboss.orderService.queryOrderDetails(params);
		ctx.body = rs;
	}
}

module.exports = XdBossOrderController;
