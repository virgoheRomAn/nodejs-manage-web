import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import qs from 'qs';
import router from '/@/router';
import { TokenKey, PermissionKey, UserKey } from '/@/dicts/symbol';
import { jBox } from '/@/plugins/jBox';
import { storage } from '/@/plugins/storage';
import { err } from './error';

/**
 * @description 网络 ajax 请求
 * @author virgoheRomAn
 * @date 2023-03-02
 */

// 配置新建一个 axios 实例
const service: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASEURL,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json' }
});

/**
 * @description axios请求拦截器
 */
service.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		// 获取 CSRF
		const CSRF = Cookies.get('csrfToken');
		config.headers['x-csrf-token'] = CSRF;

		// 文件上传
		if (config.headers['type'] && config.headers['type'] === 'qiniu') {
			config.headers['Content-Type'] = 'multipart/form-data';
		}

		// 规范写法 不可随意自定义
		const token = storage.getItem(TokenKey);
		if (token) config.headers['Authorization'] = `Bearer ${token}`;

		if (config.data && config.headers['Content-Type'] === 'application/x-www-form-urlencoded;charset=UTF-8') {
			config.data = qs.stringify(config.data);
		}

		return config;
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	}
);

/**
 * @description axios响应拦截器
 */
service.interceptors.response.use(
	(response: AxiosResponse) => {
		// 数据处理
		const rs = response.data;

		// 七牛单独处理
		if (response.config.headers['type'] && response.config.headers['type'] === 'qiniu') {
			rs.code = 'SUCCESS';
		}

		// 响应 code
		const { code } = rs;

		// 单独处理几种错误
		if (!code || ['ETIMEDOUT', 'SYSTEM_ERROR', 'AUTHOR_ERROR'].includes(code)) {
			if (code === 'AUTHOR_ERROR') {
				storage.remove(TokenKey);
				storage.remove(UserKey);
				storage.remove(PermissionKey);

				window.location.replace('/login');

				return Promise.reject(new Error(rs.message));
			} else {
				rs.errorMsg = '系统升级，请联系后台人员处理';

				return rs;
			}
		} else {
			return rs;
		}
	},
	(error: AxiosError) => {
		const message = '网络连接超时，请确保手机信号良好';

		if (error.message.includes('timeout')) {
			error.message = message;
		}

		if (error?.response) {
			error.message = message;
		}

		return Promise.reject(err.errorCreate(error.message, error));
	}
);

export default service;
