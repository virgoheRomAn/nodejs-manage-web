import req from '/@/plugins/request';

/**
 * @description 业务岗管理人员
 * @returns
 */
export const queryjrBusinessStaffList = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/business/record/search/queryjrBusinessStaffList`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 业务岗管理人员
 * @returns
 */
export const savejrBusinessStaff = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/business/record/edit/savejrBusinessStaff`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 更新业务岗人员状态
 * @returns
 */
export const updatejrBusinessStaff = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jrboss/business/record/edit/updatejrBusinessStaff`;
	return req.post({ url, params, type, isTips });
};
