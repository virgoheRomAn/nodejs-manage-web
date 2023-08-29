import { defineStore } from 'pinia';

/**
 * 路由列表
 * @methods setFirstMenu 设置一级目录
 * @methods setRoutesList 设置路由数据
 * @methods setActiveSystemInfo 设置当前选择系统的Id 和 名称
 * @methods setColumnsMenuHover 设置分栏布局菜单鼠标移入 boolean
 * @methods setColumnsNavHover 设置分栏布局最左侧导航鼠标移入 boolean
 */
export const useRoutesList = defineStore('routesList', {
	state: (): RoutesListState => ({
		firstMenu: [],
		routesList: [],
		activeSystemId: '',
		activeSystemText: 'select',
		isColumnsMenuHover: false,
		isColumnsNavHover: false,
	}),

	actions: {
		async setFirstMenu(data: Array<string>) {
			this.firstMenu = data;
		},

		async setRoutesList(data: Array<string>) {
			this.routesList = data;
		},

		async setActiveSystemInfo(id: string, str: string) {
			this.activeSystemId = id;
			this.activeSystemText = str;
		},

		async setColumnsMenuHover(bool: Boolean) {
			this.isColumnsMenuHover = bool;
		},

		async setColumnsNavHover(bool: Boolean) {
			this.isColumnsNavHover = bool;
		},
	},
});
