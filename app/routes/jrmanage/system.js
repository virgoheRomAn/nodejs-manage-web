'use strict';

/**
 * @description 综合管理 - 系统工具
 * @param {Egg.Application} app - egg application
 */
class JFmanageSystemRoutes {
	constructor(app) {
		this.app = app;
	}

	setRoutes() {
		const { router, controller } = this.app;
		router.post('/jfmanage/system/reconciliation/search/queryReconciliationTypes', controller.reconciliation.queryReconciliationTypes);
		router.post('/jfmanage/system/reconciliation/search/queryReconciliationList', controller.reconciliation.queryReconciliationList);
		router.post('/jfmanage/system/reconciliation/edit/queryReconciliationFailureList', controller.reconciliation.queryReconciliationFailureList);
		router.post('/jfmanage/system/reconciliation/edit/failureItemProcess', controller.reconciliation.failureItemProcess);
		router.post('/jfmanage/system/reconciliation/edit/queryReconciliationOperateRecord', controller.reconciliation.queryReconciliationOperateRecord);
		router.post('/jfmanage/system/reconciliation/edit/reconciliationRetry', controller.reconciliation.reconciliationRetry);
		router.post('/jfmanage/system/reconciliation/edit/reconciliationManualProcess', controller.reconciliation.reconciliationManualProcess);

		router.post('/jfmanage/system/accounting/search/queryCloseAccount', controller.buddha.queryCloseAccount);
		router.post('/jfmanage/system/accounting/edit/addCloseAccount', controller.buddha.addCloseAccount);

		router.post('/jfmanage/system/sensitive/edit/sensitiveWordFilter', controller.dataresource.sensitiveWordFilter);
	}
}

module.exports = JFmanageSystemRoutes;
