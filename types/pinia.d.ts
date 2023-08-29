/**
 * pinia 类型定义
 */

// 数据字典类型
declare interface DictIterface<T = any> {
	dicts: T[];
	fields: T[];
}

// 城市信息类型
declare interface AreaIterface<T = any> {
	area: T[];
	city: T[];
	province: T[];
}

// 基础信息
declare interface DatabaseState<T = any> {
	area: T[];
	areaSource: T[];
	dict: DictIterface;
}

// 用户信息
declare interface UserInfosState<T = any> {
	token: string;
	id?: string | number;
	orgId?: string | number;
	name?: string;
	account?: string;
	role?: T[];
	permission?: T[];
	userInfo: {
		[key: string]: T;
	};
}

// 登录信息
declare interface UserLogin<T = any> {
	account: string | number;
	password: string;
	validateStatus: boolean;
	secCode: string;
	challenge: string;
}

// 路由缓存列表
declare interface KeepAliveNamesState {
	keepAliveNames: string[];
	cachedViews: string[];
}

// 后端返回原始路由(未处理时)
declare interface RequestOldRoutesState {
	requestOldRoutes: string[];
}

// TagsView 路由列表
declare interface TagsViewRoutesState<T = any> {
	tagsViewRoutes: T[];
	isTagsViewCurrenFull: Boolean;
}

// 路由列表
declare interface RoutesListState<T = any> {
	firstMenu: T[];
	routesList: T[];
	activeSystemId: string;
	activeSystemText: string;
	isColumnsMenuHover: Boolean;
	isColumnsNavHover: Boolean;
}

// 布局配置
declare interface ThemeConfigState {
	themeConfig: {
		isDrawe?: boolean;
		primary?: string;
		topBar?: string;
		topBarColor?: string;
		isTopBarColorGradual?: boolean;
		menuBar?: string;
		menuBarColor?: string;
		menuBarActiveColor?: string;
		isMenuBarColorGradual?: boolean;
		columnsMenuBar?: string;
		columnsMenuBarColor?: string;
		isColumnsMenuBarColorGradual?: boolean;
		isColumnsMenuHoverPreload?: boolean;
		isCollapse?: boolean;
		isUniqueOpened?: boolean;
		isFixedHeader?: boolean;
		isFixedHeaderChange?: boolean;
		isClassicSplitMenu?: boolean;
		isLockScreen?: boolean;
		lockScreenTime?: number;
		isShowLogo?: boolean;
		isShowLogoChange?: boolean;
		isBreadcrumb?: boolean;
		isTagsview?: boolean;
		isBreadcrumbIcon?: boolean;
		isTagsviewIcon?: boolean;
		isCacheTagsView?: boolean;
		isSortableTagsView?: boolean;
		isShareTagsView?: boolean;
		isFooter?: boolean;
		isGrayscale?: boolean;
		isInvert?: boolean;
		isDark?: boolean;
		isWartermark?: boolean;
		wartermarkText?: string;
		tagsStyle?: string;
		animation?: string;
		columnsAsideStyle?: string;
		columnsAsideLayout?: string;
		layout?: string;
		isRequestRoutes?: boolean;
		globalTitle?: string;
		globalViceTitle?: string;
		globalViceTitleMsg?: string;
		globalI18n?: string;
		globalComponentSize?: string;
	};
}
