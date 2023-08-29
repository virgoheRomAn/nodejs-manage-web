'use strict';

/**
 * @description 接口文档地址
 * http://java-report-resource.bjjr-dev/swagger-ui.html
 */

const servename = `http://java-report-resource.bjjr-${process.env.NODE_ENV}`;

/**
 * @description [java-report-resource]
 * @author virgoheRomAn
 * @date 2021-12-23
 */
module.exports = {
	/**
	 * @description 拉取-放款数据
	 * @param {Object} params
	 * @argument {String} pullDate 上报月份
	 * @returns
	 */
	tyFKDataPull: async (ctx, params) => {
		const action = servename + `/jrbData/tyFKDataPull`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 拉取-还款数据
	 * @param {Object} params
	 * @argument {String} pullDate 上报月份
	 * @returns
	 */
	tyHKDataPull: async (ctx, params) => {
		const action = servename + `/jrbData/tyHKDataPull`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 拉取-还款计划数据
	 * @param {Object} params
	 * @argument {String} pullDate 上报月份
	 * @returns
	 */
	tyHKJHDataPull: async (ctx, params) => {
		const action = servename + `/jrbData/tyHKJHDataPull`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 拉取-合同数据
	 * @param {Object} params
	 * @argument {String} pullDate 上报月份
	 * @returns
	 */
	tyHTDataPull: async (ctx, params) => {
		const action = servename + `/jrbData/tyHTDataPull`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 拉取-网签数据
	 * @param {Object} params
	 * @argument {String} pullDate 上报月份
	 * @returns
	 */
	tyWQDataPull: async (ctx, params) => {
		const action = servename + `/jrbData/tyWQDataPull`;
		return ctx.clientPost(action, params);
	}
};
