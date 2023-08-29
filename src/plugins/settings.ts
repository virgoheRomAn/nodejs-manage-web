import mitt, { Emitter } from 'mitt';
import { nextTick } from 'vue';
import router from '/@/router/index';
import { i18n } from '/@/i18n/index';
import { verifyUrl } from './verify';

/**
 * @description 项目配置相关设置
 * @author virgoheRomAn
 * @date 20233-03-06
 */
class ApplicationSetting {
	// 事件处理
	public emitter: Emitter<MittType> = mitt<MittType>();

	// 图标集合
	public cssCdnUrlList: Array<string> = [
		'//at.alicdn.com/t/c/font_2298093_rnp72ifj3ba.css',
		'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
	];

	// 外部引入 js
	public jsCdnUrlList: Array<string> = [];

	/**
	 * @description 设置外部引入的 CDN
	 */
	setCdn(): void {
		// css
		if (this.cssCdnUrlList.length > 0) {
			this.cssCdnUrlList.forEach((v) => {
				let link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = v;
				link.crossOrigin = 'anonymous';
				document.getElementsByTagName('head')[0].appendChild(link);
			});
		}

		// js
		if (this.jsCdnUrlList.length > 0) {
			this.jsCdnUrlList.forEach((v) => {
				let link = document.createElement('script');
				link.src = v;
				document.body.appendChild(link);
			});
		}
	}

	/**
	 * @description 设置 自定义 tagsView 名称、 自定义 tagsView 名称国际化
	 * @param params 路由 query、params 中的 tagsViewName
	 * @returns 返回当前 tagsViewName 名称
	 */
	setTagsViewNameI18n(item: any): string {
		let tagsViewName: string = '';
		const { query, params, meta } = item;
		if (query?.tagsViewName || params?.tagsViewName) {
			if (/\/zh-cn|en|zh-tw\//.test(query?.tagsViewName) || /\/zh-cn|en|zh-tw\//.test(params?.tagsViewName)) {
				// 国际化
				const urlTagsParams = (query?.tagsViewName && JSON.parse(query?.tagsViewName)) || (params?.tagsViewName && JSON.parse(params?.tagsViewName));
				tagsViewName = urlTagsParams[i18n.global.locale.value];
			} else {
				// 非国际化
				tagsViewName = i18n.global.t(query?.tagsViewName || params?.tagsViewName);
			}
		} else {
			// 非自定义 tagsView 名称
			tagsViewName = i18n.global.t(meta.title);
		}
		return tagsViewName;
	}

	/**
	 * @description 设置页面的标题国际化
	 */
	setPageTitle() {
		nextTick(() => {
			let webTitle = '';
			let globalTitle: string = import.meta.env.VITE_APP_TITLE;
			const { path, meta } = router.currentRoute.value;
			if (path === '/login') {
				webTitle = <string>meta.title;
			} else {
				webTitle = this.setTagsViewNameI18n(router.currentRoute.value);
			}
			document.title = `${webTitle} - ${globalTitle}` || globalTitle;
		});
	}

	/**
	 * @description 打开外部链接
	 * @param val 当前点击项菜单
	 */
	handleOpenLink(val: RouteItem) {
		const { origin, pathname } = window.location;
		router.push(val.path);
		if (verifyUrl(<string>val.meta?.isLink)) window.open(val.meta?.isLink);
		else window.open(`${origin}${pathname}/${val.meta?.isLink}`);
	}

	/**
	 * @description 将所有页面生成数组结构 用户配置权限路由模板
	 * @param dynamicViewsModules 获取目录下的 .vue、.tsx 全部文件
	 * @param component 当前要处理项 component
	 * @returns 返回处理成函数后的 component
	 */
	createViewLayoutList(dynamicViewsModules?: Record<string, Function>) {
		dynamicViewsModules = dynamicViewsModules || import.meta.glob('../views/**/*.vue');
		const array: Array<any> = [
			{ code: 'layout/routerView/parent', text: '父辈组件 parent' },
			{ code: 'jrboss/home', text: '金融首页' },
			{ code: 'xdboss/home', text: '小贷首页' },
			{ code: 'jfmanage/home', text: '综合首页' }
		];

		for (const path in dynamicViewsModules) {
			const key = path.match(/(\S+)\/(\S+).vue/) as Array<string>;
			const k = key[0].replace(/..\/views|..\/../, '');

			if (['/jrboss', '/xdboss', '/jfmanage'].some((x) => k.startsWith(x) && key[2] !== 'home')) {
				if (key[1].search(/(\/common|\/src|\/customForm)/gi) === -1) {
					const parent = key[1]
						.replace(/..\/views\//gi, '')
						.split('/')
						.join('-');
					const text = `${parent}-${key[2]}`;
					array.push({ code: k.slice(1).split('.')[0], text });
				}
			}
		}

		return array;
	}
}

// 导出应用设置函数
export const settings = new ApplicationSetting();

// 单独导出事件处理器
export const mittBus = settings.emitter;

export default settings;
