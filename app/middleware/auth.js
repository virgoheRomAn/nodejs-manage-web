'user strict';

/**
 * @description 用户登录状态
 * @param {Object} options 中间件的参数
 * @returns
 */

module.exports = (options) => {
	return async function auth(ctx, next) {
		const { token, permission } = ctx.session;
		const { authorization } = ctx.headers;

		// 白名单
		const whiteUrls = options.whiteUrls || [];
		// 白名单中需要拦截的路由
		const whiteAuthUrls = options.whiteAuthUrls || [];

		// 请求路径URL是否在白名单中
		const isWhiteUrl = whiteUrls.some((item) => ctx.url.startsWith(item));
		const isWhiteAuthUrl = whiteAuthUrls.some((item) => ctx.url.startsWith(item));

		// 如果是请求根路径 既渲染页面
		if (ctx.url === '/') {
			await next();
			return;
		}

		if (!isWhiteUrl) {
			// 没有 token 用户没有登录
			if (!token) {
				ctx.session = {};
				throw ctx.creatError('AUTHOR_ERROR', '用户未登录！');
			}

			// 有 token 但是和后端保存的不一致，用户登录过期
			if (`Bearer ${token}` !== authorization) {
				ctx.session = {};
				throw ctx.creatError('AUTHOR_ERROR', '用户登录已过期！');
			}

			// 如果登录了 根据权限过滤
			const tree = await ctx.helper.createPermissionTree(permission, '-1');
			const urls = await ctx.helper.createAuthPermissionUrls(tree);
			const hasPermission = urls.some((u) => ctx.url.startsWith(u));

			if (!hasPermission) {
				throw ctx.creatError('PERMISSION_ERROR', '您没有访问该接口的权限！');
			}

			await next();
		} else if (isWhiteAuthUrl) {
			// 没有 token 用户没有登录
			if (!token) {
				ctx.session = {};
				throw ctx.creatError('AUTHOR_ERROR', '用户未登录！');
			}

			await next();
		} else {
			await next();
		}
	};
};
