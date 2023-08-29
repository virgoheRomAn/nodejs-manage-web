'use strict';

/**
 * @description 公共路由 不做拦截
 * @param {Egg.Application} app - egg application
 */
class CommonRoutes {
	constructor(app) {
		this.app = app;
	}

	setRoutes() {
		const { router, controller } = this.app;

		// 全系统
		router.post('/common/setActiveSystemCode', controller.common.setActiveSystemCode);
		router.post('/common/queryFormConfig', controller.workflow.queryFormConfig);
		router.post('/common/getProcessInstancesDiagram', controller.workflow.getProcessInstancesDiagram);
		router.post('/common/queryAuditRecord', controller.workflow.queryAuditRecord);

		// 小贷
		router.post('/common/xd/queryRepayRecord', controller.buddha.queryRepayRecord);
		router.post('/common/xd/queryOfflineRepayRecord', controller.buddha.queryOfflineRepayRecord);
		router.post('/common/xd/debtTransferTdDetail', controller.buddha.debtTransferTdDetail);
		router.post('/common/xd/debtTransferTdParse', controller.buddha.debtTransferTdParse);

		// 金融
		router.post('/common/jr/queryProduct', controller.jrboss.product.queryProductList);
		router.post('/common/jr/queryChannel', controller.jrboss.channel.queryChannelList);
		router.post('/common/jr/queryRepaymentPlanList', controller.jrboss.order.queryRepaymentPlanList);

		// 金服
		router.post('/common/jf/queryUserByPage', controller.jfmanage.permission.queryUserByPage);
	}
}

module.exports = CommonRoutes;
