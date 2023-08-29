import req from '/@/plugins/request';

/**
 * @description 查询公告列表
 * @returns
 */
export const queryAnnouncementList = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/notice/record/search/queryAnnouncementList`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 保存公告
 * @returns
 */
export const saveAnnouncement = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/notice/record/edit/saveAnnouncement`;
	return req.post({ url, params, type, isTips });
};
