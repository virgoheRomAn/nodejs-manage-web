'use strict';

/**
 * @description 小贷boss - 财务管理
 * @param {Egg.Application} app - egg application
 */
class XDbossFinancialRoutes {
	constructor(app) {
		this.app = app;
	}

	setRoutes() {
		const { router, controller } = this.app;
		router.post('/xdboss/financial/receipt/search/queryLoanReceipts', controller.buddha.queryLoanReceipts);
		router.post('/xdboss/financial/receipt/search/queryReceiptDetail', controller.buddha.queryReceiptDetail);
		router.post('/xdboss/financial/receipt/search/settleRepayTrial', controller.buddha.settleRepayTrial);
		router.post('/xdboss/financial/receipt/search/queryDebtTransferList', controller.buddha.queryDebtTransferList);
		router.post('/xdboss/financial/receipt/search/queryDebtTransferItemList', controller.buddha.queryDebtTransferItemList);

		router.post('/xdboss/financial/receipt/edit/offlineRepayByReceipt', controller.buddha.offlineRepayByReceipt);
		router.post('/xdboss/financial/receipt/edit/debtTransferTdCreate', controller.buddha.debtTransferTdCreate);

		router.post('/xdboss/financial/office/edit/financeOfficeReport', controller.report.financeOfficeReport);
	}
}

module.exports = XDbossFinancialRoutes;
