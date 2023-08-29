'use strict';

/**
 * @description 金融boss - 渠道管理
 * @param {Egg.Application} app - egg application
 */
class JRbossChannelRoutes {
	constructor(app) {
		this.app = app;
	}

	setRoutes() {
		const { router, controller } = this.app;
		router.post('/jrboss/channel/record/search/queryChannelList', controller.jrboss.channel.queryChannelList);
		router.post('/jrboss/channel/record/search/queryChannelDetails', controller.jrboss.channel.queryChannelDetails);
		router.post('/jrboss/channel/record/search/queryJRProductConfig', controller.jrboss.channel.queryJRProductConfig);
		router.post('/jrboss/channel/record/search/queryChannelProducts', controller.jrboss.channel.queryChannelProducts);
		router.post('/jrboss/channel/record/search/queryPageJrOperator', controller.jrboss.channel.queryPageJrOperator);

		router.post('/jrboss/channel/record/edit/saveChannelProducts', controller.jrboss.channel.saveChannelProducts);
		router.post('/jrboss/channel/record/edit/createJrChannel', controller.jrboss.channel.createJrChannel);
		router.post('/jrboss/channel/record/edit/updateJrChannel', controller.jrboss.channel.updateJrChannel);
	}
}

module.exports = JRbossChannelRoutes;
