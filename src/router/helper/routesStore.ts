import { formatFlatteningRoutes, formatTwoStageRoutes } from './routesFormat';
import pinia from '/@/stores/index';
import { useRoutesList } from '/@/stores/modules/routesList';
import { useTagsViewRoutes } from '/@/stores/modules/tagsViewRoutes';

/**
 * @description 根据权限生成一级菜单
 * @param permission 权限列表
 */
export async function createFirstMenu(permission: Array<any>) {
	const storesRoutesList = useRoutesList(pinia);
	const firstMenu: Array<any> = [];
	for (let item of permission) {
		if (item.parentId === '-1') {
			firstMenu.push({
				id: item.otherInfo,
				code: item.permissionCode,
				path: item.routes[0],
			});
		}
	}
	storesRoutesList.setFirstMenu(firstMenu);
}

/**
 * @description 设置递归过滤有权限的路由到 pinia routesList
 * @description 用于左侧菜单、横向菜单的显示
 * @description 用于 tagsView、菜单搜索中：未过滤隐藏的(isHide)
 */
export async function setFilterMenuAndCacheTagsViewRoutes(routes: Array<any>) {
	const storesRoutesList = useRoutesList(pinia);
	storesRoutesList.setRoutesList(setFilterHasRolesMenu(routes[0].children));
	setCacheTagsViewRoutes(routes);
}

/**
 * @description 缓存多级嵌套数组处理后的一维数组
 * @description 用于 tagsView、菜单搜索中：未过滤隐藏的(isHide)
 */
export function setCacheTagsViewRoutes(routes: Array<any>) {
	const storesTagsView = useTagsViewRoutes(pinia);
	let rolesRoutes = setFilterHasRolesMenu(routes);
	storesTagsView.setTagsViewRoutes(formatTwoStageRoutes(formatFlatteningRoutes(rolesRoutes))[0].children);
}

/**
 * @description 设置递归过滤有权限的路由
 * @param routes 当前路由 children
 */
export function setFilterHasRolesMenu(routes: any) {
	const menu: any = [];
	routes.forEach((route: any) => {
		const item = { ...route };
		if (item.children) item.children = setFilterHasRolesMenu(item.children);
		menu.push(item);
	});
	return menu;
}
