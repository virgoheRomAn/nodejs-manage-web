'use strict';

/**
 * @description 综合管理 - 公告管理
 * @param {Egg.Application} app - egg application
 */
class JFmanageNoticeRoutes {
	constructor(app) {
		this.app = app;
	}

	setRoutes() {
		const { router, controller } = this.app;
		router.post('/jfmanage/notice/record/search/queryAnnouncementList', controller.jrboss.order.queryAnnouncementList);
		router.post('/jfmanage/notice/record/edit/saveAnnouncement', controller.jrboss.order.saveAnnouncement);
	}
}

module.exports = JFmanageNoticeRoutes;
