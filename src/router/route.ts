import { RouteRecordRaw } from 'vue-router';

/**
 * @description 路由meta对象参数说明
 * meta: {
 * 	title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 * 	isLink：        是否超链接菜单，开启外链条件，`1、isLink: 链接地址不为空 2、isIframe:false`
 * 	isHide：        是否隐藏此路由
 * 	isNotMenuShow:	是否渲染该级路由到菜单上，如果 true 则选择其后代 children
 * 	isPushMenuShow:	是否渲染该级路由到菜单上，如果 true 则展示在菜单上
 * 	isKeepAlive：   是否缓存组件状态
 * 	isAffix：       是否固定在 tagsView 栏上
 * 	isIframe：      是否内嵌窗口，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
 * 	roles：         当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 普通角色：common
 * 	icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

/**
 * @description 定义404、401界面
 * @returns 返回路由菜单数据
 */
export const notFoundAndNoPower = [
	{
		path: '/:path(.*)*',
		name: 'notFound',
		component: () => import('/@/views/error/404.vue'),
		meta: {
			title: 'message.staticRoutes.notFound',
			isHide: true,
		},
	},
	{
		path: '/401',
		name: 'noPower',
		component: () => import('/@/views/error/401.vue'),
		meta: {
			title: 'message.staticRoutes.noPower',
			isHide: true,
		},
	},
];

/**
 * @description 定义静态路由（默认路由）
 * @returns 返回路由菜单数据
 */
export const staticRoutes: Array<RouteRecordRaw> = [
	{
		path: '/login',
		name: 'login',
		component: () => import('../views/login/index.vue'),
		meta: {
			title: '登录',
		},
	},
];

/**
 * @description 首页路由
 * @returns 返回路由菜单数据
 */
export const homeRoutes: Array<RouteRecordRaw> = [
	{
		path: '/home',
		name: `home`,
		component: () => import('/@/views/home.vue'),
		meta: {
			title: 'message.home',
			isHide: false,
			isKeepAlive: true,
			isAffix: true,
			icon: 'iconfont icon-shouye',
		},
	},
];

/**
 * 定义动态路由
 * 前端添加路由，请在顶级节点的 `children 数组` 里添加
 * @description 未开启 isRequestRoutes 为 true 时使用（前端控制路由），开启时第一个顶级 children 的路由将被替换成接口请求回来的路由数据
 * @description 各字段请查看 `/@/views/system/menu/component/addMenu.vue 下的 ruleForm`
 * @returns 返回路由菜单数据
 */
export const dynamicRoutes: Array<any> = [
	{
		path: '/',
		name: '/',
		component: () => import('/@/layout/index.vue'),
		redirect: '/home',
		meta: {
			isKeepAlive: true,
		},
		children: [...homeRoutes],
	},
];
