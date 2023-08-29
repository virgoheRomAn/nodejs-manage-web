import { defineStore } from 'pinia';
import { theme } from '/@/config/app';

/**
 * @description 主题配置
 */
export const useThemeConfig = defineStore('themeConfig', {
	state: (): ThemeConfigState => ({
		themeConfig: {
			/**
			 * 全局主题
			 */
			// 是否开启深色模式
			isDark: false,

			/**
			 * 界面设置
			 */
			// 是否开启菜单水平折叠效果
			isCollapse: false,
			// 是否开启菜单手风琴效果
			isUniqueOpened: false,
			// 是否开启固定 Header
			isFixedHeader: true,
			// 初始化变量，用于更新菜单 el-scrollbar 的高度，请勿删除
			isFixedHeaderChange: false,
			// 是否开启经典布局分割菜单（仅经典布局生效）
			isClassicSplitMenu: false,

			/**
			 * 界面显示
			 */
			// 是否开启侧边栏 Logo
			isShowLogo: false,
			// 是否开启 Footer 底部版权信息
			isFooter: false,
			// 初始化变量，用于 el-scrollbar 的高度更新，请勿删除
			isShowLogoChange: false,
			// 是否开启 Breadcrumb，强制经典、横向布局不显示
			isBreadcrumb: true,
			// 是否开启 Breadcrumb 图标
			isBreadcrumbIcon: false,
			// 是否开启 Tagsview
			isTagsview: true,
			// 是否开启 Tagsview 图标
			isTagsviewIcon: false,
			// 是否开启 TagsView 缓存
			isCacheTagsView: false,
			// 是否开启 TagsView 拖拽
			isSortableTagsView: true,
			// 是否开启 TagsView 共用
			isShareTagsView: false,
			// 是否开启灰色模式
			isGrayscale: false,
			// 是否开启色弱模式
			isInvert: false,

			/**
			 * 其它设置
			 */
			// Tagsview 风格：可选值"<tags-style-one|tags-style-four|tags-style-five>"，默认 tags-style-five
			tagsStyle: 'tags-style-five',
			// 主页面切换动画：可选值"<slide-right|slide-left|opacitys>"，默认 slide-right
			animation: 'slide-right',

			/**
			 * 全局网站标题 / 副标题
			 */
			// 网站主标题（菜单导航、浏览器当前网页标题）
			globalTitle: import.meta.env.VITE_APP_TITLE,
			// 默认初始语言，可选值"<zh-cn|en|zh-tw>"，默认 zh-cn
			globalI18n: 'zh-cn'
		}
	}),

	actions: {
		setThemeConfig(data: ThemeConfigState) {
			this.themeConfig = { ...data.themeConfig, ...theme };
		}
	}
});
