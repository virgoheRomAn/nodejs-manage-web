'use strict';

const Service = require('egg').Service;
const UserCenterClient = require('../client/java-usercenter-biz');

/**
 * @description 用户中心
 * @author virgoheRomAn
 * @date 2023-03-09
 */
class UserCenterService extends Service {
	/**
	 * @description 查询客户列表
	 * @param {Object} params
	 * @argument {String} idCardNo 身份证号
	 * @argument {String} mobile 手机号
	 * @argument {String} realName 姓名
	 * @returns
	 */
	async queryUserList(params) {
		const { ctx } = this;
		const rs = await UserCenterClient.queryUserList(ctx, params);
		const data = rs.data;

		data.map((item) => {
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
	 * @description 查询客户信息
	 * @param {Object} params
	 * @argument {String} userId userId
	 * @argument {String} zbjUserId 猪八戒用户ID
	 * @returns
	 */
	async queryUserInfo(params) {
		const { ctx } = this;
		const { userId, productNo, categories } = params;
		let result = {
			userInfo: {},
			bankCard: {},
			attachment: {}
		};

		// 客户详情
		const rs = await UserCenterClient.queryUserInfo(ctx, { userId });
		const data = (result.userInfo = rs.data);

		// 联系人1 联系人2 组合成数组
		if (
			(!data.orderContactInfos || (data.orderContactInfos && data.orderContactInfos.length === 0)) &&
			data['contractName1'] &&
			data['contractName2']
		) {
			data.orderContactInfos = [];
			const contract = [
				['contractName1', 'contractPhone1', 'contractRelType1'],
				['contractName2', 'contractPhone2', 'contractRelType2']
			];

			contract.forEach((item, index) => {
				data.orderContactInfos.push({});

				item.map((x) => {
					const key = x.replace(/[0-9]$/, '');
					data.orderContactInfos[index][key] = !!data[x] ? data[x].toString() : data[x];
				});
			});
		}

		if (data.orderContactInfos) {
			// 联系人敏感字段加密
			data.orderContactInfos.map((item) => {
				for (let key in item) {
					const value = item[key];
					const r = ctx.helper.formatValueByExp(value, key);
					if (key === 'contractRelType') {
						item[key] = !!item[key] ? item[key].toString() : item[key];
					} else {
						item[key] = r[key];
					}

					if (r[`encrypt_${key}`]) {
						item[`encrypt_${key}`] = r[`encrypt_${key}`];
					}
				}
			});
		}

		// 银行卡详细
		const bankCard = await UserCenterClient.queryDefaultPaymentCardInfo(ctx, { userId });
		const isBindPaymentCard = !!bankCard.data;
		result.bankCard = bankCard.data;

		// 获取用户附件信息
		if (!!categories) {
			const attachment = await UserCenterClient.queryCustomerAttachmentInfo(ctx, { userId, productNo, categories });
			const attachmentData = attachment.data;
			if (attachmentData.length === 2) {
				attachmentData.map((x, i) => ({
					...x,
					filepath: x.keyword,
					filename: i === 0 ? '身份证人像面' : '身份证国徽面'
				}));

				result.attachment['idCardFront'] = attachmentData[0];
				result.attachment['idCardBack'] = attachmentData[1];
			}
		}

		result = { ...result.userInfo, ...result.bankCard, ...result.attachment, isBindPaymentCard };

		for (let key in result) {
			const value = result[key];
			const r = ctx.helper.formatValueByExp(value, key);
			result[key] = r[key];

			if (r[`encrypt_${key}`]) {
				result[`encrypt_${key}`] = r[`encrypt_${key}`];
			}
		}

		return ctx.success(result);
	}
}

module.exports = UserCenterService;
