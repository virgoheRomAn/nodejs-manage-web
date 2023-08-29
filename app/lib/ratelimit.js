'use strict';

// 地址池
const IPPool = {};

/**
 * @description 限制IP访问间隔
 */
class Ratelimit {
  constructor(limitTime) {
    // 设置限制时间
    this.limitTime = limitTime;
  }

  /**
   * @description 向ip池子里面添加IP
   * @param {String} ip ip地址
   * @param {String} accessTime 访问时间
   */
  setIpAccessTime(ip, accessTime) {
    IPPool[ip] = accessTime;
  }

  /**
   * @description 删除ip
   * @param {String} ip ip地址
   */
  deleteIp(ip) {
    if (!IPPool[ip]) {
      return;
    }

    IPPool[ip] = '';
    delete IPPool[ip];
  }

  /**
   * @description 获取ip上次访问时间
   * @param {String} ip ip地址
   */
  getIpPreAccessTime(ip) {
    return IPPool[ip];
  }

  /**
   * @description 限制每个ip的访问时间
   * @param {String} ip ip地址
   * @param {String} limitTime 限制时间 s
   */
  canAccess(ip, limitTime = this.limitTime) {
    const current = new Date().getTime();

    if (IPPool.hasOwnProperty(ip)) {
      if (current - this.getIpPreAccessTime(ip) > limitTime * 1000) {
        this.setIpAccessTime(ip, current);
        return true;
      } else {
        return false;
      }
    } else {
      this.setIpAccessTime(ip, current);
      return true;
    }
  }
}

module.exports = Ratelimit;