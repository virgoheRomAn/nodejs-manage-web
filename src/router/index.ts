import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress';
import pinia from '/@/stores/index';
import { storeToRefs } from 'pinia';
import { useRoutesList } from '/@/stores/modules/routesList';
import { staticRoutes, notFoundAndNoPower } from '/@/router/route';
import { initFrontEndControlRoutes } from './control';
import { NextLoading } from '/@/plugins/loading';
import { storage } from '/@/plugins/storage';
import { jBox } from '/@/plugins/jBox';
import { TokenKey } from '/@/dicts/symbol';

// 创建路由模式
export const router = createRouter({
	history: createWebHistory(),
	routes: [...notFoundAndNoPower, ...staticRoutes]
});

// 路由加载前
router.beforeEach(async (to, from, next) => {
	NProgress.configure({ showSpinner: false });
	if (to.meta.title) NProgress.start();

	const storesRoutesList = useRoutesList(pinia);
	const { routesList } = storeToRefs(storesRoutesList);
	const token = storage.getItem(TokenKey);

	if (!token) {
		if (to.path === '/login') {
			next();
			NProgress.done();
		} else {
			next(`/login`);
			storage.clear();
			NProgress.done();
		}
	} else {
		if (to.path === '/login') {
			next('/home');
			NProgress.done();
		} else {
			if (routesList.value.length === 0) {
				await initFrontEndControlRoutes();
				next({ path: to.path, query: to.query });
			} else {
				next();
			}
		}
	}
});

// 路由加载后
router.afterEach(() => {
	NProgress.done();
	NextLoading.done();
	jBox.closeAll();
});

// 导出路由
export default router;
