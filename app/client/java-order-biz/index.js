'use strict';

/**
 * @description 接口文档地址
 * http://java-order-biz.bjjr-dev/swagger-ui.html
 */

const servename = `http://java-order-biz.bjjr-${process.env.NODE_ENV}`;

/**
 * @description [java-order-biz]
 * @author virgoheRomAn
 * @date 2023-05-04
 */
module.exports = {
	/**
	 * @description 通用订单查询
	 * @param {Object} params
	 * @argument {String} beginTime 开始时间
	 * @argument {String} endTime 结束时间
	 * @argument {String} channelSign 渠道标识
	 * @argument {String} idCardNo 身份证号
	 * @argument {String} mobile 手机号
	 * @argument {String} orderNo 订单号
	 * @argument {String} orderStatus 订单状态
	 * @argument {String} productNum 产品编码
	 * @argument {String} userId 用户编码
	 * @argument {String} userName 用户姓名
	 * @argument {String} zbjUserId 主站用户编号
	 * @returns
	 */
	queryOrderList: async (ctx, params) => {
		const action = servename + `/order/query/comOrderList`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 通用订单详情查询
	 * @param {Object} params
	 * @argument {String} orderNo 订单号
	 * @argument {String} extOrderNo 外部订单号
	 * @returns
	 */
	queryOrderDetails: async (ctx, params) => {
		const action = servename + `/order/queryOrderDetail`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询订单场景信息
	 * @param {Object} params
	 * @argument {String} orderNo 订单号
	 * @returns
	 */
	queryOrderSceneInfo: async (ctx, params) => {
		const action = servename + `/order/query/scene/info`;
		return ctx.clientPost(action, params);
	},

	/**
	 * @description 查询附件
	 * @param {Object} params
	 * @argument {Array} orderNo 订单号
	 * @argument {Array} type 附件烈性
	 * @argument {Array} extOrderNo 外部订单号
	 * @returns
	 */
	queryOrderAttachment: async (ctx, params) => {
		const action = servename + `/attachment/query`;
		return ctx.clientPost(action, params);
	}
};
