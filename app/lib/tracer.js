'user strict';

/**
 * @description 请求链追踪
 * @author virgoheRomAn
 * @date 2021-12-19
 */
const Tracer = require('egg-tracer');
const uuid = require('uuid');

class RequestTracer extends Tracer {
  get traceId() {
    return uuid.v1();
  }
}

module.exports = RequestTracer;