const jsyaml = require('js-yaml');
const lodash = require('lodash');

/**
 * @description 项目启动引导
 */
class AppBootHook {
	constructor(app) {
		this.app = app;
		this.logger = this.app.logger;
	}

	async configWillLoad() {
		const { config } = this.app;
		const { cluster } = config;
		const { listen } = cluster;
		const { hostname, port } = listen;

		this.logger.info('当前 NODE_ENV 环境：%s', process.env.NODE_ENV);
		this.logger.info('当前 EGG 环境：%s', this.app.env);
		this.logger.info(`服务名[%s], 地址：%s`, this.app.name, `http://${hostname}:${port}`);
	}

	async willReady() {
		if (!['development', 'local'].includes(process.env.EGG_SERVER_ENV)) {
			const config = this.app.config.apollo;
			if (config.watch) {
				this.app.apollo.startNotification({
					notifications: [{ namespaceName: 'application' }, { namespaceName: 'application.yaml' }]
				});
			}

			this.app.apollo.on('config.updated', (data) => {
				const update = jsyaml.load(data.configurations.content);
				this.logger.info('配置中心更新数据：%s', JSON.stringify(update.config));

				lodash.merge(this.app.config, update.config);
			});
		}
	}
}

module.exports = AppBootHook;
