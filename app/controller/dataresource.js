'use strict';

const Controller = require('egg').Controller;

/**
 * @description 资源
 * @author virgoheRomAn
 * @date 2021-12-19
 */
class DataresourceController extends Controller {
	// 敏感词过滤
	async sensitiveWordFilter() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.dataresourceService.sensitiveWordFilter(params);
		ctx.body = rs;
	}

	// 查询短信模板
	async querySmsTemplate() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.dataresourceService.querySmsTemplate(params);
		ctx.body = rs;
	}

	// 获取历史短信查询列表
	async queryHistorySms() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.dataresourceService.queryHistorySms(params);
		ctx.body = rs;
	}

	// 短信批次查询
	async queryBatchSms() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.dataresourceService.queryBatchSms(params);
		ctx.body = rs;
	}

	// 短信批次发送
	async sendBatchSms() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.dataresourceService.sendBatchSms(params);
		ctx.body = rs;
	}

	// 标签模板查询
	async queryTitleTemplateSmsTemplate() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.dataresourceService.queryTitleTemplateSmsTemplate(params);
		ctx.body = rs;
	}
}

module.exports = DataresourceController;
