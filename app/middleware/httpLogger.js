'user strict';

const dayjs = require('dayjs');
const fs = require("fs");

/**
 * @description 日志拦截中间件
 * @param {Object} options 中间件的参数
 * @returns 
 */

module.exports = options => {
  return async function httpLogger(ctx, next) {
    const { request, response, header } = ctx;
    const logger = ctx.getLogger('httpLogger');

    // 排除的打日志的URL
    const excludeUrls = options.excludeUrls || [];
    // 请求路径URL是否在白名单中
    const isExcludeUrl = excludeUrls.some(item => ctx.url.startsWith(item));

    // 开始时间
    const startTime = Date.now();

    if (!isExcludeUrl) {
      // 打印请求日志
      const reqLog = { originalUrl: request.originalUrl, query: request.query, body: request.body, params: request.params };
      logger.info(`请求信息：%s`, JSON.stringify(reqLog));

      await next();

      // 打印相应日志
      const resLog = response.body;
      const timeConsuming = Date.now() - startTime;

      // 排除的打日志的返回类型
      const excludeResTypes = options.excludeResType || [];
      // 请求路径URL是否在白名单中
      const isExcludeResType = response.type ? excludeResTypes.some(item => response.type.indexOf(item) > -1) : false;

      // 返回类型过滤
      if (!isExcludeResType) {
        logger.info(`返回数据：%s, 耗时：%sms`, JSON.stringify(resLog), timeConsuming);
      } else {
        logger.info(`返回数据：成功, 耗时：%sms, 返回数据类型：%s, 过滤列表：%s`, timeConsuming, response.type, JSON.stringify(excludeResTypes));
      }
    } else {
      await next();
    }
  }
}