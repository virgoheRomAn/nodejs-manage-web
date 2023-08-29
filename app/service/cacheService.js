'use strict';

const Service = require('egg').Service;

/**
 * @description 存储 redis 
 */
class CacheService extends Service {
  async set(key, value, time) {
    const val = JSON.stringify(value);
    if (this.app.redis) {
      if (!time) {
        await this.app.redis.set(key, val);
      } else {
        await this.app.redis.set(key, val, 'EX', time);
      }
    }
  }

  async get(key) {
    if (this.app.redis) {
      const val = await this.app.redis.get(key);
      if (!val) return;
      return JSON.parse(val)
    }
  }

  async flushall() {
    this.app.redis.flushall();
    return;
  }
}

module.exports = CacheService;