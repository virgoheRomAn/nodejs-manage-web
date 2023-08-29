'use strict';

/**
 * @description 综合管理 - 短信管理
 * @param {Egg.Application} app - egg application
 */
class JFmanageNoteRoutes {
	constructor(app) {
		this.app = app;
	}

	setRoutes() {
		const { router, controller } = this.app;
		router.post('/jfmanage/note/template/search/querySmsTemplate', controller.dataresource.querySmsTemplate);
		router.post('/jfmanage/note/history/search/queryHistorySms', controller.dataresource.queryHistorySms);
		router.post('/jfmanage/note/batch/search/queryBatchSms', controller.dataresource.queryBatchSms);
		router.post('/jfmanage/note/send/search/queryTitleTemplateSmsTemplate', controller.dataresource.queryTitleTemplateSmsTemplate);
		router.post('/jfmanage/note/send/edit/sendBatchSms', controller.dataresource.sendBatchSms);
	}
}

module.exports = JFmanageNoteRoutes;
