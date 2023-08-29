'use strict';

const Controller = require('egg').Controller;

/**
 * @description 金融boss 报表
 * @author virgoheRomAn
 * @date 2021-12-19
 */
class JrBossReportController extends Controller {
	// 分页查询金融放款报表
	async queryLoanReport() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrReportService.queryLoanReport(params);
		ctx.body = rs;
	}

	// 全量查询金融汇款明细报表
	async queryRepaymentReport() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrReportService.queryRepaymentReport(params);
		ctx.body = rs;
	}
}

module.exports = JrBossReportController;
