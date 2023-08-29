'use strict';
const _ = require('lodash');
const NP = require('number-precision');
const utils = require('../lib/utils');

/**
 * @description 全局辅助函数
 * @author virgoheRomAn
 * @date 2021-12-19
 */
module.exports = {
	// lodash.js
	lodash: _,

	// 数据计算类
	NP,

	// 工具类
	...utils,

	/**
	 * @description 休眠函数
	 * @param {Number} ms
	 * @returns
	 */
	async sleep(ms) {
		return new Promise((resolve) => setTimeout(() => resolve(), ms));
	},

	/**
	 * @description stream转为buffer
	 * @param {Stream} stream 流
	 * @returns
	 */
	async streamToBuffer(stream) {
		return new Promise((resolve, reject) => {
			let buffers = [];
			stream.on('error', reject);
			stream.on('data', (data) => buffers.push(data));
			stream.on('end', () => resolve(Buffer.concat(buffers)));
		});
	},

	/**
	 * @description 获取完成的请求路径 第一段为系统服务名称
	 * @param {String} urlStr 路径字符串 如：'java-data-base.queryAreaInfoNewest'
	 * @returns {String} 请求的完整路径 如：http://[java-data-base]/a/b
	 */
	async getURI(urlStr) {
		return new Promise(async (resolve, reject) => {
			const interfaces = this.app.config.interface;
			const urls = urlStr.split('.');
			const host = await this.app.getConsulClient(urls[0]);
			const url = urls.reduce((pre, cur) => pre[cur], interfaces);
			const action = host + url;
			resolve(action);
		});
	},

	/**
	 * @description 获取请求路径
	 * @param {String} urlStr 路径字符串 如：'java-data-base.queryAreaInfoNewest'
	 * @returns {String} 请求路径 如：/a/b
	 */
	getUrl(urlStr) {
		const interfaces = this.app.config.interface;
		const urls = urlStr.split('.');
		return urls.reduce((pre, cur) => pre[cur], interfaces);
	},

	/**
	 * @description 递归生成权限路由树形结构 用于展示菜单页面的树形列表
	 * @param permission 权限列表
	 * @param parentCode 根节点的父权限ID -1
	 * @returns
	 */
	async createPermissionRouteTree(permission, parentCode) {
		const tree = [];
		const sortPermission = permission.sort((a, b) => a.id - b.id).sort((a, b) => a.orderNumber - b.orderNumber);

		for (let item of sortPermission) {
			if (item['parentId'] === parentCode) {
				const { id, parentId, permissionCode, permissionName, permissionType, icon, routes } = item;
				let children = await this.createPermissionRouteTree(sortPermission, id);

				if (children.length > 0 || parentId === '-1') {
					if (utils.isArray(routes)) {
						routes.map((r, i) => {
							if (i === 0) {
								const { path, code, name, template } = r;

								tree.push({
									...item,
									id,
									path,
									template: `src/${template}.vue`,
									code,
									name,
									type: permissionType,
									icon,
									children
								});
							}
						});
					}
				} else {
					if (utils.isArray(routes) && routes.length > 0) {
						routes.map((r, i) => {
							if (i === 0) {
								const { path, code, name, template } = r;

								tree.push({
									...item,
									id,
									path,
									template: `src/views/${template}.vue`,
									code,
									name,
									type: permissionType,
									icon
								});
							}
						});
					} else {
						tree.push({
							...item,
							id,
							code: permissionCode,
							name: permissionName,
							type: permissionType,
							icon,
							children
						});
					}
				}
			}
		}

		return tree;
	},

	/**
	 * @description 递归生成树形结构
	 * @param permission 权限列表
	 * @param parentCode 根节点的父权限ID -1
	 * @returns
	 */
	async createPermissionTree(permission, parentCode) {
		const tree = [];
		const sortPermission = permission.sort((a, b) => a.orderNumber - b.orderNumber);

		for (let item of sortPermission) {
			if (item['parentId'] === parentCode) {
				let children = await this.createPermissionTree(sortPermission, item['id']);

				if (children.length > 0) {
					tree.push({ ...item, children });
				} else {
					tree.push({ ...item });
				}
			}
		}

		return tree;
	},

	/**
	 * @description 递归生成权限拦截列表 [排除父级拦截器的第一项]
	 * @param permissionTree 权限树
	 * @param urls 返回列表
	 * @returns
	 */
	async createAuthPermissionUrls(permissionTree, urls = []) {
		for (let t of permissionTree) {
			const url = JSON.parse(t.urls);

			if (!t.children) {
				urls.push(...url);
			} else {
				if (!!url && utils.isArray(url) && url.length > 1) {
					urls.push(url[1]);
				}

				this.createAuthPermissionUrls(t.children, urls);
			}
		}

		return urls;
	}
};
