import { compact, cloneDeep, extend, pullAllBy, keyBy, merge } from 'lodash';

/**
 * @description 返回浏览器信息
 * @returns
 */
function checkBrowser(): EmptyObjectType {
	let u: string = navigator.userAgent;

	// 移动终端浏览器版本信息
	return {
		// IE内核
		trident: u.indexOf('Trident') > -1,
		// opera内核
		presto: u.indexOf('Presto') > -1,
		// 苹果、谷歌内核
		webKit: u.indexOf('AppleWebKit') > -1,
		// 火狐内核
		gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1,
		// 是否为移动终端
		mobile: !!u.match(/AppleWebKit.*Mobile.*/),
		// ios终端
		ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
		// android终端或uc浏览器
		android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
		// 是否为iPhone或者QQHD浏览器
		iPhone: u.indexOf('iPhone') > -1,
		// 是否iPad
		iPad: u.indexOf('iPad') > -1,
		// 是否web应该程序，没有头部与底部
		webApp: u.indexOf('Safari') === -1,
		// 是否是微信
		isWechat: u.indexOf('MicroMessenger') > -1,
		// 是否是移动端
		isMobile: !!u.match(
			/('phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone')/i
		)
	};
}
/**
 * @description 基础工具类
 * @author virgoheRomAn
 * @date 2021-07-12
 */
class Base {
	merge: any;
	extend: any;
	browser: EmptyObjectType;

	constructor() {
		this.merge = merge;
		this.extend = extend;
		this.browser = checkBrowser();
	}

	/**
	 * @description 深度克隆
	 * @param {Object} data 克隆对象
	 */
	clone(data: any): any {
		return cloneDeep(data);
	}

	/**
	 * @description 去掉数组中的 假[false, null, 0, "", undefined, NaN] 值
	 * @param {Array} ary
	 */
	compactArray(ary: EmptyArrayType): EmptyArrayType {
		return compact(ary);
	}

	/**
	 * @description 合并对象
	 * @param {Object} data 对象
	 */
	extendObject(...data: any): any {
		return extend({}, ...data);
	}

	/**
	 * @description 合并对象数组 [根据 text 字段区分]
	 * @param {Array} resource 源数组
	 * @param {Array} target 替换数组
	 */
	mergeObjArray(resource: EmptyArrayType, target: EmptyArrayType): EmptyArrayType {
		const map = keyBy(target, 'text');
		return resource.map((item) => merge({}, item, map[item.text])).concat(pullAllBy(target, resource, 'text'));
	}

	/**
	 * @description 深度合并
	 * @param {Array} src 源数组
	 * @param {Array} target 替换数组
	 */
	deepMerge<T = any>(src: any = {}, target: any = {}): T {
		let key: string;
		const res: any = cloneDeep(src);
		for (key in target) {
			res[key] = this.isObject(res[key]) ? this.deepMerge(res[key], target[key]) : (res[key] = target[key]);
		}
		return res;
	}

	/**
	 * @description 数组去重
	 * @param {Array} resource 源数组
	 */
	dedupeArray(resource: EmptyArrayType): EmptyArrayType {
		return Array.from(new Set(resource));
	}

	/**
	 * @description 验证是否是数组
	 * @param {Array} ary  数据源
	 * @returns {Boolean}
	 */
	isArray(ary: EmptyArrayType): boolean {
		return Object.prototype.toString.call(ary) === '[object Array]';
	}

	/**
	 * @description 验证是否是对象
	 * @param {Object} obj  数据源
	 * @returns {Boolean}
	 */
	isObject(obj: EmptyObjectType): boolean {
		return Object.prototype.toString.call(obj) === '[object Object]';
	}

	/**
	 * @description 验证是否是字符串
	 * @param {String} str  数据源
	 * @returns {Boolean}
	 */
	isString(str: string): boolean {
		return Object.prototype.toString.call(str) === '[object String]';
	}

	/**
	 * @description 验证是否是布尔
	 * @param {String} boolean  数据源
	 * @returns {Boolean}
	 */
	isBoolean(boolean: string | boolean): boolean {
		return Object.prototype.toString.call(boolean) === '[object Boolean]';
	}

	/**
	 * @description 验证是否是数字类型
	 * @param {Number} num 数据源
	 * @returns {Boolean}
	 */
	isNumber(num: number): boolean {
		return Object.prototype.toString.call(num) === '[object Number]';
	}

	/**
	 * @description 是否是 JSON 字符串
	 * @param {String} str
	 * @returns {Boolean}
	 */
	isJsonString(str: string): boolean {
		if (this.isString(str)) {
			try {
				let obj = JSON.parse(str);
				if (this.isBoolean(obj)) {
					return this.isBoolean(obj);
				} else {
					return obj && (this.isObject(obj) || this.isArray(obj));
				}
			} catch (e) {
				return false;
			}
		} else {
			return false;
		}
	}

	/**
	 * @description 是否为假
	 * @param {String | Number | null | undefined} val 验证的值
	 * @returns {Boolean}
	 */
	isFalse(val: FlaseType): boolean {
		return val === '' || val === null || val === undefined;
	}

	/**
	 * @description 验证对象是否为空
	 * @param {Object} obj 数据源
	 * @returns {Boolean}
	 */
	isObjectEmpty(obj: EmptyObjectType): boolean {
		return Object.keys(obj).length === 0;
	}

	/**
	 * @description 验证对象中每一项的值是否为空
	 * @param {Object} obj 数据源
	 * @returns {Boolean}
	 */
	isObjectItemEmpty(obj: EmptyObjectType): boolean {
		const rArray: any[] = [];

		for (let key in obj) {
			const item = obj[key];

			if (this.isArray(item) && this.isArrayEmpty(item)) {
				continue;
			}

			if (this.isObject(item) && this.isObjectEmpty(item)) {
				continue;
			}

			if (item === '') {
				continue;
			}

			rArray.push(item);
		}

		return this.isArrayEmpty(rArray);
	}

	/**
	 * @description 验证数组是否为空
	 * @param {Array} array
	 * @returns {Boolean}
	 */
	isArrayEmpty(array: EmptyArrayType): boolean {
		return array.length === 0;
	}

	/**
	 * @description 验证数据是否为空
	 * @param {Array | Object | String} data
	 * @returns {Boolean}
	 */
	isEmpty(data: any): boolean {
		let boolean: boolean = false;

		if (typeof data === 'object' && this.isObject(data)) {
			boolean = this.isObjectEmpty(data);
		} else if (typeof data === 'object' && this.isArray(data)) {
			boolean = this.isArrayEmpty(data);
		} else if (typeof data === 'string' && this.isString(data)) {
			boolean = this.isFalse(data);
		}

		return boolean;
	}

	/**
	 * @description 获取随机id
	 * @param {Number} length 位数
	 * @returns {String}
	 */
	uuid(length: number = 32): string {
		const num: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
		let str: string = '';
		for (let i = 0; i < length; i++) {
			str += num.charAt(Math.floor(Math.random() * num.length));
		}
		return str;
	}

	/**
	 * @description min 到 max 的随机数
	 * @param {Number} min 最小值
	 * @param {Number} max 最大值
	 * @returns {Number}
	 */
	random(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min) + min);
	}
}

export const base = new Base();

export const B = new Base();

export default Base;
