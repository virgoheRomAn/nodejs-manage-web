'use strict';

const Controller = require('egg').Controller;

/**
 * @description 小贷boss 催收处理
 * @author virgoheRomAn
 * @date 2021-12-19
 */
class XdBossCollectionController extends Controller {
	// 获取催收任务
	async queryCollectionTasks() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.xdboss.collectionService.queryCollectionTasks(params);
		ctx.body = rs;
	}

	// 催收记录查询
	async queryCollectionTaskHandle() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.xdboss.collectionService.queryCollectionTaskHandle(params);
		ctx.body = rs;
	}

	// 根据zbjUserId查扣款数据
	async queryDeductions() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.xdboss.collectionService.queryDeductions(params);
		ctx.body = rs;
	}
}

module.exports = XdBossCollectionController;
