import { tryOnMounted, tryOnUnmounted, useDebounceFn } from '@vueuse/core';

interface WindowSizeOptions {
	once?: boolean;
	immediate?: boolean;
	listenerOptions?: AddEventListenerOptions | boolean;
}

/**
 * @description 窗口改变执行函数
 * @param fn 需要执行的函数
 * @param wait 等待事件
 * @param options 参数
 * @returns
 */
export function useWindowSizeFn<T>(fn: Fn<T>, wait = 150, options?: WindowSizeOptions) {
	let handler = () => {
		fn();
	};
	const handleSize = useDebounceFn(handler, wait);
	handler = handleSize;

	const start = () => {
		if (options?.immediate) {
			handler();
		}
		window.addEventListener('resize', handler);
	};

	const stop = () => {
		window.removeEventListener('resize', handler);
	};

	tryOnMounted(() => {
		start();
	});

	tryOnUnmounted(() => {
		stop();
	});
	return [start, stop];
}
