'use strict';

/**
 * @description 接口文档地址
 * http://java-dataresource-resource.bjjr-dev/swagger-ui.html
 */

const servename = `http://java-dataresource-resource.bjjr-${process.env.NODE_ENV}`;

/**
 * @description [java-dataresource-resource]
 * @author virgoheRomAn
 * @date 2021-12-23
 */
module.exports = {
	/**
	 * @description 初始化极验验证码
	 * @returns
	 */
	createGeetestCaptcha: async (ctx, params) => {
		const action = servename + `/captcha/geetest/init`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 检测和识别中华人民共和国第二代身份证（七牛云key）
	 * @param {Object} params
	 * @argument {String} application 应用编码
	 * @argument {String} imgName 七牛云key
	 * @argument {String} requestNo UUID
	 * @returns
	 */
	ocrIdCard: async (ctx, params) => {
		const action = servename + `/ocr/idCard`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 检测和识别银行卡（七牛云key）
	 * @param {Object} params
	 * @argument {String} application 应用编码
	 * @argument {String} imgName 七牛云key
	 * @argument {String} requestNo UUID
	 * @returns
	 */
	ocrBankCard: async (ctx, params) => {
		const action = servename + `/ocr/bankCard`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 获取文件信息
	 * @param {Object} params
	 * @argument {String} fileKey 文件key
	 * @argument {String} storageType 文件存储类型：1私有，2公有。默认私有
	 * @returns
	 */
	queryOssFile: async (ctx, params) => {
		const action = servename + `/ossfile/info/query`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 获取文件 Token
	 * @param {Object} params
	 * @returns
	 */
	getFileToken: async (ctx, params) => {
		const action = servename + `/ossfile/token`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 文件上传
	 * @param {Object} params 参数
	 * @argument {String} type 文件后戳
	 * @argument {String} uploadBytes 文件字节数组
	 * @returns
	 */
	upOssFile: async (params) => {
		const action = servename + `/ossfile/upOssFile`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 下载文件
	 * @param {Object} params
	 * @argument {String} fileName 文件名称
	 * @returns
	 */
	downOssFile: async (ctx, params) => {
		const action = servename + `/ossfile/downOssFile`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 敏感词过滤
	 * @param {Object} params
	 * @argument {String} content 文字内容
	 * @returns
	 */
	sensitiveWordFilter: async (ctx, params) => {
		const action = servename + `/zbj/sensitiveWord/filter`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询短信模板
	 * @param {Object} 参数
	 * @argument {String} name 模板名称
	 * @argument {String} status 模板状态
	 */
	querySmsTemplate: async (ctx, params) => {
		const action = servename + `/smsTemplate/query`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 获取历史短信查询列表
	 * @param {Object} 参数
	 * @argument {String} channelSmsState 发送状态
	 * @argument {String} commitEndTime   提交结束时间
	 * @argument {String} commitStartTime 提交起始时间
	 * @argument {String} commitStatus    提交状态
	 * @argument {String} mainRecordId    系统批次号
	 * @argument {String} mobile          手机号
	 * @argument {String} sendType        发送方式
	 * @argument {String} templateContent 模板内容
	 * @argument {String} page            页码
	 * @argument {String} size            每页大小
	 */
	queryHistorySms: async (ctx, params) => {
		const action = servename + `/sms/query`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 短信批次查询
	 * @param {Object} 参数
	 * @argument {String} commitEndTime 提交结束时间
	 * @argument {String} commitStartTime 提交起始时间
	 * @argument {String} commitStatus 提交状态
	 * @argument {String} mainRecordId 系统批次号
	 * @argument {String} platformBatchNumber	平台批次号
	 * @argument {String} templateContent 模板内容
	 * @argument {String} page 页码
	 * @argument {String} size 每页大小
	 */
	queryBatchSms: async (ctx, params) => {
		const action = servename + `/smsBatch/query`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 短信批次发送
	 * @param {Object} 参数
	 * @argument {String} fileKey 文件的key值
	 * @argument {String} operatorId 操作人id
	 * @argument {String} operatorName 操作人名称
	 * @argument {String} templateCode 模板编码
	 */
	sendBatchSms: async (ctx, params) => {
		const action = servename + `/smsBatch/send`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 标签模板查询
	 * @param {Object} 参数
	 */
	queryTitleTemplateSmsTemplate: async (ctx, params) => {
		const action = servename + `/smsTemplate/queryTitleTemplate`;
		return ctx.clientPost(action, params);
	}
};
