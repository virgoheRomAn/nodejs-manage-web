const jsyaml = require('js-yaml');
const lodash = require('lodash');

/**
 * @description apollo 获取配置
 * @author virgoheRomAn
 * @date 2023-02-28
 */
module.exports = (apollo, appConfig) => {
  if (!["development", "local"].includes(process.env.EGG_SERVER_ENV)) {
    const rs = apollo.getNamespace('application.yaml');
    const doc = jsyaml.load(rs.content);
    lodash.merge(appConfig, doc.config);

    return { ...appConfig }
  }
}