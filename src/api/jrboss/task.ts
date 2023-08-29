import req from '/@/plugins/request';

/**
 * @description 查询任务详情
 * @returns
 */
export const queryTaskDetails = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/task/details/search/queryTaskDetails`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 任务列表
 * @returns
 */
export const queryTodoTaskList = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/task/todo/search/queryTodoTaskList`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 审批任务
 * @returns
 */
export const approveTask = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/task/todo/edit/approveTask`;
	return req.post({ url, params, type, isTips });
};
