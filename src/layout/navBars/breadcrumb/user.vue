<template>
	<!-- 中英文切换 -->
	<div class="layout-navbars-breadcrumb-user pr15" :style="{ flex: layoutUserFlexNum }">
		<el-dropdown :show-timeout="70" :hide-timeout="50" trigger="click" @command="onLanguageChange">
			<div class="layout-navbars-breadcrumb-user-icon">
				<i class="iconfont" :class="state.disabledI18n === 'en' ? 'icon-zhongyingwen1' : 'icon-zhongyingwen'" :title="$t('message.user.title1')"></i>
			</div>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item command="zh-cn" :disabled="state.disabledI18n === 'zh-cn'">简体中文</el-dropdown-item>
					<el-dropdown-item command="en" :disabled="state.disabledI18n === 'en'">English</el-dropdown-item>
					<el-dropdown-item command="zh-tw" :disabled="state.disabledI18n === 'zh-tw'">繁體中文</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
		<!-- 消息通知 -->
		<div class="layout-navbars-breadcrumb-user-icon">
			<el-popover placement="bottom" trigger="click" transition="el-zoom-in-top" :width="300" :persistent="false">
				<template #reference>
					<el-badge is-dot>
						<el-icon :title="$t('message.user.title4')">
							<ele-Bell />
						</el-icon>
					</el-badge>
				</template>
				<template #default>
					<Notification />
				</template>
			</el-popover>
		</div>
		<!-- 全屏 -->
		<div class="layout-navbars-breadcrumb-user-icon" @click="onScreenfullClick">
			<i
				class="iconfont"
				:title="state.isScreenfull ? $t('message.user.title6') : $t('message.user.title5')"
				:class="!state.isScreenfull ? 'icon-fullscreen' : 'icon-tuichuquanping'"
			></i>
		</div>
		<!-- 深色模式 -->
		<div class="layout-navbars-breadcrumb-user-icon mr10" @click="onDarkClick">
			<i
				class="fa"
				:title="state.isDark ? $t('message.user.title7') : $t('message.user.title8')"
				:class="state.isDark ? 'fa-moon-o' : 'fa-sun-o'"
			></i>
		</div>
		<!-- 用户中心 -->
		<el-dropdown :show-timeout="70" :hide-timeout="50" @command="onHandleCommandClick">
			<span class="layout-navbars-breadcrumb-user-link">
				{{ !userInfo.name ? '未知用户' : userInfo.name }}
				<el-icon class="el-icon--right">
					<ele-CaretBottom />
				</el-icon>
			</span>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item command="/home">{{ $t('message.user.goHome') }}</el-dropdown-item>
					<el-dropdown-item command="changePassword">{{ $t('message.user.changePassword') }}</el-dropdown-item>
					<el-dropdown-item divided command="refreshPermission">{{ $t('message.user.refreshPermission') }}</el-dropdown-item>
					<el-dropdown-item divided command="logOut">{{ $t('message.user.logOut') }}</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>

	<ChangePassword ref="changePasswordDialogRef" />
</template>

<script setup lang="ts" name="layoutBreadcrumbUser">
import screenfull from 'screenfull';
import { useI18n } from 'vue-i18n';
import { useUserInfo } from '/@/stores/modules/userInfo';
import { useThemeConfig } from '/@/stores/modules/themeConfig';
import { settings, mittBus } from '/@/plugins/settings';
import { jBox } from '/@/plugins/jBox';
import { userLogout, refreshUserPermission } from '/@/api/login';

// 引入组件
const Notification = defineAsyncComponent(() => import('/@/layout/navBars/breadcrumb/notification.vue'));
// 引入组件
const ChangePassword = defineAsyncComponent(() => import('/@/views/login/src/changePassword.vue'));

// 定义变量内容
const { locale, t } = useI18n();
const router = useRouter();
const stores = useUserInfo();
const storesThemeConfig = useThemeConfig();
const { userInfo } = storeToRefs(stores);
const { themeConfig } = storeToRefs(storesThemeConfig);
const state = reactive({
	isDark: themeConfig.value.isDark,
	isScreenfull: false,
	disabledI18n: 'zh-cn'
});
const changePasswordDialogRef = ref<RefType>();

// 设置分割样式
const layoutUserFlexNum = computed(() => {
	let num: string | number = '';
	const { layout, isClassicSplitMenu } = themeConfig.value;
	const layoutArr: string[] = ['defaults', 'columns'];
	if (layoutArr.includes(layout as string) || (layout === 'classic' && !isClassicSplitMenu)) num = '1';
	else num = '';
	return num;
});

// 页面加载时
onMounted(() => {
	// 读取本地语言模式
	if (storage.get('sysThemeConfig')) {
		initI18n('globalI18n', 'disabledI18n');
	}
});

// 全屏点击时
const onScreenfullClick = () => {
	if (!screenfull.isEnabled) {
		ElMessage.warning('暂不不支持全屏');
		return false;
	}
	screenfull.toggle();
	screenfull.on('change', () => {
		if (screenfull.isFullscreen) state.isScreenfull = true;
		else state.isScreenfull = false;
	});
};

// 点击切换深色浅色模式
const onDarkClick = () => {
	themeConfig.value.isDark = !themeConfig.value.isDark;
	storage.set('sysThemeConfig', themeConfig.value);
	state.isDark = themeConfig.value.isDark;
	mittBus.emit('setThemeDark');
};

// 语言切换
const onLanguageChange = (lang: string) => {
	themeConfig.value.globalI18n = lang;
	storage.set('sysThemeConfig', themeConfig.value);
	locale.value = lang;
	settings.setPageTitle();
	initI18n('globalI18n', 'disabledI18n');
	jBox.success('切换成功！');
};

// 用户下拉操作
const onHandleCommandClick = async (path: string) => {
	if (path === 'logOut') {
		ElMessageBox({
			closeOnClickModal: false,
			closeOnPressEscape: false,
			title: t('message.user.logOutTitle'),
			message: t('message.user.logOutMessage'),
			showCancelButton: true,
			confirmButtonText: t('message.user.logOutConfirm'),
			cancelButtonText: t('message.user.logOutCancel'),
			buttonSize: 'default',
			beforeClose: (action, instance, done) => {
				if (action === 'confirm') {
					instance.confirmButtonLoading = true;
					instance.confirmButtonText = t('message.user.logOutExit');
					setTimeout(() => {
						done();
						setTimeout(() => {
							instance.confirmButtonLoading = false;
						}, 300);
					}, 700);
				} else {
					done();
				}
			}
		})
			.then(async () => {
				const rs = await userLogout();

				if (rs.code === 'SUCCESS') {
					storage.clear();
					session.clear();
					window.location.reload();
				}
			})
			.catch(() => {});
	} else if (path === 'changePassword') {
		changePasswordDialogRef.value.openDialog();
	} else if (path === 'refreshPermission') {
		const rs = await refreshUserPermission();

		if (rs.code === 'SUCCESS') {
			stores.setUserPermission(rs.data);
			jBox.success('权限刷新成功！', () => {
				window.location.reload();
			});
		}
	} else {
		router.push(path);
	}
};

// 初始化组件大小/i18n
const initI18n = (value: string = 'zh-cn', attr: string = 'globalI18n') => {
	state[attr] = storage.get('sysThemeConfig')?.[value] ?? value;
};
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-user {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	&-link {
		height: 100%;
		display: flex;
		align-items: center;
		white-space: nowrap;
		&-photo {
			width: 25px;
			height: 25px;
			border-radius: 100%;
		}
	}
	&-icon {
		padding: 0 10px;
		cursor: pointer;
		color: var(--next-bg-topBarColor);
		height: 50px;
		line-height: 50px;
		display: flex;
		align-items: center;
		&:hover {
			background: var(--next-color-user-hover);
			i {
				display: inline-block;
				animation: logoAnimation 0.3s ease-in-out;
			}
		}
	}
	:deep(.el-dropdown) {
		color: var(--next-bg-topBarColor);
	}
	:deep(.el-badge) {
		height: 40px;
		line-height: 40px;
		display: flex;
		align-items: center;
	}
	:deep(.el-badge__content.is-fixed) {
		top: 12px;
	}
}
</style>
