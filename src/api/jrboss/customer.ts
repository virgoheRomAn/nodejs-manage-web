import req from '/@/plugins/request';

/**
 * @description 获取客户入库列表
 * @returns
 */
export const queryUserApplyList = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/whitetask/record/search/queryUserApplyList`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 获取客户入库详情
 * @returns
 */
export const queryUserApplyDetail = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/whitetask/record/search/queryUserApplyDetail`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 审批客户入库
 * @returns
 */
export const approvalUserApply = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/whitetask/record/edit/approvalUserApply`;
	return req.post({ url, params, type, isTips });
};
