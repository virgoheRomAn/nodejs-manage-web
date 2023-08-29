'use strict';

/**
 * @description 小贷boss - 报表
 * @param {Egg.Application} app - egg application
 */
class XDbossReportRoutes {
	constructor(app) {
		this.app = app;
	}

	setRoutes() {
		const { router, controller } = this.app;
		router.post('/xdboss/report/onloan/search/queryOnloanProgressReport', controller.buddha.queryOnloanProgressReport);
		router.post('/xdboss/report/loans/search/queryLoansReport', controller.buddha.queryLoansReport);
		router.post('/xdboss/report/overpayment/search/queryOverpaymentReport', controller.buddha.queryOverpaymentReport);
		router.post('/xdboss/report/settlement/search/querySettleDetailReport', controller.buddha.querySettleDetailReport);
		router.post('/xdboss/report/payment/search/queryRepaymentReport', controller.buddha.queryRepaymentReport);
	}
}

module.exports = XDbossReportRoutes;
