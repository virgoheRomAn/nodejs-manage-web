import jBox from '../jBox';
import axios from './axios';
import { err } from './error';
import config from '/@/config';

/**
 * @description 页面 ajax 请求
 * @author virgoheRomAn
 * @date 2021-09-01
 */

/**
 * 处理请求返回
 * @param {String} type 结果
 * @param {Object} res 返回内容
 */
export const handleResponse = (type: string = `success`, res: any, loading?: any): Promise<any> => {
	return new Promise((reject, resolve) => {
		if (loading) {
			jBox.closeById(loading, () => {
				jBox[type]((<EmptyObjectType>res).message, type === 'success' ? () => resolve(res) : () => reject(res));
			});
		} else {
			jBox[type]((<EmptyObjectType>res).message, type === 'success' ? () => resolve(res) : () => reject(res));
		}
	});
};

/**
 * 并发ajax请求，一步返回结果
 * @param {Object} list 请求方法数组
 * @param {String} text loading文字
 */
export const parataxisRequest = async (list: EmptyArrayType, text: string = `获取中...`, isLoading: boolean = true): Promise<any> => {
	let loading = isLoading ? jBox.loading(text) : null;

	try {
		let funs = list.map((item) => {
			if (typeof item !== 'function') {
				return item;
			}
			return item();
		});

		await Promise.all(funs)
			.then((data) => {
				jBox.closeById(loading, () => Promise.resolve(data));
			})
			.catch((e) => {
				jBox.closeById(loading, () => Promise.reject(e));
			});
	} catch (err) {
		handleResponse('error', err, loading);
	}
};

/**
 * @description 并发请求数据，分步返回数据
 * @param {Array} list [{fun:Function, callback:Funciton}]
 * @param {Boolean} isResError 是否提示服务器提示错误
 * @param {String} text loading文字
 * @param {Boolean} isLoading 是否启用loading
 */
export const parataxis = async (
	list: Array<any>,
	isResError: boolean = false,
	text: string = `获取中...`,
	isLoading: boolean = true
): Promise<any> => {
	let loading = isLoading ? jBox.loading(text) : null;
	let reuslt: Array<any> = [];
	let hasError: boolean = false;

	try {
		for (let item of list) {
			if (!item.fun) continue;

			let rs = await item.fun;
			reuslt.push(rs);
			item.callback?.call(this, rs);
		}

		if (isLoading) {
			jBox.closeById(loading);
		}

		return Promise.resolve(reuslt);
	} catch (err) {
		if (!hasError) {
			hasError = true;
			isResError && handleResponse('error', err, loading);
		}

		if (!isResError && isLoading) {
			jBox.closeById(loading);
		}

		return Promise.reject(err);
	}
};

const request = () => {
	/**
	 * @description 处理返回数据状态
	 * @param {Object} rs 返回数据
	 * @param {Boolean} isTips 是否显示错误信息
	 */
	const handler = (rs: ResponesResult, isTips: boolean = true) => {
		return new Promise((resolve, reject) => {
			const code: string | number = rs.code;

			if (config.successCode.includes(code)) {
				resolve(rs);
			} else {
				const errorMsg = rs.errorMsg || rs.message;

				if (isTips) {
					const type: string = rs.type || 'info';

					if (type === 'warn') {
						jBox.warn(errorMsg, '错误提示', {
							callback: () => {
								reject(rs);
							}
						});
					} else {
						jBox.error(errorMsg);
						reject(rs);
					}
				} else {
					reject(rs);
				}
			}
		});
	};

	return {
		/**
		 * @description GET请求
		 * @param param
		 * @argument url 请求地址
		 * @argument params 请求参数
		 * @argument config 请求配置
		 * @argument type 是否显示loading动画
		 * @argument isTips 是否提示错误信息（区分多个异步加载）
		 * @argument isCaptureError 是否捕获异常 parataxis 模式请求 如果捕获异常会中断循环
		 * @argument text 加载文字
		 * @returns
		 */
		get: async ({ url, params, type = true, isTips = true, isCaptureError = true, text = '加载中...' }: EmptyObjectType = {}) => {
			try {
				let loading = type ? jBox.loading(text) : null;
				const rs: ResponesResult = await axios.get(url, { params });

				if (loading) {
					jBox.closeById(loading);
				}

				const r = await handler(rs, isTips);
				return Promise.resolve(r);
			} catch (err) {
				return isCaptureError ? Promise.reject(err) : err;
			}
		},

		/**
		 * @description POST请求
		 * @param param
		 * @argument url 请求地址
		 * @argument params 请求参数
		 * @argument config 请求配置
		 * @argument type 是否显示loading动画
		 * @argument isTips 是否提示错误信息（区分多个异步加载）
		 * @argument isCaptureError 是否捕获异常 parataxis 模式请求 如果捕获异常会中断循环
		 * @argument text 加载文字
		 * @returns
		 */
		post: async ({ url, params, config, type = true, isTips = true, isCaptureError = true, text = '加载中...' }: EmptyObjectType = {}) => {
			try {
				let loading = type ? jBox.loading(text) : null;
				const rs: ResponesResult = await axios.post(url, params, config);

				if (loading) {
					jBox.closeById(loading);
				}

				const r = await handler(rs, isTips);
				return Promise.resolve(r);
			} catch (err) {
				return isCaptureError ? Promise.reject(err) : err;
			}
		}
	};
};

export const post = request().post;
export const get = request().get;

export default { parataxis, parataxisRequest, ...request() };
