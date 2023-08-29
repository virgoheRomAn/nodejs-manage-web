<template>
	<div class="vhm-layout-container">
		<Welcome title="欢迎使用金服BOSS 管理系统" />
	</div>
</template>

<script setup lang="ts" name="jfmanageHome">
// 引入组件
const Welcome = defineAsyncComponent(() => import('../common/welcome.vue'));
</script>
