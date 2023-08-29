'use strict';

/**
 * @description 接口文档地址
 * http://java-permission-infra.bjjk-public-dev/swagger-ui.html
 */

const servename = `http://java-permission-infra.bjjk-public-${process.env.NODE_ENV}`;

/**
 * @description [java-permission-infra]
 * @author virgoheRomAn
 * @date 2021-12-23
 */
module.exports = {

  /**
   * @description 用户登录
   * @param account 用户名
   * @param password 密码
   * @param validateStatus 是否极验校验，默认不需要校验   
   * @param secCode 图形验证码校验数据         
   * @param challenge 图形验证码流水号        
   * @returns
   */
  login: async (ctx, params) => {
    const action = servename + `/user/login`;
    return ctx.clientPost(action, params);
  },

  /**
   * @description 修改密码
   * @param id 用户Id
   * @param oldPassword 原密码        
   * @param newPassword 新密码        
   * @returns
   */
  updatePassword: async (ctx, params) => {
    const action = servename + `/user/updatePwd`;
    return ctx.clientPost(action, params);
  },

  /**
   * @description 查询用户绑定的角色
   * @param userId 用户id     
   * @returns
   */
  queryUserRole: async (ctx, params) => {
    const action = servename + `/user/queryUserRole`;
    return ctx.clientPost(action, params);
  },

  /**
   * @description 获取用户权限
   * @param userId 用户id
   * @param systemId 系统id       
   * @returns
   */
  getPermission: async (ctx, params) => {
    const action = servename + `/user/getPermission`;
    return ctx.clientPost(action, params);
  },

  /**
   * @description 查询所有权限
   * @param systemId 系统id       
   * @returns
   */
  queryPermission: async (ctx, params) => {
    const action = servename + `/permission/queryPermission`;
    return ctx.clientPost(action, params);
  },

  /**
   * @description 新增权限
   * @param id 权限Id       
   * @param parentId 上级权限Id       
   * @param orderNumber 序号       
   * @param systemId 系统标识       
   * @param permissionName 权限名       
   * @param permissionCode 权限code       
   * @param permissionType 权限类型：MENU-菜单，POINT-控制点       
   * @param urls 接口请求拦截 
   * @param icon 图标 
   * @returns
   */
  insertPermission: async (ctx, params) => {
    const action = servename + `/permission/insert`;
    return ctx.clientPost(action, params);
  },

  /**
   * @description 新增路由
   * @param permissionId 权限Id       
   * @param {Array<{path, template, code, name}>} routes 路由列表       
   * @param path 路由路径       
   * @param template 路由对应view模板       
   * @param code 路由code       
   * @param name 路由名称    
   * @param keepAlive 是否缓存     
   * @param hidden 是否隐藏   
   * @returns
   */
  insertRoute: async (ctx, params) => {
    const action = servename + `/route/insert`;
    return ctx.clientPost(action, params);
  },

  /**
   * @description 新增权限
   * @param id 权限Id           
   * @param orderNumber 序号       
   * @param systemId 系统标识       
   * @param permissionName 权限名       
   * @param permissionCode 权限code       
   * @param permissionType 权限类型：MENU-菜单，POINT-控制点       
   * @param urls 接口请求拦截 
   * @param icon 图标 
   * @returns
   */
  updatePermission: async (ctx, params) => {
    const action = servename + `/permission/update`;
    return ctx.clientPost(action, params);
  },

  /**
   * @description 新增路由
   * @param permissionId 权限Id       
   * @param {Array<{path, template, code, name}>} routes 路由列表       
   * @param path 路由路径       
   * @param template 路由对应view模板       
   * @param code 路由code       
   * @param name 路由名称     
   * @param keepAlive 是否缓存     
   * @param hidden 是否隐藏     
   * @returns
   */
  updateRoute: async (ctx, params) => {
    const action = servename + `/route/update`;
    return ctx.clientPost(action, params);
  },

  /**
   * @description 查询角色列表全量
   * @param systemGroup 系统组标识（1：boss系统:2：金服渠道前台:3：金服机构前台:4：金服产品方前台:5：小贷渠道前台）            
   * @returns
   */
  queryRoleList: async (ctx, params) => {
    const action = servename + `/role/list`;
    return ctx.clientPost(action, params);
  },

  /**
   * @description 分页查询角色列表
   * @param systemGroup 系统组标识（1：boss系统:2：金服渠道前台:3：金服机构前台:4：金服产品方前台:5：小贷渠道前台）        
   * @param roleCode 角色编码       
   * @param roleName 角色名称       
   * @returns
   */
  queryRoleByPage: async (ctx, params) => {
    const action = servename + `/role/pageQuery`;
    return ctx.clientPost(action, params);
  },

  /**
   * @description 新增角色
   * @param systemGroup 系统组标识（1：boss系统:2：金服渠道前台:3：金服机构前台:4：金服产品方前台:5：小贷渠道前台）        
   * @param roleCode 角色编码       
   * @param roleName 角色名称       
   * @returns
   */
  insertRole: async (ctx, params) => {
    const action = servename + `/role/insert`;
    return ctx.clientPost(action, params);
  },

  /**
   * @description 修改角色    
   * @param id 角色编码      
   * @param systemGroup 系统组标识（1：boss系统:2：金服渠道前台:3：金服机构前台:4：金服产品方前台:5：小贷渠道前台）        
   * @param roleCode 角色编码       
   * @param roleName 角色名称       
   * @returns
   */
  updateRole: async (ctx, params) => {
    const action = servename + `/role/update`;
    return ctx.clientPost(action, params);
  },

  /**
   * @description 角色绑定权限       
   * @param roleId 角色Id       
   * @param permissionIds 权限Id 列表       
   * @returns
   */
  bindPermissionByRoleId: async (ctx, params) => {
    const action = servename + `/role/bindPermission`;
    return ctx.clientPost(action, params);
  },

  /**
   * @description 查询角色绑定权限       
   * @param id 角色Id         
   * @returns
   */
  queryBindPermissionByRoleId: async (ctx, params) => {
    const action = servename + `/role/queryBindPermission`;
    return ctx.clientPost(action, params);
  },

  /**
   * @description 查询组织机构列表             
   * @returns
   */
  queryOrganizationList: async (ctx, params) => {
    const action = servename + `/organization/list`;
    return ctx.clientPost(action, params);
  },

  /**
   * @description 分页查询用户       
   * @param orgId 组织标识         
   * @param account 账号            
   * @param name 姓名         
   * @returns
   */
  queryUserByPage: async (ctx, params) => {
    const action = servename + `/user/pageQuery`;
    return ctx.clientPost(action, params);
  },

  /**
   * @description 创建用户       
   * @param orgId 组织标识         
   * @param account 账号         
   * @param password 密码         
   * @param name 姓名         
   * @returns
   */
  createUser: async (ctx, params) => {
    const action = servename + `/user/create`;
    return ctx.clientPost(action, params);
  },

  /**
   * @description 修改用户       
   * @param id 用户Id         
   * @param name 姓名         
   * @param status 状态：正常（ENABLE）、禁用（DISABLE）         
   * @param isLocked 是否锁定:0-否，1-是         
   * @returns
   */
  updateUser: async (ctx, params) => {
    const action = servename + `/user/update`;
    return ctx.clientPost(action, params);
  },

  /**
   * @description 修改用户       
   * @param userId 用户Id         
   * @param roleIds 角色id列表                 
   * @returns
   */
  bindUserRole: async (ctx, params) => {
    const action = servename + `/user/bindRole`;
    return ctx.clientPost(action, params);
  },

  /**
   * @description 查询用户绑定的角色       
   * @param userId 用户Id                     
   * @returns
   */
  queryUserRole: async (ctx, params) => {
    const action = servename + `/user/queryUserRole`;
    return ctx.clientPost(action, params);
  },

  /**
   * @description 管理员重置用户密码       
   * @param id 用户Id         
   * @param password 密码                    
   * @returns
   */
  resetUserPassword: async (ctx, params) => {
    const action = servename + `/user/resetPwd`;
    return ctx.clientPost(action, params);
  },
}