/**
 * @description 获取目录下的 .vue、.tsx 全部文件
 * @method import.meta.glob
 */
const layouModules: any = import.meta.glob('../../layout/routerView/*.{vue,tsx}');
const viewsModules: any = import.meta.glob('../../views/**/*.{vue,tsx}');
const dynamicViewsModules: Record<string, Function> = { ...layouModules, ...viewsModules };

/**
 * @description 异步加载路由 component
 * @param routes 拼接的路由树
 * @returns 返回处理成函数后的 component
 */
export function asyncImportRoute(routes: any) {
	if (!routes) return;
	return routes.map((item: any) => {
		// 过略掉已经被赋值的路由，防止重复赋值导致模板加载失败
		if (item.component && typeof item.component === 'string') item.component = dynamicImport(dynamicViewsModules, item.component as string);
		item.children && asyncImportRoute(item.children);
		return item;
	});
}

/**
 * @description 后端路由 component 转换函数
 * @param dynamicViewsModules 获取目录下的 .vue、.tsx 全部文件
 * @param component 当前要处理项 component
 * @returns 返回处理成函数后的 component
 */
export function dynamicImport(dynamicViewsModules: Record<string, Function>, component: string) {
	const keys = Object.keys(dynamicViewsModules);
	const matchKeys = keys.filter((key) => {
		const k = key.replace(/..\/..\/views|..\/../, '');
		if (typeof component === 'string') {
			const startFlag = component.startsWith('/');
			const endFlag = component.endsWith('.vue') || component.endsWith('.tsx');
			const startIndex = startFlag ? 0 : 1;
			const lastIndex = endFlag ? k.length : k.lastIndexOf('.');
			return k.substring(startIndex, lastIndex) === component;
		} else {
			return false;
		}
	});

	if (matchKeys?.length === 1) {
		const matchKey = matchKeys[0];
		return dynamicViewsModules[matchKey];
	}
	if (matchKeys?.length > 1) {
		return false;
	}
}
