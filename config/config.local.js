'use strict';
const ip = require('ip');

/**
 * @description 默认配置
 * @param {Egg.EggAppInfo} appInfo app 信息
 */
module.exports = appInfo => {
  const config = exports = {};

  // 微信配置
  config.weixin = {
    wxgzhCode: "BJJR_WXGZH",
    wxgzhName: "金融微信公众号",
    appId: "wx5da11f703a6879ff",
    secret: "f929f2d0265495fa53818b610b925f2c"
  }

  // 启动项目端口
  config.cluster = {
    listen: { hostname: ip.address(), port: 21000 },
  };

  // redis 配置
  config.redis = {
    client: { host: 'redisdev.jr-zbj.com', port: '6379', password: '!QAZ@WSX', db: 0 }
  }

  return config;
};
