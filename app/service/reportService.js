'use strict';

const Service = require('egg').Service;
const ReportClient = require('../client/java-report-resource');

/**
 * @description 报表系统
 * @author virgoheRomAn
 * @date 2023-03-09
 */
class reportService extends Service {
	/**
	 * @description 小贷工具 - 金融办上报
	 * @param {Object} params
	 * @argument {String} pullDate 上报月份
	 * @returns
	 */
	async financeOfficeReport(params) {
		const { ctx } = this;
		const { key } = params;
		let rs = null;

		switch (key) {
			case 'tyFKDataPull':
				rs = await ReportClient.tyFKDataPull(ctx, params);
				break;

			case 'tyHKDataPull':
				rs = await ReportClient.tyHKDataPull(ctx, params);
				break;

			case 'tyHKJHDataPull':
				rs = await ReportClient.tyHKJHDataPull(ctx, params);
				break;

			case 'tyHTDataPull':
				rs = await ReportClient.tyHTDataPull(ctx, params);
				break;

			case 'tyWQDataPull':
				rs = await ReportClient.tyWQDataPull(ctx, params);
				break;
		}

		return rs;
	}
}

module.exports = reportService;
