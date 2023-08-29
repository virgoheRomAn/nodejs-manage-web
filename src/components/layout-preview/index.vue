<template>
	<Teleport to="body" v-bind="$attrs">
		<div class="preview-box">
			<el-image-viewer v-if="showImageViewer" :infinite="false" :initial-index="initialIndex" :url-list="preview.srcList" @close="close" />
		</div>
	</Teleport>
</template>
<script setup lang="ts" name="vhmLayoutDialog">
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';

const props = defineProps({
	// 预览属性
	preview: {
		type: Object as PropType<{ srcList: Array<any>; index: number }>,
		default: () => ({ srcList: [], index: 0 })
	}
});
const emit = defineEmits(['open', 'close']);

const showImageViewer = ref(false);
const initialIndex = ref(0);

const open = (index: number = 0) => {
	initialIndex.value = index;
	showImageViewer.value = true;
	emit('open');
};

const close = () => {
	showImageViewer.value = false;
	emit('close');
};

defineExpose({ open, close });
</script>
<style lang="scss" scoped>
.preview-box {
	position: relative;

	:deep(.el-image-viewer__mask) {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background: var(--next-color-white);
		opacity: 1;
	}

	:deep(.el-image-viewer__canvas) {
		width: 90%;
		height: 90%;
		margin: auto;
	}
}
</style>
