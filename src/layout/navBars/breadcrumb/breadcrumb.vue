<template>
	<div v-if="isShowBreadcrumb" class="layout-navbars-breadcrumb">
		<SvgIcon
			class="layout-navbars-breadcrumb-icon"
			:name="themeConfig.isCollapse ? 'ele-Expand' : 'ele-Fold'"
			:size="16"
			@click="onThemeConfigChange"
		/>

		<el-dropdown :show-timeout="70" :hide-timeout="50" @command="onHandleCommandClick" v-if="firstMenu.length > 0">
			<span class="layout-navbars-breadcrumb-user-link">
				{{ $t(`message.${activeSystemText}`) }}
				<el-icon class="el-icon--right">
					<ele-ArrowDown />
				</el-icon>
			</span>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item v-for="(item, index) in firstMenu" :key="item.code" :command="item">{{ $t(`message.${item.code}`) }}</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>

		<el-breadcrumb class="layout-navbars-breadcrumb-hide">
			<transition-group name="breadcrumb">
				<el-breadcrumb-item v-for="(v, k) in state.breadcrumbList" :key="!v.meta.tagsViewName ? v.meta.title : v.meta.tagsViewName">
					<span v-if="k === state.breadcrumbList.length - 1" class="layout-navbars-breadcrumb-span">
						<SvgIcon :name="v.meta.icon" class="layout-navbars-breadcrumb-iconfont" v-if="themeConfig.isBreadcrumbIcon" />
						<div v-if="!v.meta.tagsViewName">{{ $t(v.meta.title) }}</div>
						<div v-else>{{ v.meta.tagsViewName }}</div>
					</span>
					<a v-else @click.prevent="onBreadcrumbClick(v)">
						<SvgIcon :name="v.meta.icon" class="layout-navbars-breadcrumb-iconfont" v-if="themeConfig.isBreadcrumbIcon" />{{ $t(v.meta.title) }}
					</a>
				</el-breadcrumb-item>
			</transition-group>
		</el-breadcrumb>
	</div>
</template>

<script setup lang="ts" name="layoutBreadcrumb">
import { useRoute, useRouter } from 'vue-router';
import { useThemeConfig } from '/@/stores/modules/themeConfig';
import { useRoutesList } from '/@/stores/modules/routesList';
import { setActiveSystemCode } from '/@/api/common';

// 定义变量内容
const stores = useRoutesList();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { routesList, firstMenu, activeSystemId, activeSystemText } = storeToRefs(stores);
const route = useRoute();
const router = useRouter();
const state = reactive<BreadcrumbState>({
	breadcrumbList: [],
	routeSplit: [],
	routeSplitFirst: '',
	routeSplitIndex: 1,
});

// 动态设置经典、横向布局不显示
const isShowBreadcrumb = computed(() => {
	initRouteSplit(route.path);
	const { layout, isBreadcrumb } = themeConfig.value;
	if (layout === 'classic' || layout === 'transverse') return false;
	else return isBreadcrumb ? true : false;
});

// 刷新
const reload = inject('reload') as Function;

// 页面加载时
onMounted(() => {
	initRouteSplit(route.path);
});

// 路由更新时
onBeforeRouteUpdate((to) => {
	initRouteSplit(to.path);
});

// 面包屑点击时
const onBreadcrumbClick = (v: RouteItem) => {
	const { redirect, path } = v;
	if (redirect) router.push(redirect);
	else router.push(path);
};

// 展开/收起左侧菜单点击
const onThemeConfigChange = () => {
	themeConfig.value.isCollapse = !themeConfig.value.isCollapse;
	storage.set('sysThemeConfig', themeConfig.value);
};

// 处理面包屑数据
const getBreadcrumbList = (arr: RouteItems) => {
	arr.forEach((item: RouteItem) => {
		let tagsViewPath: string = !!item.tagsViewPath ? item.tagsViewPath : item.path;

		state.routeSplit.forEach((v: string, k: number, arrs: string[]) => {
			if (state.routeSplitFirst === tagsViewPath) {
				state.routeSplitFirst += `/${arrs[state.routeSplitIndex]}`;
				state.breadcrumbList.push(item);
				state.routeSplitIndex++;
				if (item.children) getBreadcrumbList(item.children);
			}
		});
	});
};

// 当前路由字符串切割成数组，并删除第一项空内容
const initRouteSplit = (path: string) => {
	if (!themeConfig.value.isBreadcrumb) return false;
	state.breadcrumbList = [];
	state.routeSplit = path.split('/');
	state.routeSplit.shift();
	state.routeSplitFirst = `/${state.routeSplit[0]}`;
	state.routeSplitIndex = 1;
	getBreadcrumbList(routesList.value);
};

// 选择一级菜单
const onHandleCommandClick = async (item: EmptyObjectType) => {
	if (activeSystemId.value === item.id) return false;

	activeSystemText.value = item.code;
	await setActiveSystemCode({ activeSystemText: item.code, activeSystemId: item.id });

	// 刷新页面
	window.location.href = '/home';
};
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb {
	flex: 1;
	height: inherit;
	display: flex;
	align-items: center;
	.layout-navbars-breadcrumb-icon {
		cursor: pointer;
		font-size: 18px;
		color: var(--next-bg-topBarColor);
		height: 100%;
		width: 40px;
		opacity: 0.8;
		margin-right: 5px;
		&:hover {
			opacity: 1;
		}
	}

	:deep(.el-dropdown) {
		margin-right: 20px;

		.el-icon {
			position: relative;
			top: 1px;
		}
	}

	.layout-navbars-breadcrumb-span {
		margin-left: 10px;
		display: flex;
		opacity: 0.7;
		color: var(--next-bg-topBarColor);
	}
	.layout-navbars-breadcrumb-iconfont {
		font-size: 14px;
		margin-right: 5px;
	}
	:deep(.el-breadcrumb__separator) {
		opacity: 0.7;
		color: var(--next-bg-topBarColor);
	}
	:deep(.el-breadcrumb__inner a, .el-breadcrumb__inner.is-link) {
		font-weight: unset !important;
		color: var(--next-bg-topBarColor);
		&:hover {
			color: var(--el-color-primary) !important;
		}
	}
}
</style>
