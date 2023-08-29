import req from '/@/plugins/request';

/**
 * @description 在贷明细查询
 * @returns
 */
export const queryOnloanProgressReport = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/xdboss/report/onloan/search/queryOnloanProgressReport`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 查询小贷放款报表
 * @returns
 */
export const queryLoansReport = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/xdboss/report/loans/search/queryLoansReport`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 分页查询小贷溢缴款报表
 * @returns
 */
export const queryOverpaymentReport = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/xdboss/report/overpayment/search/queryOverpaymentReport`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 查询小贷结算明细报表
 * @returns
 */
export const querySettleDetailReport = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/xdboss/report/settlement/search/querySettleDetailReport`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 查询小贷回款明细报表
 * @returns
 */
export const queryRepaymentReport = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/xdboss/report/payment/search/queryRepaymentReport`;
	return req.post({ url, params, type, isTips });
};
