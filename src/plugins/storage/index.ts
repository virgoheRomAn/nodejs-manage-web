import { base } from '/@/utils/base';
import Encrypt from './encryption';
import { cryptoAES } from './crypto';

/**
 * @description 本地存储 [localStorage 默认 | sessionStorage]
 * @author virgoheRomAn
 * @date 2021-07-14
 */
class Storage extends Encrypt {
	public cryptoAES: EmptyObjectType = cryptoAES;

	constructor(public storage: any = window.localStorage) {
		super();
		this.storage = storage;
	}

	/**
	 * @description 单例获取原始 [不加密]
	 * @param {String} key 键
	 * @returns {String | Object} 返回值
	 */
	set(key: any, val: any): void {
		if (base.isString(val)) {
			this.storage.setItem(key, val);
		} else {
			this.storage.setItem(key, JSON.stringify(val));
		}
	}

	/**
	 * @description 单例获取原始 [不加密]
	 * @param {String} key 键
	 * @returns {String | Object} 返回值
	 */
	get(key: any): any {
		try {
			let value = this.storage.getItem(key);
			return base.isJsonString(value) ? JSON.parse(value) : value;
		} catch (e) {
			return;
		}
	}

	/**
	 * @description 单例设置
	 * @param {String} key 键
	 * @param {String} value 值 两种类型 String 或 其他
	 */
	setItem(key: any, value: any): void {
		if (base.isString(value)) {
			this.storage.setItem(this.base64.encode(key), this.encryptionByBase64(value));
		} else {
			this.storage.setItem(this.base64.encode(key), this.encryptionByBase64(JSON.stringify(value)));
		}
	}

	/**
	 * @description 单例获取
	 * @param {String} key 键
	 * @returns {String | Object} 返回值
	 */
	getItem(key: any): any {
		try {
			let decodeValue = this.decryptionByBase64(this.storage.getItem(this.base64.encode(key)));
			return base.isJsonString(decodeValue) ? JSON.parse(decodeValue) : decodeValue;
		} catch (e) {
			return;
		}
	}

	/**
	 * @description 通过 Object 设置
	 * @param {Object} obj { key: value } key- 设置的键  value- 设置的值[String/Object/Array]
	 */
	setObj(obj: EmptyObjectType): void {
		for (let key in obj) {
			this.setItem(key, obj[key]);
		}
	}

	/**
	 * @description 通过 对象/数组 的方式获取
	 * @param {Object | Array} obj Object { key: value } key- 获取之后的键  value- 获取之后的值 | Array [key, ...keys] 键值数组
	 */
	getObj(obj: EmptyDataType): any {
		let result: any = base.isArray(obj) ? [] : {};

		if (base.isArray(obj)) {
			obj.map((item) => result.push(this.getItem(item)));
		}

		if (base.isObject(obj)) {
			for (let key in obj) {
				result[key] = this.getItem(obj[key]);
			}
		}

		return result;
	}

	/**
	 * @description 单例删除
	 * @param {String} key 删除 key
	 */
	remove(key: any): void {
		this.storage.removeItem(this.base64.encode(key));
	}

	/**
	 * @description 清楚所有存储
	 */
	clear(): void {
		this.storage.clear();
	}
}

export const storage = new Storage(window.localStorage);
export const session = new Storage(window.sessionStorage);

export const T = (window.__T__ = storage);
export const S = (window.__S__ = session);

export default Storage;
