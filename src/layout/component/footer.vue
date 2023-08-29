<template>
	<div class="layout-footer pb15">
		<div class="layout-footer-warp">
			<span class="mr10">{{ title }} v{{ version }}</span>
			<span> 构建时间：{{ buildTime }}</span>
		</div>
	</div>
</template>

<script setup lang="ts" name="layoutFooter">
// 此处需有内容（注释也得），否则缓存将失败
const { buildTime, version, env } = __APP_INFO__;
const { VITE_APP_TITLE: title } = env;
</script>

<style scoped lang="scss">
.layout-footer {
	width: 100%;
	display: flex;
	&-warp {
		margin: auto;
		color: var(--el-text-color-secondary);
		text-align: center;
		animation: error-num 0.3s ease;
	}
}
</style>
