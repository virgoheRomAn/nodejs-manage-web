'user strict';
const OS = require('os');

/**
 * @description 扩展应用 app
 * @author virgoheRomAn
 * @date 2021-12-19
 */
module.exports = {
  /**
   * @description 获取IP地址
   * @returns {String} IP地址
   */
  getIPAddress() {
    const interfaces = OS.networkInterfaces();
    for (let devName in interfaces) {
      const iface = interfaces[devName];
      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          return alias.address;
        }
      }
    }
  },
}