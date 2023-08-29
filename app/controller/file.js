'use strict';

const Controller = require('egg').Controller;

/**
 * @description 文件处理器
 * @author virgoheRomAn
 * @date 2021-12-19
 */
class FileController extends Controller {
	// 获取上传文件的token
	async getFileToken() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.fileService.getFileToken(params);
		ctx.body = rs;
	}

	// 获取上传文件的token
	async downOssFile() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.fileService.downOssFile(params);
		ctx.body = rs;
	}

	// 重定向下载地址
	async redirect() {
		const { ctx, service } = this;
		const params = ctx.query;
		const rs = await service.fileService.downOssFile(params);
		ctx.unsafeRedirect(rs.data);
	}
}

module.exports = FileController;
