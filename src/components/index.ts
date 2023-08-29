import { App, defineAsyncComponent } from 'vue';
import * as svg from '@element-plus/icons-vue';
import { createAsyncComponent } from '/@/plugins/component';

/**
 * @description 添加自定义组件
 * @param app
 */
export function setupGlobComponent(app: App) {
	const modules: any = import.meta.glob('../components/**/*.{vue,tsx}');

	if (modules) {
		for (const path in modules) {
			const key = path.match(/(\S+)\/(\S+).vue/) as Array<string>;
			if (key[1].search(/(\/common|\/src)/gi) === -1) {
				const name: string = key![1].replace(/.\//gi, '');
				const file: string = key![2].replace(/.\//gi, '');
				const componentKey = file !== 'index' ? file : name;
				const pascalCaseName = componentKey.indexOf('-')
					? componentKey
							.split('-')
							.map((x) => x.slice(0, 1).toUpperCase() + x.slice(1))
							.join('')
					: componentKey.slice(0, 1).toUpperCase() + componentKey.slice(1);

				app.component(pascalCaseName, defineAsyncComponent(modules[path]));
			}
		}
	}

	// 添加 ele-icon
	const icons = svg as any;
	for (const i in icons) {
		app.component(`ele-${icons[i].name}`, icons[i]);
	}
}
