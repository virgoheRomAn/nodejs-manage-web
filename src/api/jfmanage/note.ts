import req from '/@/plugins/request';

/**
 * @description 查询短信模板
 * @returns
 */
export const querySmsTemplate = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/note/template/search/querySmsTemplate`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 批次查询
 * @returns
 */
export const queryBatchSms = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/note/batch/search/queryBatchSms`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 历史短信查询
 * @returns
 */
export const queryHistorySms = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/note/history/search/queryHistorySms`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 标签模板查询
 * @returns
 */
export const queryTitleTemplateSmsTemplate = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/note/send/search/queryTitleTemplateSmsTemplate`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 发送短信
 * @returns
 */
export const sendBatchSms = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/note/send/edit/sendBatchSms`;
	return req.post({ url, params, type, isTips });
};
