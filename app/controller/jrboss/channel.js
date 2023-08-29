'use strict';

const Controller = require('egg').Controller;

/**
 * @description 金融boss 渠道管理
 * @author virgoheRomAn
 * @date 2021-12-19
 */
class JrBossChannelController extends Controller {
	// 查询渠道列表
	async queryChannelList() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrOrderService.queryChannelList(params);
		ctx.body = rs;
	}

	// 查询渠道详情
	async queryChannelDetails() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrOrderService.queryChannelDetails(params);
		ctx.body = rs;
	}

	// 产品渠道配置（渠道关联产品时候，需要填写的配置项）
	async queryJRProductConfig() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrOrderService.queryJRProductConfig(params);
		ctx.body = rs;
	}

	// 查询渠道合作产品
	async queryChannelProducts() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrOrderService.queryChannelProducts(params);
		ctx.body = rs;
	}

	// 保存渠道合作产品
	async saveChannelProducts() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrOrderService.saveChannelProducts(params);
		ctx.body = rs;
	}

	// 新增渠道
	async createJrChannel() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrOrderService.createJrChannel(params);
		ctx.body = rs;
	}

	// 修改渠道
	async updateJrChannel() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrOrderService.updateJrChannel(params);
		ctx.body = rs;
	}

	// 查询渠道操作员列表
	async queryPageJrOperator() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.permissionBaseService.queryPageJrOperator(params);
		ctx.body = rs;
	}
}

module.exports = JrBossChannelController;
