'user strict';
const Ratelimit = require("../lib/ratelimit");

/**
 * @description 限制用户IP访问频率
 * @param {Object} options 中间件的参数
 * @returns 
 */
module.exports = options => {
  return async function ratelimit(ctx, next) {
    const { ratelimitList, ratelimiTime } = options;
    const ratelimit = new Ratelimit(ratelimiTime);

    // 限制请求路径
    const isLimit = ratelimitList.some(item => ctx.url.startsWith(item));

    if (!!isLimit) {
      const ip = ctx.ip;

      if (!ratelimit.canAccess(ip)) {
        throw ctx.creatError('BUSINESS_ERROR', `访问频繁，每${ratelimiTime}秒只能访问一次！`);
      }

      // 继续执行
      await next();
    } else {
      // 继续执行
      await next();
    }
  }
}