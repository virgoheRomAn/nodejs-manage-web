// 扩展 RouteMeta 接口
declare interface RouteMeta extends Record<string | number | symbol, unknown> {
	title?: string;
	isLink?: string;
	isHide?: boolean;
	isKeepAlive?: boolean;
	isAffix?: boolean;
	isIframe?: boolean;
	roles?: string[];
	icon?: string;
}

// 声明路由 to from
declare interface RouteToFrom<T = any> extends RouteItem {
	path?: string;
	children?: T[];
}

// 声明路由当前项类型集合
declare type RouteItems<T extends RouteItem = any> = T[];

// 声明路由当前项类型
declare type RouteItem<T = any> = {
	path: string;
	tagsViewPath?: string;
	name?: string | symbol | undefined | null;
	redirect?: string;
	component?: any;
	k?: T;
	meta?: {
		title?: string;
		isLink?: string;
		isHide?: boolean;
		isKeepAlive?: boolean;
		isAffix?: boolean;
		isIframe?: boolean;
		roles?: string[];
		parentPath?: string;
		icon?: string;
		isDynamic?: boolean;
		isDynamicPath?: string;
		isIframeOpen?: string;
		loading?: boolean;
		isKeepAlive?: boolean;
	};
	children: T[];
	query?: { [key: string]: T };
	params?: { [key: string]: T };
	contextMenuClickId?: string | number;
	commonUrl?: string;
	isFnClick?: boolean;
	url?: string;
	transUrl?: string;
	title?: string;
	id?: string | number;
};
