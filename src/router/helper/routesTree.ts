/**
 * @description 递归生成树形结构
 * @param permission 权限列表
 * @param parentCode 根节点的父权限ID -1
 * @param parentField 根节点的父权限字段 parentId
 * @param parentValue 判断节点的依据字段 id
 * @returns
 */
export async function createRoutesTree(permission: Array<any>, parentCode: string, parentField: string, parentValue: string) {
	const tree: Array<any> = [];
	const sortPermission = permission.sort((a, b) => a.orderNumber - b.orderNumber);

	for (let item of sortPermission) {
		if (item.permissionType === 'POINT') continue;

		if (item[parentField] === parentCode) {
			const routes: Array<any> = item.routes;
			let children = await createRoutesTree(sortPermission, item[parentValue], parentField, parentValue);

			if (children.length > 0) {
				routes.forEach((r: EmptyObjectType, i: number) => {
					const { code, hidden, keepAlive, path, template } = r;

					tree.push({
						path: path,
						name: code,
						redirect: i === 0 ? children[0].path : '',
						component: template,
						meta: {
							title: `message.${code}`,
							systemId: item.otherInfo,
							isHide: hidden === undefined ? false : hidden === 1,
							isAffix: false,
							isKeepAlive: keepAlive === 1,
							isNotMenuShow: true,
							icon: item.icon
						},
						children
					});
				});
			} else {
				routes.forEach((r: EmptyObjectType, i: number) => {
					const { code, hidden, keepAlive, path, template } = r;

					tree.push({
						path: path,
						name: code,
						component: template,
						meta: {
							title: `message.${code}`,
							isHide: hidden === undefined ? i !== 0 : hidden === 1,
							isAffix: false,
							isKeepAlive: keepAlive === 1,
							parentPath: routes[0].path,
							icon: item.icon || ''
						}
					});
				});
			}
		}
	}

	return tree;
}

/**
 * @description 通过系统编码过滤路由树
 * @param routesTree 原始路由树
 * @param systemId 系统编码
 * @returns
 */
export async function filterRoutesTreeBySystemId(routesTree: Array<any>, systemId: string): Promise<any[]> {
	return routesTree.filter((item) => item.meta.systemId === systemId);
}
