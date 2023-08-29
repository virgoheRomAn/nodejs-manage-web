<template>
	<div class="vhm-layout-container">
		<Welcome title="欢迎使用金服-小贷BOSS 管理系统" />
	</div>
</template>

<script setup lang="ts" name="xdbossHome">
// 引入组件
const Welcome = defineAsyncComponent(() => import('../common/welcome.vue'));
</script>
