const egg = require('egg');

/**
 * @description 启动服务
 * @author virgoheRomAn
 * @date 2023-02-28
 */
egg.start({
  baseDir: __dirname,
  mode: 'single',
}).then((app) => {
  return new Promise((resolve, reject) => {
    app.listen(app.config.cluster.listen.port, () => {
      resolve();
    });
  });
}).catch(console.error);