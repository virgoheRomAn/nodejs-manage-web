'use strict';

const Service = require('egg').Service;
const JRorderClient = require('../../client/java-jrorder-biz');

/**
 * @description 金融boss - 订单服务
 * @author virgoheRomAn
 * @date 2023-03-09
 */
class JRbossReportService extends Service {
	/**
	 * @description 分页查询金融放款报表
	 * @param {Object} params
	 * @argument {String} channelSimpleName 来源渠道，模糊匹配
	 * @argument {String} startTime 还款时间（当日0点）
	 * @argument {String} endTime 还款时间（当日24点）
	 * @argument {String} loanNo 借据编号，精准匹配
	 * @argument {String} productId 产品编号，精准匹配
	 * @argument {String} username 客户名称，模糊匹配
	 * @argument {String} overdueLevels 逾期等级（数组），精准匹配
	 * @argument {String} repayStatus 还款中状态: 1、还款中（包括还款中借据和逾期借据）；2、结清
	 * @argument {String} page 页码，从1开始
	 * @argument {String} size 每页大小
	 * @returns
	 */
	async queryLoanReport(params) {
		const { ctx } = this;
		const { NP } = ctx.helper;
		const { pages } = params;

		const rs = await JRorderClient.queryLoanReport(ctx, params);

		if (rs.data && rs.data.length > 0) {
			// 处理放款报表当前页合计值
			let summation = {
				loanNo: '合计',
				loanAmount: 0,
				totalRepaidAmt: 0,
				repaidPrincipal: 0,
				repaidInterest: 0,
				repaidPenalty: 0,
				repaidFee: 0,
				repaidServiceFee: 0,
				remainRepayAmt: 0
			};

			for (let value of rs.data) {
				// 利率添加%符号
				value['rate'] = value['rate'] + '%';

				for (let key in summation) {
					if (key !== 'loanNo') {
						summation[key] = NP.plus(summation[key], value[key]);
					}
				}
			}

			rs.data.push(summation);

			// 数据条数大于等于 1000, 最后一行加上固定文案
			if (rs.data.length >= 1000) {
				rs.data.push({ [Object.keys(summation)[0]]: `注：数据未显示完全，一次性最多导出 ${pages.size} 条数据` });
			}
		}

		return rs;
	}

	/**
	 * @description 全量查询金融汇款明细报表
	 * @param {Object} params
	 * @argument {String} channelSimpleName 来源渠道，模糊匹配
	 * @argument {String} startTime 还款时间（当日0点）
	 * @argument {String} endTime 还款时间（当日24点）
	 * @argument {String} loanNo 借据编号，精准匹配
	 * @argument {String} productId 产品编号，精准匹配
	 * @argument {String} username 客户名称，模糊匹配
	 * @returns
	 */
	async queryRepaymentReport(params) {
		const { ctx } = this;
		const { NP } = ctx.helper;
		const { pages, isExport } = params;

		const rs = await JRorderClient.queryRepaymentReport(ctx, params);

		if (rs.data && rs.data.length > 0) {
			// 处理回款报表当前页合计值
			let summation = {
				loanNo: '合计',
				repaidAmt: 0,
				repaidPrincipal: 0,
				repaidInterest: 0,
				repaidPenalty: 0,
				repaidFee: 0,
				repaidServiceFee: 0
			};

			for (let value of rs.data) {
				for (let key in summation) {
					if (key !== 'loanNo') {
						summation[key] = NP.plus(summation[key], value[key]);
					}
				}
			}

			rs.data.push(summation);

			// 数据条数大于等于 1000, 最后一行加上固定文案
			if (rs.data.length >= 1000 && isExport) {
				rs.data.push({ [Object.keys(summation)[0]]: `注：数据未显示完全，一次性最多导出 ${pages.size} 条数据` });
			}
		}

		return rs;
	}
}

module.exports = JRbossReportService;
