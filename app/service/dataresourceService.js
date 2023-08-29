'use strict';

const Service = require('egg').Service;
const DataresourceClient = require('../client/java-dataresource-resource');

/**
 * @description 资源
 * @author virgoheRomAn
 * @date 2023-03-09
 */
class DataresourceService extends Service {
	/**
	 * @description 敏感词过滤
	 * @param {Object} params
	 * @argument {String} content 文字内容
	 * @returns
	 */
	async sensitiveWordFilter(params) {
		const { ctx } = this;
		return await DataresourceClient.sensitiveWordFilter(ctx, params);
	}

	/**
	 * @description 查询短信模板
	 * @param {Object} 参数
	 * @argument {String} name 模板名称
	 * @argument {String} status 模板状态
	 */
	async querySmsTemplate(params) {
		const { ctx } = this;
		return await DataresourceClient.querySmsTemplate(ctx, params);
	}

	/**
	 * @description 获取历史短信查询列表
	 * @param {Object} 参数
	 * @argument {String} channelSmsState 发送状态
	 * @argument {String} commitEndTime 提交结束时间
	 * @argument {String} commitStartTime 提交起始时间
	 * @argument {String} commitStatus 提交状态
	 * @argument {String} mainRecordId 系统批次号
	 * @argument {String} mobile 手机号
	 * @argument {String} sendType 发送方式
	 * @argument {String} templateContent 模板内容
	 * @argument {String} page 页码
	 * @argument {String} size 每页大小
	 */
	async queryHistorySms(params) {
		const { ctx } = this;
		return await DataresourceClient.queryHistorySms(ctx, params);
	}

	/**
	 * @description 短信批次查询
	 * @param {Object} 参数
	 * @argument {String} commitEndTime 提交结束时间
	 * @argument {String} commitStartTime 提交起始时间
	 * @argument {String} commitStatus 提交状态
	 * @argument {String} mainRecordId 系统批次号
	 * @argument {String} platformBatchNumber 平台批次号
	 * @argument {String} templateContent 模板内容
	 * @argument {String} page 页码
	 * @argument {String} size 每页大小
	 */
	async queryBatchSms(params) {
		const { ctx } = this;
		return await DataresourceClient.queryBatchSms(ctx, params);
	}

	/**
	 * @description 短信批次发送
	 * @param {Object} 参数
	 * @argument {String} fileKey 文件的key值
	 * @argument {String} operatorId 操作人id
	 * @argument {String} operatorName 操作人名称
	 * @argument {String} templateCode 模板编码
	 */
	async sendBatchSms(params) {
		const { ctx } = this;
		params.operatorId = ctx.session.operatorId;
		params.operatorName = ctx.session.operatorName;

		return await DataresourceClient.sendBatchSms(ctx, params);
	}

	/**
	 * @description 标签模板查询
	 * @param {Object} 参数
	 */
	async queryTitleTemplateSmsTemplate(params) {
		const { ctx } = this;
		return await DataresourceClient.queryTitleTemplateSmsTemplate(ctx, params);
	}
}

module.exports = DataresourceService;
