'use strict';

/**
 * @description 基础路由
 * @param {Egg.Application} app - egg application
 */
class BaseRoutes {
  constructor(app) {
    this.app = app;
  }

  setRoutes() {
    const { router, controller } = this.app;

    // 加载根目录
    router.get('/', controller.base.render);

    // 健康就绪检测
    router.get("/actuator/health/readiness", controller.base.readiness);

    // 健康存活检测
    router.get("/actuator/health/liveness", controller.base.liveness);
  }
}

module.exports = BaseRoutes;
