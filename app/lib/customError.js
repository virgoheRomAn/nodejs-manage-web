'use strict';

const { EggBaseError } = require('egg-errors');

/**
 * @description 自定义错误
 */
class CustomError extends EggBaseError {
  constructor(code, message, data) {
    super({ code, message, data });
  }
}

module.exports = CustomError;