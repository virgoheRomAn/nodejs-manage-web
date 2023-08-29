'use strict';

/**
 * @description 中间件配置
 * @author virgoheRomAn
 * @date 2021-12-19
 */
module.exports = (appInfo) => {
	const config = (exports = {});

	// 全局过滤 consul监听
	const commonFilter = ['/bjjrCheck', '/actuator/health'];

	// 路由拦截中间件 [加载顺序 从左至右]
	config.middleware = ['httpLogger', 'errorHandler', 'connectHistory', 'auth', 'ratelimit', 'operatorLog'];

	// 请求拦截日志中间件配置
	config.httpLogger = {
		ignore: commonFilter,
		excludeUrls: [],
		excludeType: ['text/html', 'application/xhtml+xml'],
		excludeResType: ['text/html', 'application/xhtml+xml']
	};

	// 错误日志过滤
	config.errorHandler = { ignore: commonFilter };

	// 配置SPA请求路径
	config.connectHistory = {
		compiler: {
			index: '/',
			whiteList: ['/login/userLogout', '/file/redirect', '/actuator/health/readiness', '/actuator/health/liveness'],
			htmlAcceptHeaders: ['text/html', 'application/xhtml+xml', 'text/css'],
			rewrites: [
				{
					from: /^\/api\/*$/,
					to: function (context) {
						let path = context.parsedUrl.path;
						return path;
					}
				}
			]
		}
	};

	/**
	 * @description 鉴权
	 * @param {Array} whiteUrls 完全不拦截 过滤白名单
	 * @param {Array} whiteAuthUrls 白名单里面的路由不做权限拦截 需要做登录鉴权拦截 需要先在白名单里面配置
	 */
	config.auth = { ignore: commonFilter, whiteUrls: ['/login', '/common', '/file'], whiteAuthUrls: ['/file', '/common'] };

	/**
	 * @description 限制用户IP访问频率
	 * @param {Array} ratelimitList 限制IP访问频率名单
	 * @param {String} ratelimiTime 限制时间
	 */
	config.ratelimit = { ignore: commonFilter, ratelimitList: [], ratelimiTime: 10 };

	return config;
};
