'use strict';

/**
 * @description 文件路由
 * @param {Egg.Application} app - egg application
 */
class FileRoutes {
	constructor(app) {
		this.app = app;
	}

	setRoutes() {
		const { router, controller } = this.app;

		router.post('/file/getFileToken', controller.file.getFileToken);
		router.post('/file/downOssFile', controller.file.downOssFile);
		router.get('/file/redirect', controller.file.redirect);
	}
}

module.exports = FileRoutes;
