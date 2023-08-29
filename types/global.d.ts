// 声明文件，定义全局变量
/* eslint-disable */
export {};
declare global {
	const __APP_INFO__: {
		pkg: {
			name: string;
			version: string;
			dependencies: Recordable<string>;
			devDependencies: Recordable<string>;
		};
		lastBuildTime: string;
		mode: string;
		env: EmptyObjectType;
		version: string;
		buildTime: string;
	};

	// 挂载在window
	declare interface Window {
		nextLoading: boolean;
		__U__: EmptyObjectType | undefined; // 工具类
		__T__: EmptyObjectType | undefined; // 本地存储
		__S__: EmptyObjectType | undefined; // 会话存储
		__C__: EmptyObjectType | undefined; // 全局变量
		__K__: EmptyObjectType | undefined; // Symbol Key
	}

	// 扩展 Record
	declare type Recordable<T = any> = Record<string, T>;

	// 空
	declare type Nullable<T> = T | null;

	// 空 | undefined
	declare type NonNullable<T> = T extends null | undefined ? never : T;

	// 申明 数组
	declare type EmptyArrayType<T = any> = T[];

	// 申明 对象
	declare type EmptyObjectType<T = any> = {
		[key: string]: T;
	};

	// 申明 函数
	declare type Fn<T = any, R = T> = {
		(...arg: T[]): R;
	};

	// 申明 假值
	declare type FlaseType = string | number | null | undefined;

	// 申明 对象
	declare type EmptyDataType = EmptyArrayType & EmptyObjectType;

	// 定义 vite 配置文件
	declare interface ViteEnv {
		VITE_BASE: string;
		VITE_VIEW_PORT: number;
		VITE_SERVICE_PORT: number;
		VITE_APP_NODE_ENV: string;
		VITE_USE_MOCK: boolean;
		VITE_USE_PWA: boolean;
		VITE_PROXY: [string, string][];
		VITE_APP_TITLE: number;
		VITE_GLOB_APP_TITLE: string;
		VITE_GLOB_APP_SHORT_NAME: string;
		VITE_USE_CDN: boolean;
		VITE_DROP_CONSOLE: boolean;
		VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none';
		VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
		VITE_LEGACY: boolean;
		VITE_USE_IMAGEMIN: boolean;
		VITE_GENERATE_UI: string;
		VITE_DROP_CONSOLE: boolean;
		VITE_GT_CAPTCHA: string;
	}

	// 声明 ref
	declare type RefType<T = any> = T | null;

	// 声明 HTMLElement
	declare type HtmlType = HTMLElement | string | undefined | null;

	// 申明 children 可选
	declare type ChilType<T = any> = {
		children?: T[];
	};

	// 申明 select option
	declare type SelectOptionType = {
		value: string | number;
		label: string | number;
		code: string | number;
		text: string | number;
	};

	// 鼠标滚轮滚动类型
	declare interface WheelEventType extends WheelEvent {
		wheelDelta: number;
	}

	// table 数据格式公共类型
	declare interface TableType<T = any> {
		total: number;
		loading: boolean;
		param: {
			pageNum: number;
			pageSize: number;
			[key: string]: T;
		};
	}

	// 请求数据返回的类型
	declare interface ResponesResult<T = any> {
		code: number | string;
		data: T;
		errorMsg?: string;
		message: string;
		success?: boolean;
		isWarn?: boolean;
		total?: number;
		type?: 'warn' | 'success' | 'info' = 'info';
	}
}
