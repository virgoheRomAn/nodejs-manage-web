'use strict';

const Service = require('egg').Service;
const DataresourceClient = require('../client/java-dataresource-resource');

/**
 * @description 文件处理
 * @author virgoheRomAn
 * @date 2023-03-09
 */
class FileService extends Service {
	/**
	 * @description 获取文件 Token
	 * @param {Object} params
	 * @returns
	 */
	async getFileToken(params) {
		const { ctx } = this;
		return await DataresourceClient.getFileToken(ctx, params);
	}

	/**
	 * @description 下载文件
	 * @param {Object} params
	 * @argument {String} fileName 文件名称
	 * @returns
	 */
	async downOssFile(params) {
		const { ctx } = this;
		return await DataresourceClient.downOssFile(ctx, params);
	}
}

module.exports = FileService;
