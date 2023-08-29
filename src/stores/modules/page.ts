import { defineStore } from 'pinia';
import { PageKey } from '/@/dicts/symbol';
import { storage } from '/@/plugins/storage';

/**
 * @description 页面相关功能设置
 */
export const usePageSetting = defineStore('pageSetting', {
	state: () => ({
		// 整个表格是否固定 [弃用]
		tableFixed: storage.getItem(PageKey) ? storage.getItem(PageKey).isTableFixed : true,
		// 每个页面的表格固定读取
		pageTableFixed: true,
		// 每个页面的搜索展开读取
		pageSearchCollapse: false
	}),

	getters: {
		isTableFixed(): boolean {
			return this.tableFixed !== undefined ? this.tableFixed : storage.getItem(PageKey) ? storage.getItem(PageKey).isTableFixed : true;
		}
	},

	actions: {
		// 设置是否固定表格滚动
		async setOverflowByTable(fixed: boolean) {
			this.tableFixed = fixed;

			// 设置到本地存储
			storage.setItem(PageKey, { isTableFixed: fixed });
		},

		// 设置某个页面是否固定表格滚动
		async setPageTableFixed(fixed: boolean, pagename: string) {
			this.pageTableFixed = fixed;

			// 设置到本地存储
			const page = storage.getItem(PageKey) || { [pagename]: {} };

			if (page[pagename]) {
				page[pagename]['isTableFixed'] = fixed;
			} else {
				page[pagename] = {};
				page[pagename]['isTableFixed'] = fixed;
			}

			storage.setItem(PageKey, page);
		},

		// 获取某个页面固定表格滚动状态
		async getPageTableFixed(pagename: string, isPageTableFixed: boolean = true) {
			const page = storage.getItem(PageKey);
			const isFixed = page ? (page[pagename] ? page[pagename].isTableFixed ?? true : !!isPageTableFixed) : !!isPageTableFixed;
			this.pageTableFixed = isFixed;

			return isFixed;
		},

		// 设置某个页面是否展开搜索框
		async setPageSearchCollapse(collapse: boolean, pagename: string) {
			this.pageSearchCollapse = collapse;

			// 设置到本地存储
			const page = storage.getItem(PageKey) || { [pagename]: {} };

			if (page[pagename]) {
				page[pagename]['isPageSearchCollapse'] = collapse;
			} else {
				page[pagename] = {};
				page[pagename]['isPageSearchCollapse'] = collapse;
			}

			storage.setItem(PageKey, page);
		},

		// 获取某个页面展开搜索框状态
		async getPageSearchCollapse(pagename: string) {
			const page = storage.getItem(PageKey);
			const isCollapse = page ? (page[pagename] ? page[pagename].isPageSearchCollapse : false) : false;
			this.pageSearchCollapse = isCollapse;

			return isCollapse;
		}
	}
});
