import { nextTick, onMounted, onActivated } from 'vue';

/**
 * @description 加载首次请求数据
 */
export function onAjaxInitData(hook: Fn) {
	let mounted: boolean;

	onMounted(() => {
		hook();
		nextTick(() => {
			mounted = true;
		});
	});

	onActivated(() => {
		if (mounted) {
			hook();
		}
	});
}
