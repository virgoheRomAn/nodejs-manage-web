import type { App } from 'vue';

/**
 * @description 导出指令方法：v-xxx [文件名既指令名称]
 * @methods wavesDirective 按钮波浪指令，用法：v-waves
 * @methods dragDirective 自定义拖动指令，用法：v-drag
 * @methods copyText 复制文本指令，用法：v-copyText
 * @methods lazyLoading 懒加载图片，用法：v-lazyLoading
 */
export function setupGlobDirectives(app: App) {
	const modules: Record<string, any> = import.meta.glob('./*.ts', { eager: true });

	for (const path in modules) {
		const key = path.match(/(\S+)\/(\S+).ts/);
		app.directive(key![2], modules[path].default);
	}
}
