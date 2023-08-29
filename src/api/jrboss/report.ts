import req from '/@/plugins/request';

/**
 * @description 分页查询金融放款报表
 * @returns
 */
export const queryLoanReport = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/report/loans/search/queryLoanReport`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 全量查询金融汇款明细报表
 * @returns
 */
export const queryRepaymentReport = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/report/repayment/search/queryRepaymentReport`;
	return req.post({ url, params, type, isTips });
};
