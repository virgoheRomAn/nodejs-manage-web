'use strict';

/**
 * @description 接口文档地址
 * http://java-data-base.bjjr-dev/swagger-ui.html
 */

const servename = `http://java-data-base.bjjr-${process.env.NODE_ENV}`;

/**
 * @description [java-data-base]
 * @author virgoheRomAn
 * @date 2021-12-23
 */
module.exports = {
  /**
   * @description 查询全部省市区
   * @param {Object} params
   * @returns
   */
  queryAreaInfo: async (ctx, params) => {
    const action = servename + `/area/queryAreaInfoNewest`;
    return ctx.clientPost(action, params);
  },

  /**
   * @description 查询所有数据字典
   * @param {Object} params
   * @returns
   */
  queryAllDicts: async (ctx, params) => {
    const action = servename + `/dict/queryAll`;
    return ctx.clientPost(action, params);
  },
}