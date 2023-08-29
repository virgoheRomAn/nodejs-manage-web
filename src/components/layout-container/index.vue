<template>
	<div class="vhm-page-wrapper" :class="[wrapperCls, { 'is-fixed': isFixed }]" v-loading="loading">
		<!-- 头部 -->
		<div class="vhm-page-header flex-column" :class="headerCls" v-if="title || intro || getShowHeader">
			<div class="content relative flex-row flex-between" v-if="title || intro">
				<div class="name">
					<label class="title" v-if="title">{{ title }}</label>
					<span class="intro" v-if="intro">{{ intro }}</span>
				</div>

				<div class="slot" v-if="getShowHeaderButton">
					<slot name="headerButton"></slot>
				</div>
			</div>

			<div class="slot" v-if="getShowHeader">
				<slot name="header"></slot>
			</div>
		</div>

		<!-- 中心区域内容 -->
		<div class="vhm-page-content" :class="{ 'overflow-hidden': isFixed }">
			<template v-if="isFixed">
				<div class="h100 overflow" :class="[scrollBarCls]" :id="scrollBarId" ref="scrollBarRef">
					<div class="vhm-page-search" :class="searchCls" v-if="getShowSearch">
						<slot name="search"></slot>
					</div>

					<slot />
				</div>

				<el-backtop :target="scrollBarCls ? `.overflow.h100.${scrollBarCls}` : '.overflow.h100'" v-if="isBacktop" />
			</template>

			<template v-else>
				<div class="vhm-page-search" :class="searchCls" v-if="getShowSearch">
					<slot name="search"></slot>
				</div>

				<slot />
			</template>
		</div>

		<!-- 底部 -->
		<div class="vhm-page-footer" :class="footerCls" v-if="getShowFooter">
			<slot name="footer"></slot>
		</div>
	</div>
</template>

<script setup lang="ts" name="vhmLayoutContainer">
import { Document } from 'postcss';
import { useThemeConfig } from '/@/stores/modules/themeConfig';
import { usePageSetting } from '/@/stores/modules/page';

interface Props {
	title?: string;
	intro?: string;
	isBacktop?: boolean;
	isFixed?: boolean;
	loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	title: '',
	intro: '',
	isBacktop: true,
	isFixed: true,
	loading: false
});

const storesPageSetting = usePageSetting();
const storesThemeConfig = useThemeConfig();
const { tableFixed } = storeToRefs(storesPageSetting);
const { themeConfig } = storeToRefs(storesThemeConfig);
const { isCollapse } = themeConfig.value;

const attrs = useAttrs();
const slots = useSlots();
const isFooterCollapse = ref(false);
const scrollBarRef = ref();

const scrollBarId = computed(() => attrs?.['scrollBarId']);
const scrollBarCls = computed(() => attrs?.['scrollBarCls']);
const wrapperCls = computed(() => attrs?.['wrapperCls']);
const searchCls = computed(() => attrs?.['searchCls']);
const headerCls = computed(() => attrs?.['headerCls']);
const footerCls = computed(() => attrs?.['footerCls'] ?? String(!isFooterCollapse.value ? 'footer-width-220' : 'footer-width-64'));
const getShowHeader = computed(() => !!slots.header);
const getShowFooter = computed(() => !!slots.footer);
const getShowSearch = computed(() => !!slots.search);
const getShowHeaderButton = computed(() => !!slots.headerButton);

const useScrollBar = inject('useScrollBar', {}) as EmptyObjectType;

if (Object.keys(useScrollBar).length > 0) {
	const { setScrollBar } = useScrollBar;
	setScrollBar(!props.isFixed);
}

// 监听路由的变化，设置网站标题
watch(
	themeConfig,
	(val) => {
		isFooterCollapse.value = val.isCollapse ?? false;
	},
	{ deep: true, immediate: true }
);

// 滚动条回到顶部方法
const scrollToTop = (animate: boolean = true) => {
	if (scrollBarRef.value !== null) {
		(scrollBarRef.value as any).scrollTo(animate ? { top: 0, behavior: 'smooth' } : { top: 0 });
	}
};

defineExpose({ scrollToTop });
</script>

<style lang="scss" scoped>
.vhm-page-wrapper {
	position: relative;
	overflow: hidden;

	&.is-fixed {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;

		> .vhm-page-content {
			flex: 1;
			display: block;
			width: 100%;
			height: 100%;
			padding: 0;

			.overflow {
				padding: 20px;

				&.is-table-fixed {
					display: flex;
					flex-direction: column;
				}
			}
		}
	}

	&.fixed-footer {
		padding-bottom: 60px;
		> .vhm-page-footer {
			position: fixed;
			bottom: 0;
			z-index: 10;

			&.footer-width-64 {
				width: calc(100% - 64px);
			}

			&.footer-width-220 {
				width: calc(100% - 220px);
			}
		}
	}

	> .vhm-page-header {
		width: 100%;
		padding: 20px 30px;
		background: var(--next-bg-content-color);
		box-shadow: 0px 2px 4px rgba(0, 21, 41, 0.08);

		.title {
			margin-right: 12px;
			margin-bottom: 0;
			color: var(--el-text-color-primary);
			font-weight: 600;
			font-size: 20px;
			line-height: 32px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		.intro {
			padding-top: 12px;
		}
	}

	> .vhm-page-content {
		position: relative;
		padding: $base-padding + 5;

		.vhm-page-search {
			margin-bottom: $base-margin + 5;
		}
	}

	> .vhm-page-footer {
		position: relative;
		background: var(--next-bg-content-color);
		display: flex;
		align-content: center;
		justify-content: center;
		padding: 15px;
	}
}
</style>
