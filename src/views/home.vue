<template>
	<div class="vhm-layout-container">
		<Welcome />
	</div>
</template>

<script setup lang="ts" name="jrBoss.home">
// 引入组件
const Welcome = defineAsyncComponent(() => import('./common/welcome.vue'));
</script>
