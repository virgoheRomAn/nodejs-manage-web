'use strict';

const Controller = require('egg').Controller;

/**
 * @description 报表
 * @author virgoheRomAn
 * @date 2021-12-19
 */
class ReportController extends Controller {
	// 小贷工具 - 金融办上报
	async financeOfficeReport() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.reportService.financeOfficeReport(params);
		ctx.body = rs;
	}
}

module.exports = ReportController;
