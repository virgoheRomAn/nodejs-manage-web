'user strict';

const os = require('os');

/**
 * @description 错误拦截中间件
 * @param {Object} options 中间件的参数
 * @returns 
 */

module.exports = options => {
  return async function errorHandler(ctx, next) {
    // 开始时间
    const startTime = Date.now();

    try {
      await next();
    } catch (err) {
      const logger = ctx.getLogger("httpLogger");
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      // ctx.app.emit('error', err, ctx);

      // 耗时
      const timeConsuming = Date.now() - startTime;
      // 错误栈
      const errStack = err.stack || 'no_stack';

      /**
       * @description 输出错误日志
       * 错误名称：错误信息 错误栈 耗时时间 进程id 当前访问主机
       * SYSTEM_ERROR -> 系统错误
       * PARAMETER_ERROR -> 后端接口参数校验错误
       * BUSINESS_ERROR -> 后端接口返回错误
       * AUTHOR_ERROR -> 用户没登陆 没权限访问接口
       * PERMISSION_ERROR -> 用户登录之后没有权限访问接口
       */
      if (err.code === 'SYSTEM_ERROR') {
        ctx.logger.error('%s：%s，耗时：%sms，进程：%s，主机：%s', err.code, err.message, timeConsuming, process.pid, os.hostname());
      } else if (err.code === "BUSINESS_ERROR" || err.code === "PARAMETER_ERROR" || err.code === 'AUTHOR_ERROR' || err.code === 'PERMISSION_ERROR') {
        logger.info('%s：%s，耗时：%sms，进程：%s，主机：%s', err.code, err.message, timeConsuming, process.pid, os.hostname());
      } else {
        err.code = 'SYSTEM_ERROR';
        ctx.logger.error('%s：%s\n%s\n耗时：%sms\n进程：%s\n主机：%s\n', err.name, err.message, errStack.substring(errStack.indexOf('\n') + 1), timeConsuming, process.pid, os.hostname());
      }

      // 输出错误提示给浏览器
      const opts = err.error ? err.error : {};
      ctx.body = { code: err.code || "SYSTEM_ERROR", success: false, message: err.message, ...opts };
    }
  }
}