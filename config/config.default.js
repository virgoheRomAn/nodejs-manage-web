const middleware = require("./middleware");
const plugins = require("./plugins");

/**
 * @description 默认配置
 * @param {Egg.EggAppInfo} appInfo app 信息
 */
module.exports = appInfo => {
  return {
    keys: appInfo.name + '_1634799460830_386',
    ...middleware(appInfo),
    ...plugins(appInfo)
  };
};
