import req from '/@/plugins/request';

/**
 * @description 设置当前选择的系统
 * @returns
 */
export const setActiveSystemCode = (params: object = {}, type?: boolean, isTips?: boolean): any => {
	let url = `/common/setActiveSystemCode`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 查询工作流图片
 * @returns
 */
export const getProcessInstancesDiagram = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/common/getProcessInstancesDiagram`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 获取自定义表单
 * @returns
 */
export const queryFormConfig = (params: object = {}, type?: boolean, isTips?: boolean): any => {
	let url = `/common/queryFormConfig`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 获取的审批记录
 * @returns
 */
export const queryAuditRecord = (params: object = {}, type?: boolean, isTips?: boolean): any => {
	let url = `/common/queryAuditRecord`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 分页查询还款记录明细
 * @returns
 */
export const queryRepayRecord = (params: object = {}, type?: boolean, isTips?: boolean): any => {
	let url = `/common/xd/queryRepayRecord`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 线下登账记录分页查询
 * @returns
 */
export const queryOfflineRepayRecord = (params: object = {}, type?: boolean, isTips?: boolean): any => {
	let url = `/common/xd/queryOfflineRepayRecord`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 债转任务详情
 * @returns
 */
export const debtTransferTdDetail = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/common/xd/debtTransferTdDetail`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 债转文件解析验证（合通业务）
 * @returns
 */
export const debtTransferTdParse = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/common/xd/debtTransferTdParse`;
	return req.post({ url, params, type, isTips, text: '文件解析中...' });
};

/**
 * @description 查询金融产品
 * @returns
 */
export const queryJrProduct = (params: object = {}, type?: boolean, isTips?: boolean): any => {
	let url = `/common/jr/queryProduct`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 查询金融渠道
 * @returns
 */
export const queryJrChannel = (params: object = {}, type?: boolean, isTips?: boolean): any => {
	let url = `/common/jr/queryChannel`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 查询金融还款计划
 * @returns
 */
export const queryRepaymentPlanList = (params: object = {}, type?: boolean, isTips?: boolean): any => {
	let url = `/common/jr/queryRepaymentPlanList`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 查询操作员
 * @returns
 */
export const queryUserByPage = (params: object = {}, type?: boolean, isTips?: boolean): any => {
	let url = `/common/jf/queryUserByPage`;
	return req.post({ url, params, type, isTips });
};
