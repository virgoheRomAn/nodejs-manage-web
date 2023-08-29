/* eslint-disable */
import * as axios from 'axios';

// 扩展 axios 数据返回类型，可自行扩展
declare module 'axios' {
	// 响应请求
	export interface AxiosResponse<T = any> {
		code: number;
		data: T;
		message: string;
		type?: string;
		[key: string]: T;
	}

	// 返回数据结果格式
	export interface AxiosResult<T = any> {
		code: number | string;
		data: T;
		success: boolean;
		message: string;
		type: 'warn' | 'success' | 'info' = 'info';
	}

	// 前端 Ajax 请求
	export type AxiosAjaxRequest = (params: EmptyObjectType, type: boolean, errorTips: boolean) => any;
}
