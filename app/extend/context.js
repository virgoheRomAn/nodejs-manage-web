'use strict';
const customError = require('../lib/customError');

/**
 * @description 扩展 context
 * @author virgoheRomAn
 * @date 2021-12-19
 */
module.exports = {
	/**
	 * @description 统一处理成功结果返回
	 * @param {Object} data 返回前端的信息
	 * @param {Object} extra 扩展数据
	 * @returns
	 */
	success(data, extra = {}) {
		return { code: 'SUCCESS', success: true, data, message: '请求成功', ...extra };
	},

	/**
	 * @description 统一处理失败结果返回
	 * @param {Object} data 返回前端的信息
	 * @returns
	 */
	failed(data) {
		return { code: data.code, success: false, data, message: data.message || '请求失败' };
	},

	/**
	 * @description 清空session
	 */
	clearSession() {
		this.session = null;
	},

	/**
	 * @description 自定义错误
	 * @param {String} code 错误码
	 * @param {String} message 错误信息
	 * @param {Object} data 错误数据[非必填] 在捕获的 error.options.data
	 * @returns
	 */
	creatError(code, message, data) {
		return new customError(code, message, data);
	},

	/**
	 * @description 统一 POST 请求方式
	 * @param {String} url http请求路径
	 * @param {Object} params 请求参数
	 * @param {Object} config 请求配置
	 * @param {*Object} options 请求方式设置
	 * @returns
	 */
	async clientPost(url, params, config, options) {
		params = { data: params || {} };
		return this.httpClientMethod('POST', url, params, config, options);
	},

	/**
	 * @description 统一 GET 请求方式
	 * @param {String} url http请求路径
	 * @param {Object} params 请求参数
	 * @param {Object} config 请求配置
	 * @param {Object} options 请求方式设置
	 * @returns
	 */
	async clientGet(url, params, config, options) {
		return this.httpClientMethod('GET', url, params, config, options);
	},

	/**
	 * @description 统一 PUT 请求方式
	 * @param {String} url http请求路径
	 * @param {Object} params 请求参数
	 * @param {Object} config 请求配置
	 * @param {*Object} options 请求方式设置
	 * @returns
	 */
	async clientPut(url, params, config, options) {
		params = { data: params || {} };
		return this.httpClientMethod('PUT', url, params, config, options);
	},

	/**
	 * @description http请求方式
	 * @param {String} method 请求类型 [POST GET PUT DELETE]
	 * @param {String} url 请求路径
	 * @param {Object} params 请求参数
	 * @param {Object} config 请求配置 处理特殊接口 比如：工作流系统没有返回码
	 * @param {Object} options 请求配置
	 * @returns
	 */
	async httpClientMethod(method, url, params, config = {}, options) {
		const opts = Object.assign({}, { method, contentType: 'json', dataType: 'json', timeout: 50000 }, options);
		const startTime = Date.now();
		const logger = this.getLogger('httpLogger');
		let rs = {};

		// POST 请求处理分页
		if (method === 'POST' && params.data.pages) {
			params.size = params.data.pages.size || 20;
			params.page = params.data.pages.page || 1;
			params.sort = params.data.pages.sort || '';
			params.order = params.data.pages.order || '';

			delete params.data.pages;
		}

		// 工作流参数特殊处理
		if (config.target === 'wrokflow') {
			// 工作流分页模式
			if (params.data && params.data.paging === 'start') {
				params.data.start = (params.page - 1) * params.size;
				params.data.size = params.data.start + params.size;

				delete params.data.paging;
			}

			// 处理请求数据
			if (method === 'POST' || method === 'PUT') {
				params = params.data;
			}
		}

		// 请求参数日志
		logger.info(`请求后端接口路径：%s，参数信息：%s`, url, JSON.stringify(params));

		// 请求接口
		if (config.streaming) {
			// 数据流模式
			rs = await this.curl(url, { streaming: true });
		} else {
			// 标准请求模式
			rs = await this.curl(url, { ...opts, data: params });
		}

		const data = rs.data;

		// 请求返回日志
		logger.info(`请求后端接口返回信息：%s，耗时：%sms`, JSON.stringify(data), Date.now() - startTime);

		// 处理特殊返回
		if (config.target === 'wrokflow') return rs;

		// 没有 code
		if (!data.code) {
			if (data.errcode) {
				// 微信提示错误 (一般为 code 失效)
				throw this.creatError('BUSINESS_ERROR', '微信授权已过期，请重新进入授权');
			} else if (data.scope) {
				// 微信返回正常数据
				return data;
			} else {
				// 内部系统错误
				throw this.creatError('SYSTEM_ERROR', '系统异常');
			}
		}

		// 处理返回code
		if (data.code === 'SUCCESS') {
			return data;
		} else if (data.code === 'BUSINESS_ERROR') {
			throw this.creatError('BUSINESS_ERROR', data.message);
		} else if (data.code === 'PARAMETER_ERROR') {
			throw this.creatError('PARAMETER_ERROR', data.message);
		} else {
			throw this.creatError('SYSTEM_ERROR', '系统异常');
		}
	}
};
