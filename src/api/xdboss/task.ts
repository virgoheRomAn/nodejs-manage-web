import req from '/@/plugins/request';

/**
 * @description 待办任务列表
 * @returns
 */
export const queryTodoServiceTasks = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/xdboss/task/todo/search/queryTodoServiceTasks`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 债转审批
 * @returns
 */
export const debtTransferTdApproval = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/xdboss/task/todo/edit/debtTransferTdApproval`;
	return req.post({ url, params, type, isTips, text: '审批中...' });
};

/**
 * @description 办结任务
 * @returns
 */
export const queryFinishedTasks = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/xdboss/task/history/search/queryFinishedTasks`;
	return req.post({ url, params, type, isTips, text: '审批中...' });
};
