'use strict';
const path = require("path");

/**
 * @description 插件配置
 * @author virgoheRomAn
 * @date 2021-12-19
 */
module.exports = appInfo => {
  const envTag = process.env.NODE_ENV === "development" ? "dev" : process.env.NODE_ENV;
  const config = exports = {};

  // 全局错误捕获
  config.onerror = {
    all(err, ctx) { },
  };

  // 静态资源服务插件
  config.static = {
    prefix: '/assets',
    dir: [
      path.join(appInfo.baseDir, 'dist/assets'),
      { prefix: '/resource', dir: path.join(appInfo.baseDir, 'dist/resource') },
    ]
  }

  // apollo 配置
  config.apollo = {
    config_server_url: `http://apollo-service-${envTag}-apollo-configservice.bjjk-public-${envTag}:8080`,
    app_id: appInfo.name,
    init_on_start: true,
    cluster_name: 'default',
    namespace_name: 'application.yaml',
    watch: true,
    timeout: 50000,
  };

  // session 配置
  config.session = {
    maxAge: 30 * 60 * 1000,
    key: `${config.name}__session__`,
    httpOnly: true,
    encrypt: true,
    logValue: true,
    renew: true
  }

  // egg-security 安全配置
  config.security = {
    csrf: {
      headerName: 'x-csrf-token',
    },
  }

  // egg-apigw-tracer 请求追踪
  config.tracer = { mode: 'uuid' };

  // egg-logger 日志配置
  config.logger = {
    disableConsoleAfterReady: false,
    dir: process.env.NODE_ENV === 'development' ? path.join(appInfo.baseDir, 'opt/logs') : '/opt/logs',
    appLogName: `${appInfo.name}.app.log`,
    coreLogName: `${appInfo.name}.core.log`,
    agentLogName: `${appInfo.name}.agent.log`,
    errorLogName: `${appInfo.name}.error.log`,
    formatter(meta) {
      return `${meta.date.replace(/,/gi, '.')} [${meta.pid}] [${meta.level}] ${meta.message}`;
    },
    contextFormatter(meta) {
      const header = meta.ctx.header;
      const logHead = `${meta.date.replace(/,/gi, '.')} [${meta.level}] [${appInfo.name},${header['x-b3-traceid'] || ''},${header['x-b3-spanid'] || ''}]`;
      const logReq = `[${meta.pid}] [${meta.ctx.method}] [requestUrl: ${meta.ctx.url}] --- ${meta.message}`;
      return `${logHead} ${logReq}`;
    },
  };

  // 自定义框架日志
  config.customLogger = {
    httpLogger: {
      disableConsoleAfterReady: false,
      file: process.env.NODE_ENV === 'development' ? path.join(appInfo.baseDir, 'opt/logs', `${appInfo.name}.log`) : `/opt/logs/${appInfo.name}.log`,
      formatter(meta) {
        return `${meta.date.replace(/,/gi, '.')} [${meta.pid}] [${meta.level}] ${meta.message}`;
      },
      contextFormatter(meta) {
        const header = meta.ctx.header;
        const logHead = `${meta.date.replace(/,/gi, '.')} [${meta.level}] [${appInfo.name},${header['x-b3-traceid'] || ''},${header['x-b3-spanid'] || ''}]`;
        const logReq = `[${meta.pid}] [${meta.ctx.method}] [requestUrl: ${meta.ctx.url}] --- ${meta.message}`;
        return `${logHead} ${logReq}`;
      },
    }
  }

  return config
};