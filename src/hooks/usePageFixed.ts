import { usePageSetting } from '/@/stores/modules/page';

/**
 * @description 获取页面是否固定表格滚动
 */
export function isTableFixed(): any {
	const storesPageSetting = usePageSetting();
	const { tableFixed } = storeToRefs(storesPageSetting);

	return tableFixed;
}

/**
 * @description 获取单个页面是否固定表格滚动
 */
export function isPageTableFixed(): any {
	const storesPageSetting = usePageSetting();
	const { pageTableFixed } = storeToRefs(storesPageSetting);

	return ref(pageTableFixed);
}
