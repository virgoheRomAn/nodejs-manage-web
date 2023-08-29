import { defineStore } from 'pinia';
import { DictKey, AreaKey, AreaSourceKey } from '/@/dicts/symbol';
import { storage } from '/@/plugins/storage';
import { global } from '/@/utils/global';

/**
 * @description 基础数据
 */
export const useDatabase = defineStore('database', {
	state: (): DatabaseState => ({
		area: storage.getItem(AreaKey) ?? [],
		areaSource: storage.getItem(AreaSourceKey) ?? [],
		dict: storage.getItem(DictKey) ?? { dicts: [], fields: [] }
	}),

	getters: {
		areaList(): EmptyArrayType {
			return this.area || storage.getItem(AreaKey) || [];
		},

		dictList(): EmptyObjectType {
			return this.dict || storage.getItem(DictKey) || {};
		}
	},

	actions: {
		// 存储 城市信息
		async setArea(area: EmptyArrayType) {
			this.areaSource = area;

			// 遍历出需要的城市树形结构
			const tree = global.createTreeData(area, 0, 'parentAreaCode', 'value');

			// 设置到本地存储
			storage.setItem(AreaSourceKey, area);
			storage.setItem(AreaKey, tree);
		},

		// 存储 数据字典
		async setDict(dict: DictIterface) {
			this.dict = dict;

			// 设置到本地存储
			storage.setItem(DictKey, dict);
		}
	}
});
