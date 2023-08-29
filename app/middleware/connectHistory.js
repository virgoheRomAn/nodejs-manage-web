const { historyApiFallback } = require('koa2-connect-history-api-fallback');

/**
 * @description SPA 访问页面 url路径请求
 * @param {*} options 
 * @param {*} app 
 * @returns 
 */
module.exports = (options, app) => {
  return historyApiFallback(options.compiler)
};