'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');

/**
 * @description 基础处理器
 * @author virgoheRomAn
 * @date 2021-12-19
 */
class BaseController extends Controller {
	// 渲染页面
	async render() {
		const { ctx } = this;
		ctx.response.type = 'html';
		ctx.body = fs.readFileSync(path.posix.join('dist', 'index.html'));
	}

	// 健康就绪检测
	async readiness() {
		this.ctx.status = 200;
		this.ctx.body = 'OK';
	}

	// 健康存活检测
	async liveness() {
		this.ctx.status = 200;
		this.ctx.body = 'OK';
	}
}

module.exports = BaseController;
