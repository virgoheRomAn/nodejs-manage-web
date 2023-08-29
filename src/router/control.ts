import { RouteRecordRaw } from 'vue-router';
import { router } from '/@/router/index';
import { dynamicRoutes, homeRoutes, notFoundAndNoPower } from '/@/router/route';
import { useRoutesList } from '/@/stores/modules/routesList';
import { NextLoading } from '../plugins/loading';
import { getLoginUserInfo } from '/@/api/login';
import { createRoutesTree, filterRoutesTreeBySystemId } from './helper/routesTree';
import { asyncImportRoute } from './helper/routesComponent';
import { setFilterRouteEnd } from './helper/routesFormat';
import { createFirstMenu, setFilterMenuAndCacheTagsViewRoutes } from './helper/routesStore';

/**
 * @description 初始化方法，防止刷新时路由丢失
 * @method NextLoading 界面 loading 动画开始执行
 * @method createFirstMenu(permission) 创建一级菜单
 * @method createRoutesTree 递归生成树
 * @method asyncImportRoute 动态添加路由模板
 * @method setAddRoute 添加动态路由
 * @method setFilterMenuAndCacheTagsViewRoutes 设置递归过滤有权限的路由到 pinia routesList 中及缓存多级嵌套数组处理后的一维数组
 */
export async function initFrontEndControlRoutes() {
	if (window.nextLoading === undefined) NextLoading.start();

	const rs = await getLoginUserInfo();
	const { activeSystemId, activeSystemText, permission } = rs.data;

	if (permission) {
		// 创建一级菜单
		await createFirstMenu(permission);
	}

	if (!!activeSystemId && permission) {
		// 设置当前系统信息
		await useRoutesList().setActiveSystemInfo(activeSystemId, activeSystemText || 'select');

		// 递归生成树
		const routesTree = await createRoutesTree(permission, '-1', 'parentId', 'id');
		const filterRoutesTree = await filterRoutesTreeBySystemId(routesTree, activeSystemId);
		const routesComponent = await asyncImportRoute(filterRoutesTree);
		dynamicRoutes[0].children = [...homeRoutes, ...routesComponent, ...notFoundAndNoPower];
	}

	await setAddRoute(dynamicRoutes);
	await setFilterMenuAndCacheTagsViewRoutes(dynamicRoutes);
}

/**
 * @description 添加动态路由
 * @method router.addRoute
 */
export async function setAddRoute(routeTrees: Array<any>) {
	const routes = await setFilterRouteEnd(routeTrees);
	routes.forEach((route: RouteRecordRaw) => {
		router.addRoute(route);
	});
}

/**
 * @description 删除/重置路由
 * @method router.removeRoute
 */
export async function resetRoute(routeTrees: Array<any>) {
	const routes = await setFilterRouteEnd(routeTrees);
	routes.forEach((route: RouteRecordRaw) => {
		const routeName: any = route.name;
		router.hasRoute(routeName) && router.removeRoute(routeName);
	});
}
