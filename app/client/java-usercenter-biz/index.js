'use strict';

/**
 * @description 接口文档地址
 * http://java-usercenter-biz.bjjr-dev/swagger-ui.html
 */

const servename = `http://java-usercenter-biz.bjjr-${process.env.NODE_ENV}`;

/**
 * @description [java-usercenter-biz]
 * @author virgoheRomAn
 * @date 2021-12-23
 */
module.exports = {
	/**
	 * @description 通过用户身份证号查找用户信息
	 * @param {Object} params
	 * @argument {String} idCardNo 身份证号
	 * @returns
	 */
	queryUserInfoByIDCard: async (ctx, params) => {
		const action = servename + `/user/query/by_id_card_no`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询客户列表
	 * @param {Object} params
	 * @argument {String} idCardNo 身份证号
	 * @argument {String} mobile 手机号
	 * @argument {String} realName 姓名
	 * @returns
	 */
	queryUserList: async (ctx, params) => {
		const action = servename + `/user/queryUserList`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询客户信息
	 * @param {Object} params
	 * @argument {String} userId userId
	 * @argument {String} zbjUserId 猪八戒用户ID
	 * @returns
	 */
	queryUserInfo: async (ctx, params) => {
		const action = servename + `/user/query`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询客户附件信息
	 * @param {Object} params
	 * @argument {String} userId userId
	 * @argument {String} productNo 产品编号
	 * @argument {Array<number>} categories 附件分类
	 * 1身份证人像面图片
	 * 2身份证国徽面图片
	 * 3银行卡正面图片
	 * 4银行卡背面图片
	 * 5征信及信息授权协议
	 * 6委托扣款协议书
	 * 7借款凭据及贷款用途承诺书
	 * 8居间服务协议
	 * 9门楣照片
	 * 10收银台照片
	 * 11街道照片
	 * 12经营场地照片
	 * 13营业执照
	 * @returns
	 */
	queryCustomerAttachmentInfo: async (ctx, params) => {
		const action = servename + `/user/attachment/query`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询默认还款卡信息
	 * @param {Object} params
	 * @returns
	 */
	queryDefaultPaymentCardInfo: async (ctx, params) => {
		const action = servename + `/card/query/payment/card`;
		return ctx.clientPost(action, params);
	}
};
