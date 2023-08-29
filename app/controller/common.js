'use strict';

const Controller = require('egg').Controller;

/**
 * @description 公共处理器
 * @author virgoheRomAn
 * @date 2021-12-19
 */
class CommonController extends Controller {
	// 设置当前选择的系统
	async setActiveSystemCode() {
		const { ctx } = this;
		const params = ctx.request.body;
		const { token } = ctx.session;

		if (token) {
			ctx.session.activeSystemId = params.activeSystemId;
			ctx.session.activeSystemText = params.activeSystemText;

			ctx.body = ctx.success('ok');
		} else {
			ctx.session.activeSystemId = '';
			ctx.session.activeSystemText = '';
			throw ctx.creatError('AUTHOR_ERROR', '用户未登录或者登录已过期！');
		}
	}
}

module.exports = CommonController;
