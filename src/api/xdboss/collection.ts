import req from '/@/plugins/request';

/**
 * @description 查询催收任务列表
 * @returns
 */
export const queryCollectionTasks = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/xdboss/collection/task/search/queryCollectionTasks`;
	return req.post({ url, params, type, isTips });
};
