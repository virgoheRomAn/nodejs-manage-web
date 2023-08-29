import { App } from 'vue';
import ElementPlus, { ConfigProviderProps } from 'element-plus';
import { setupGlobDirectives } from './directive/index';
import { setupGlobComponent } from '/@/components';
import { i18n } from '/@/i18n/index';
import { settings } from '/@/plugins/settings';
import config from '/@/config';
import conlogs from '/@/plugins/conlogs';

import 'element-plus/dist/index.css';
import 'nprogress/nprogress.css';
import '/@/style/index.scss';

// 挂在CDN外部资源
settings.setCdn();

/**
 * @description 引入全局
 * @author virgoheRomAn
 * @date 2023-03-03
 */
export default {
	install: (app: App, options?: any) => {
		// 使用指令
		setupGlobDirectives(app);

		// 使用模板
		setupGlobComponent(app);

		// 国际化
		app.use(i18n);

		// ElementPlus
		app.use(ElementPlus, { i18n: i18n.global.t, size: 'default' } as Partial<ConfigProviderProps>);

		// 生产环境 清除挂载的 window
		if (import.meta.env.VITE_APP_NODE_ENV === 'production') {
			window.__U__ = undefined;
			window.__T__ = undefined;
			window.__S__ = undefined;
			window.__C__ = undefined;
			window.__K__ = undefined;
		}

		// 除了本地环境 打印本次打包信息
		if (import.meta.env.VITE_APP_NODE_ENV !== 'development') {
			conlogs.more(`${config.name} v${config.proVersion}`, `${config.proName} ${__APP_INFO__.mode}`, __APP_INFO__.buildTime);
		}
	},
};
