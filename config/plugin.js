'use strict';

/** @type Egg.EggPlugin */
module.exports = {
	// 是否开启静态资源插件
	static: {
		enable: true
	},

	// 配置中心
	apollo: {
		enable: !['development', 'local'].includes(process.env.EGG_SERVER_ENV),
		package: '@gaoding/egg-apollo-client'
	},
	
	// 启动 redis
	redis: {
		enable: true,
		package: 'egg-redis'
	},

	// session 存储在 redis
	sessionRedis: {
		enable: true,
		package: 'egg-session-redis'
	},

	// tracer 请求追踪
	tracer: {
		enable: true,
		package: 'egg-apigw-tracer'
	}
};
