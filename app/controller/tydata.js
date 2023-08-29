'use strict';

const Controller = require('egg').Controller;

/**
 * @description 天阳数据
 * @author virgoheRomAn
 * @date 2021-12-19
 */
class TYdataController extends Controller {
	// 客户管理接口
	async queryCustomerInfo() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.tydataService.queryCustomerInfo(params);
		ctx.body = rs;
	}
}

module.exports = TYdataController;
