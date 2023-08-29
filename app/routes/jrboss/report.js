'use strict';

/**
 * @description 金融boss - 报表
 * @param {Egg.Application} app - egg application
 */
class JRbossReportRoutes {
	constructor(app) {
		this.app = app;
	}

	setRoutes() {
		const { router, controller } = this.app;
		router.post('/jrboss/report/loans/search/queryLoanReport', controller.jrboss.report.queryLoanReport);
		router.post('/jrboss/report/repayment/search/queryRepaymentReport', controller.jrboss.report.queryRepaymentReport);
	}
}

module.exports = JRbossReportRoutes;
