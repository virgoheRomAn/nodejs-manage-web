import { ComponentInternalInstance, getCurrentInstance } from 'vue';

// 定义自定义类 U 的接口类型
interface UtilsInterface {
	[k: string]: any;
	browser: any;
	count: any;
	verifyExp: any;
	extend: (...args: EmptyArrayType) => any;
	merge: (...args: EmptyArrayType) => any;
	dayjs: () => any;
}

// 定义自定义类 T 的接口类型
interface ToolsInterface {
	[k: string]: any;
	base64: any;
	storage: any;
}

// 定义自定义类 message 的接口类型
interface ElementMessageInterface {
	info: (options: EmptyObjectType) => any;
	error: (options: EmptyObjectType) => any;
	success: (options: EmptyObjectType) => any;
	warning: (options: EmptyObjectType) => any;
	alert: (text: string, title?: string, options?: EmptyObjectType) => any;
	confirm: (text: string, title?: string, options?: EmptyObjectType) => any;
	prompt: (text: string, title?: string, options?: EmptyObjectType) => any;
}

// 定义自定义类 jBox 的接口类型
interface jBoxInterface {
	loading: (text: string, options?: EmptyObjectType) => any;
	info: (text: string, options?: EmptyObjectType) => any;
	waring: (text: string, options?: EmptyObjectType) => any;
	error: (text: string, options?: EmptyObjectType) => any;
	success: (text: string, options?: EmptyObjectType) => any;
	close: (callback?: Fn) => any;
	closeById: (id: string, callback?: Fn) => any;
	closeAll: (callback?: Fn) => any;
	warn: (text: string, title?: string, options?: EmptyObjectType) => any;
	confirm: (text: string, title?: string, options?: EmptyObjectType) => any;
	prompt: (text: string, title?: string, options?: EmptyObjectType) => any;
}

// 使用注入的全局实例
export function useInstance() {
	const { appContext } = getCurrentInstance() as ComponentInternalInstance;
	const proxy = appContext.config.globalProperties;

	const U = proxy.U as UtilsInterface;
	const T = proxy.T as ToolsInterface;
	const jBox = proxy.jBox as jBoxInterface;
	const message = proxy.$message as ElementMessageInterface;
	const messageBox = proxy.$messageBox as ElementMessageInterface;
	const loading = proxy.$loading;

	return { U, T, jBox, message, messageBox, loading };
}
