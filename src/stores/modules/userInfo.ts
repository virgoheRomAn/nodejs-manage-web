import { defineStore } from 'pinia';
import { useDatabase } from './databse';
import { TokenKey, UserKey, PermissionKey } from '/@/dicts/symbol';
import { storage } from '/@/plugins/storage';
import { userLogin } from '/@/api/login';

/**
 * @description 用户信息
 * @methods setUserInfo 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
	state: (): UserInfosState => ({
		token: storage.getItem(TokenKey) ?? '',
		userInfo: storage.getItem(UserKey) ?? {},
		id: storage.getItem(UserKey)?.id ?? '',
		orgId: storage.getItem(UserKey)?.orgId ?? '',
		name: storage.getItem(UserKey)?.name ?? '',
		account: storage.getItem(UserKey)?.account ?? '',
		role: storage.getItem(UserKey)?.role ?? [],
		permission: storage.getItem(PermissionKey) ?? []
	}),

	getters: {
		user(): EmptyObjectType {
			return this.userInfo || storage.getItem(UserKey) || {};
		},

		userRole(): EmptyObjectType {
			return this.role ? this.role.map((x) => x.id) : storage.getItem(UserKey)?.role.map((x: any) => x.id);
		},

		userPermission(): EmptyObjectType {
			return this.permission || storage.getItem(PermissionKey);
		}
	},

	actions: {
		// 存储 Token
		setToken(token: string) {
			this.token = token;

			// 设置到本地存储
			storage.setItem(TokenKey, token);
		},

		// 保存用户信息到本地
		async setUserInfo(userInfo: EmptyObjectType) {
			this.userInfo = userInfo;
			this.id = userInfo.id;
			this.orgId = userInfo.orgId;
			this.name = userInfo.name;
			this.account = userInfo.account;
			this.role = userInfo.role;

			// 设置到本地存储
			storage.setItem(UserKey, userInfo);
		},

		// 保存用户权限
		async setUserPermission(permission: Array<any>) {
			this.permission = permission;

			// 设置到本地存储
			storage.setItem(PermissionKey, permission);
		},

		/**
		 * @description 用户登录
		 * @returns
		 */
		async userLogin({ account = '', password = '', validateStatus, secCode, challenge } = {} as UserLogin) {
			try {
				const rs = await userLogin({ account, password, validateStatus, secCode, challenge }, true, true);
				if (rs.code === 'SUCCESS') {
					const database = useDatabase();

					// 保存用户数据
					this.setUserInfo(rs.data);
					this.setToken(rs.data.token);
					this.setUserPermission(rs.data.permission);

					// 保存基础数据
					database.setArea(rs.data.area);
					database.setDict(rs.data.dict);

					return Promise.resolve(rs);
				}
			} catch (err) {
				return Promise.resolve(err);
			}
		}
	}
});
