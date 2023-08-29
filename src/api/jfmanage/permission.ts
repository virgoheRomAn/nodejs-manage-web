import req from '/@/plugins/request';
/**
 * @description 获取所有权限
 * @returns
 */
export const queryPermission = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/permission/menu/search/queryPermission`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 新增权限
 * @returns
 */
export const insertPermission = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/permission/menu/edit/insertPermission`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 修改权限
 * @returns
 */
export const updatePermission = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/permission/menu/edit/updatePermission`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 查询角色列表全量
 * @returns
 */
export const queryRoleList = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/permission/role/search/queryRoleList`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 分页查询角色列表
 * @returns
 */
export const queryRoleByPage = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/permission/role/search/queryRoleByPage`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 查询角色绑定权限
 * @returns
 */
export const queryBindPermissionByRoleId = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/permission/role/search/queryBindPermissionByRoleId`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 新增角色
 * @returns
 */
export const insertRole = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/permission/role/edit/insertRole`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 修改角色
 * @returns
 */
export const updateRole = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/permission/role/edit/updateRole`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 查询组织机构列表
 * @returns
 */
export const queryOrganizationList = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/permission/operator/search/queryOrganizationList`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 分页查询用户列表
 * @returns
 */
export const queryUserByPage = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/permission/operator/search/queryUserByPage`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 查询用户绑定角色
 * @returns
 */
export const queryUserRole = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/permission/operator/search/queryUserRole`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 新增用户
 * @returns
 */
export const createUser = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/permission/operator/edit/createUser`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 修改用户
 * @returns
 */
export const updateUser = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/permission/operator/edit/updateUser`;
	return req.post({ url, params, type, isTips });
};

/**
 * @description 管理员重置用户密码
 * @returns
 */
export const resetUserPassword = (params: object = {}, type: boolean = true, isTips: boolean = true): any => {
	let url = `/jfmanage/permission/operator/edit/resetUserPassword`;
	return req.post({ url, params, type, isTips });
};
