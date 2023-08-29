<template>
	<el-config-provider size="default" :locale="getGlobalI18n">
		<router-view v-if="isRouterAlive" />
		<CloseFull v-if="!themeConfig.isLockScreen" />
	</el-config-provider>
</template>

<script setup lang="ts" name="app">
import { useI18n } from 'vue-i18n';
import { useTagsViewRoutes } from '/@/stores/modules/tagsViewRoutes';
import { useThemeConfig } from '/@/stores/modules/themeConfig';
import { settings, mittBus } from '/@/plugins/settings';
import { session, storage } from '/@/plugins/storage';

// 引入组件
const CloseFull = defineAsyncComponent(() => import('/@/layout/navBars/breadcrumb/closeFull.vue'));

// 定义变量内容
const { messages, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const stores = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const isRouterAlive = ref(true);

// 获取全局 i18n
const getGlobalI18n = computed(() => messages.value[locale.value]);

// 获取布局配置信息
const getThemeConfig = computed(() => themeConfig.value);

// 刷新方法
const reload = () => {
	isRouterAlive.value = false;
	nextTick(() => {
		isRouterAlive.value = true;
	});
};

// 注入刷新方法
provide('reload', reload);

// 监听路由的变化，设置网站标题
watch(
	() => route.path,
	() => {
		settings.setPageTitle();
	},
	{ deep: true }
);

// 加载本地存储
onBeforeMount(() => {
	// 从本地存储中读取主题配置
	const theme = storage.get('sysThemeConfig');
	if (!!theme) {
		storesThemeConfig.setThemeConfig({ themeConfig: theme });
		locale.value = theme.globalI18n;
	}
});

// 页面加载时
onMounted(() => {
	// 获取缓存中的全屏配置
	if (session.get('isTagsViewCurrenFull')) {
		stores.setCurrenFullscreen(session.get('isTagsViewCurrenFull'));
	}

	// 绑定深色模式
	mittBus.on('setThemeDark', onAddDarkChange);

	// 灰色模式
	if (getThemeConfig.value.isGrayscale) onAddFilterChange('grayscale');
	// 色弱模式
	if (getThemeConfig.value.isInvert) onAddFilterChange('invert');
	// 深色模式
	if (getThemeConfig.value.isDark) onAddDarkChange();
});

/**
 * @description 方法结构
 * @method
 */

// 灰色模式/色弱模式
const onAddFilterChange = (attr: string) => {
	if (attr === 'grayscale') {
		if (getThemeConfig.value.isGrayscale) getThemeConfig.value.isInvert = false;
	} else {
		if (getThemeConfig.value.isInvert) getThemeConfig.value.isGrayscale = false;
	}

	const cssAttr =
		attr === 'grayscale' ? `grayscale(${getThemeConfig.value.isGrayscale ? 1 : 0})` : `invert(${getThemeConfig.value.isInvert ? '80%' : '0%'})`;

	(document.body as HTMLBodyElement).setAttribute('style', `filter: ${cssAttr}`);

	setLocalThemeConfig();
};

// 深色模式
const onAddDarkChange = () => {
	const html = document.documentElement as HTMLElement;
	if (getThemeConfig.value.isDark) html.setAttribute('data-theme', 'dark');
	else html.setAttribute('data-theme', '');
};

// 存储布局配置
const setLocalThemeConfig = () => {
	storage.remove('themeConfig');
	storage.set('sysThemeConfig', getThemeConfig.value);
};
</script>
