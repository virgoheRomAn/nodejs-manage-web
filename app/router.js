'use strict';

const requireAll = require('require-all');

/**
 * @description 路由列表
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  requireAll({
    dirname: __dirname + '/routes',
    resolve: function (Route) {
      return new Route(app).setRoutes();
    }
  });
};
