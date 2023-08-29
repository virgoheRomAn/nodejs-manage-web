'use strict';

const Service = require('egg').Service;
const TYdataClient = require('../client/java-tydata-biz');

/**
 * @description 天阳数据
 * @author virgoheRomAn
 * @date 2023-03-09
 */
class TYdataService extends Service {
	/**
	 * @description 客户管理接口
	 * @param {Object} 参数
	 * @argument {String} customerIdNo 身份证号码
	 * @argument {String} customerMobile 手机号
	 * @argument {String} customerName 客户名称
	 */
	async queryCustomerInfo(params) {
		const { ctx } = this;
		const rs = await TYdataClient.queryCustomerInfo(ctx, params);

		rs.data.forEach((item) => {
			for (let key in item) {
				const value = item[key];
				const r = ctx.helper.formatValueByExp(value, key);
				item[key] = r[key];

				if (r[`encrypt_${key}`]) {
					item[`encrypt_${key}`] = r[`encrypt_${key}`];
				}
			}
		});

		return rs;
	}

	/**
	 * @description 根据zbjUserId查扣款数据
	 * @param {Object} 参数
	 * @argument {String} zbjUserId 猪八戒userId
	 * @argument {String} order 排序 默认desc
	 * @argument {String} orderBy 排序字段 默认create_time
	 */
	async queryDeductions(params) {
		const { ctx } = this;
		return await TYdataClient.queryDeductions(ctx, { ...params, pages: { order: 'desc', orderBy: 'create_time' } });
	}
}

module.exports = TYdataService;
