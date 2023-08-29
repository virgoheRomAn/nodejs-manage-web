'use strict';

const Service = require('egg').Service;
const OrderClient = require('../../client/java-order-biz');
const WorkflowClient = require('../../client/java-workflow-biz');

/**
 * @description 小贷boss - 订单服务
 * @author virgoheRomAn
 * @date 2023-03-09
 */
class XDbossOrderService extends Service {
	/**
	 * @description 查询订单列表
	 * @returns
	 */
	async queryOrderList(params) {
		const { ctx } = this;
		const rs = await OrderClient.queryOrderList(ctx, params);
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
	 * @description 查询订单详情
	 * @argument {String} orderNo 订单号
	 * @returns
	 */
	async queryOrderDetails(params) {
		const { ctx } = this;
		const { orderNo, attachmentType, getSceneInfo } = params;

		// 获取订单详情
		const rs = await OrderClient.queryOrderDetails(ctx, { orderNo });
		const data = rs.data;

		// 银行卡转换成列表形式
		const bankCardList = [];
		const accountFieldList = [
			['laccountNo', 'laccountName', 'laccountMobile', 'laccountBankCode', 'laccountType'],
			['raccountNo', 'raccountName', 'raccountMobile', 'raccountBankCode', 'raccountType']
		];

		accountFieldList.forEach((item, index) => {
			bankCardList.push({ cardType: index === 0 ? '放款卡' : '还款卡' });

			item.forEach((x) => {
				if (index === 0) {
					bankCardList[0][x.replace('l', '')] = data[x];
				}

				if (index === 1) {
					bankCardList[1][x.replace('r', '')] = data[x];
				}
			});
		});

		data.bankCardList = bankCardList;

		// 联系人1 联系人2 组合成数组
		if (data.orderContactInfos.length === 0 && data['contractName1'] && data['contractName2']) {
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

		// 银行卡敏感字段加密
		data.bankCardList.map((item) => {
			for (let key in item) {
				const value = item[key];
				const r = ctx.helper.formatValueByExp(value, key);
				item[key] = r[key];

				if (r[`encrypt_${key}`]) {
					item[`encrypt_${key}`] = r[`encrypt_${key}`];
				}
			}
		});

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

		// 获取订单附件
		if (!!attachmentType && Object.keys(attachmentType).length !== 0) {
			const attachments = await OrderClient.queryOrderAttachment(ctx, { orderNo, type: Object.keys(attachmentType) });
			const attachmentsData = attachments.data;
			const auditAttachment = [];
			rs.data.attachments = attachmentsData;

			attachmentsData.forEach((x) => {
				x.filename = attachmentType[x.type];

				// 审批附件提取出来
				if (x.type === 'AuditAttachment') {
					auditAttachment.push(x);
					rs.data[x.type] = auditAttachment;
				} else {
					rs.data[x.type] = x;
				}
			});
		}

		// 获取场景信息
		if (getSceneInfo) {
			const scene = await OrderClient.queryOrderSceneInfo(ctx, { orderNo });
			const sceneData = scene.data;
			const sceneInfo = (sceneData.data = sceneData.sceneInfo ? JSON.parse(sceneData.sceneInfo) : {});
			rs.data.sceneInfo = sceneData;

			// 将场景信息的值扁平化
			for (let key in sceneInfo) {
				if (key === 'subMerchants') {
					rs.data[key] = sceneInfo[key].value.map((x) => {
						const r = {};
						for (let k in x) {
							r[k] = x[k].value;
						}

						return r;
					});
				} else {
					rs.data[key] = sceneInfo[key].value;
				}
			}
		}

		// 获取审批记录
		const auditRecord = await WorkflowClient.queryAuditRecord(ctx, { orderId: orderNo, pages: { page: 1, size: 10000 } });
		rs.data.auditRecord = auditRecord.data;

		return rs;
	}
}

module.exports = XDbossOrderService;
