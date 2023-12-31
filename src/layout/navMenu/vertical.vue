<template>
	<el-menu
		router
		:default-active="state.defaultActive"
		background-color="transparent"
		:collapse="state.isCollapse"
		:unique-opened="getThemeConfig.isUniqueOpened"
		:collapse-transition="false"
	>
		<template v-for="val in menuLists">
			<el-sub-menu :index="val.path" v-if="val.children && val.children.length > 0" :key="val.path">
				<template #title>
					<SvgIcon :name="val.meta.icon" />
					<span>{{ $t(val.meta.title) }}</span>
				</template>
				<SubItem :chil="val.children" />
			</el-sub-menu>
			<template v-else>
				<el-menu-item :index="val.path" :key="val.path">
					<SvgIcon :name="val.meta.icon" />
					<template #title v-if="!val.meta.isLink || (val.meta.isLink && val.meta.isIframe)">
						<span>{{ $t(val.meta.title) }}</span>
					</template>
					<template #title v-else>
						<a class="w100" @click.prevent="onALinkClick(val)">{{ $t(val.meta.title) }}</a>
					</template>
				</el-menu-item>
			</template>
		</template>
	</el-menu>
</template>

<script setup lang="ts" name="navMenuVertical">
import { defineAsyncComponent, reactive, computed, onMounted, watch } from 'vue';
import { useRoute, onBeforeRouteUpdate, RouteRecordRaw } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/modules/themeConfig';
import { settings } from '/@/plugins/settings';

// 定义父组件传过来的值
const props = defineProps({
	// 菜单列表
	menuList: {
		type: Array<RouteRecordRaw>,
		default: () => []
	}
});

// 引入组件
const SubItem = defineAsyncComponent(() => import('/@/layout/navMenu/subItem.vue'));

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const route = useRoute();
const state = reactive({
	defaultActive: route.meta.isDynamic ? route.meta.isDynamicPath : route.path,
	isCollapse: false
});

// 获取父级菜单数据
const menuLists = computed(() => {
	let nav: Array<RouteItems> = [];
	for (let m of props.menuList as RouteItems) {
		if (!m.meta.isNotMenuShow) nav.push(m);

		if (!!m.meta.isNotMenuShow && !!m.children) {
			m.children.forEach((x: RouteItems) => {
				nav.push(x);
			});
		}
	}

	return nav;
});

// 获取布局配置信息
const getThemeConfig = computed(() => themeConfig.value);

// 设置菜单的收起/展开
watch(
	themeConfig.value,
	() => {
		document.body.clientWidth <= 1000 ? (state.isCollapse = false) : (state.isCollapse = themeConfig.value.isCollapse as boolean);
	},
	{ immediate: true }
);

// 页面加载时
onMounted(() => {
	state.defaultActive = setParentHighlight(route);
});

// 路由更新时
onBeforeRouteUpdate((to) => {
	state.defaultActive = setParentHighlight(to);
	const clientWidth = document.body.clientWidth;
	if (clientWidth < 1000) themeConfig.value.isCollapse = false;
});

/**
 * @description 方法结构
 * @method
 */

// 菜单高亮（详情时，父级高亮）
const setParentHighlight = (currentRoute: RouteToFrom) => {
	const { path, meta, query } = currentRoute;

	// 路由路径带入的参数
	if (query!.navActiveName) {
		return query!.navActiveName;
	}

	// 路由信息中有选中信息
	if (meta!.parentPath) {
		return meta!.parentPath;
	}

	const pathSplit = meta?.isDynamic ? meta.isDynamicPath!.split('/') : path!.split('/');
	if (pathSplit.length >= 4 && meta?.isHide) return pathSplit.splice(0, 4).join('/');
	else return path;
};

// 打开外部链接
const onALinkClick = (val: RouteItem) => {
	settings.handleOpenLink(val);
};
</script>
