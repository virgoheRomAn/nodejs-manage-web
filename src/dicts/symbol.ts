// 定义全局使用的 Symbol
const keys: EmptyObjectType = {};

// 登录权限
export const TokenKey = (keys.TokenKey = Symbol('Token'));

// 用户信息
export const UserKey = (keys.UserKey = Symbol('UserInfo'));

// 权限
export const PermissionKey = (keys.PermissionKey = Symbol('Permission'));

// 数据字典
export const DictKey = (keys.DictKey = Symbol('Dicts'));

// 地址原始信息
export const AreaSourceKey = (keys.AreaSourceKey = Symbol('AreaSourceKey'));

// 地址信息
export const AreaKey = (keys.AreaKey = Symbol('Area'));

// 页面设置
export const PageKey = (keys.PageKey = Symbol('Page'));

// 映射到window
window.__K__ = keys;

export default keys;
