import qs from 'qs';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import router from '/@/router/index';
import U from '/@/utils';
import { mittBus } from '/@/plugins/settings';

interface UrlParams {
	isRoute?: boolean;
	exclude?: string | Array<any>;
	opts?: EmptyObjectType;
	route?: RouteLocationNormalizedLoaded;
}
/**
 * @description 生成Url 参数
 * @param isRoute 是否使用路由当作基础
 * @param exclude 排除的key
 * @param opts 参数
 * @returns
 */
export function createUrlParams({ isRoute = true, exclude = [], opts = {}, route }: UrlParams): string {
	const params = isRoute ? { ...(route as RouteLocationNormalizedLoaded).query, ...opts } : opts;

	if (!!params && !U.isObject(params)) return '';

	if (typeof exclude === 'object' && U.isArray(exclude)) {
		exclude.forEach((x) => {
			delete params[x];
		});
	}

	if (typeof exclude === 'string' && U.isString(exclude)) {
		delete params[exclude];
	}

	return qs.stringify(params);
}

/**
 * @description 根据URL 参数返回对象
 * @param exclude 排除的key
 * @param opts 参数
 * @returns
 */
export function createObjectByUrlParams({ exclude = [], opts = {}, route }: UrlParams): EmptyObjectType {
	const { query, params } = route as RouteLocationNormalizedLoaded;

	const options = reactive({
		loading: false,
		...query,
		...params,
		...opts
	});

	if (typeof exclude === 'object' && U.isArray(exclude)) {
		exclude.forEach((x) => {
			delete options[x];
		});
	}

	if (typeof exclude === 'string' && U.isString(exclude)) {
		delete options[exclude];
	}

	return options;
}

/**
 * @description 重定向地址
 * @param url 默认地址
 * @param isRedirect 是否启用重定向
 */
export function redirectPath(url: any, isRedirect = true) {
	const { query } = router.currentRoute.value as EmptyObjectType;

	if (!isRedirect) {
		router.push(url);
	} else {
		const redirectUrl = decodeURIComponent(query.redirect);

		if (!!redirectUrl) {
			if (!redirectUrl.match(/^http[s]{0,1}:\/\//g)) {
				router.push(redirectUrl);
			} else {
				window.location.href = redirectUrl;
			}
		} else if (url) {
			router.push(url);
		}
	}
}

/**
 * @description 跳转页面(通过name)
 * @param name 路由name
 * @param data 参数(默认空)
 */
export function toPage(name: string, data = {}) {
	const query = { ...data, t: Number(new Date()) };
	router.push({ name, query });
}

/**
 * @description 页面跳转
 */
export function goToUrl(url: string, route: any) {
	mittBus.emit('onCurrentContextmenuClick', { contextMenuClickId: 1, ...route });
	router.push(url);
}

/**
 * @description 后退
 */
export function backPage() {
	router.back();
}
