<template>
	<LayoutContainer>
		<div class="welcome-bar">
			<h2>{{ `${userInfo.name} ${currentTime}` }}</h2>
			<p>{{ title }}</p>
			<label>{{ `当前版本：${version}` }}</label>
			<label>{{ `构建时间：${buildTime}` }}</label>
		</div>
	</LayoutContainer>
</template>

<script setup lang="ts" name="jfmanageIndex">
import { useUserInfo } from '/@/stores/modules/userInfo';
import { U } from '/@/utils';

const props = defineProps({
	title: { type: String, default: '欢迎使用金服BOSS 管理系统' }
});

const { buildTime, version, env } = __APP_INFO__;
const { VITE_APP_NODE_ENV } = env;
const stores = useUserInfo();
const { userInfo } = storeToRefs(stores);

// 时间获取
const currentTime = computed(() => U.formatAxis(new Date()));
</script>
<style lang="scss" scoped>
.welcome-bar {
	position: relative;
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 20px 40px;
	background: var(--el-color-white);

	> h2,
	p,
	label {
		display: block;
		margin: 15px 0;
		color: var(--el-text-color-primary);
	}
}
</style>
