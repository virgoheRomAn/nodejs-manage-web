'use strict';

/**
 * @description 接口文档地址
 * http://java-tydata-biz.bjjr-dev/swagger-ui.html
 */

const servename = `http://java-tydata-biz.bjjr-${process.env.NODE_ENV}`;

/**
 * @description [java-tydata-biz]
 * @author virgoheRomAn
 * @date 2021-12-23
 */
module.exports = {
	/**
	 * @description 客户管理接口
	 * @param {Object} 参数
	 * @argument {String} customerIdNo 身份证号码
	 * @argument {String} customerMobile 手机号
	 * @argument {String} customerName 客户名称
	 */
	queryCustomerInfo: async (ctx, params) => {
		const action = servename + `/customerInfo/query`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 根据身份证号查天阳的用户信息
	 * @param {Object} 参数
	 * @argument {String} idCardNo 身份证号
	 */
	queryUserInfo: async (ctx, params) => {
		const action = servename + `/menberInfoTanSun/info`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 根据身份证号查天阳逾期借据
	 * @param {Object} 参数
	 * @argument {String} idCardNo 身份证号
	 */
	queryReceiptCalculation: async (ctx, params) => {
		const action = servename + `/loanInfoTanSun/receiptCalculation`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 根据zbjUserId查扣款数据
	 * @param {Object} 参数
	 * @argument {String} zbjUserId 猪八戒userId
	 * @argument {String} order 排序 默认desc
	 * @argument {String} orderBy 排序字段 默认create_time
	 */
	queryDeductions: async (ctx, params) => {
		const action = servename + `/loanInfoTanSun/queryDeductions`;
		return ctx.clientPost(action, params);
	}
};
