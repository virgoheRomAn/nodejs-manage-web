'use strict';

const Service = require('egg').Service;
const DatabaseClient = require('../client/java-data-base');

/**
 * @description 公共请求 不做拦截
 * @author virgoheRomAn
 * @date 2023-03-09
 */
class CommonService extends Service {
	/**
	 * @description 获取基础信息
	 * @returns
	 */
	async queryDatabaseInfo(params) {
		const { ctx } = this;

		// 获取地址 和 数据字典
		return Promise.all([DatabaseClient.queryAreaInfo(ctx, params), DatabaseClient.queryAllDicts(ctx, params)]).then((data) => {
			const [areaData, dictData] = data;
			const areaList = [];

			areaData.data.province.forEach((item) => {
				areaList.push({
					parentAreaCode: 0,
					value: item.provinceId,
					label: item.provinceName
				});
			});

			areaData.data.city.forEach((item) => {
				areaList.push({
					parentAreaCode: item.provinceId,
					value: item.cityId,
					label: item.cityName
				});
			});

			areaData.data.area.forEach((item) => {
				areaList.push({
					parentAreaCode: item.cityId,
					value: item.areaId,
					label: item.areaName
				});
			});

			return Promise.resolve(ctx.success({ area: areaList, dict: dictData.data }));
		});
	}
}

module.exports = CommonService;
