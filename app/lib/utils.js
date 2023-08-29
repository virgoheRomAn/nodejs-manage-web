const AES = require('../lib/crypto');

/**
 * @description 工具类
 * @author virgoheRomAn
 * @date 2023-03-13
 */
const utils = {
	// 加解密
	AES: new AES(),

	/**
	 * @description 验证是否是数组
	 * @param {Array} ary  数据源
	 * @returns {Boolean}
	 */
	isArray(ary) {
		return Object.prototype.toString.call(ary) === '[object Array]';
	},

	/**
	 * @description 验证是否是对象
	 * @param {Object} obj  数据源
	 * @returns {Boolean}
	 */
	isObject(obj) {
		return Object.prototype.toString.call(obj) === '[object Object]';
	},

	/**
	 * @description 验证是否是字符串
	 * @param {String} str  数据源
	 * @returns {Boolean}
	 */
	isString(str) {
		return Object.prototype.toString.call(str) === '[object String]';
	},

	/**
	 * @description 验证是否是布尔
	 * @param {String} boolean  数据源
	 * @returns {Boolean}
	 */
	isBoolean(boolean) {
		return Object.prototype.toString.call(boolean) === '[object Boolean]';
	},

	/**
	 * @description 验证是否是数字类型
	 * @param {Number} num 数据源
	 * @returns {Boolean}
	 */
	isNumber(num) {
		return Object.prototype.toString.call(num) === '[object Number]';
	},

	/**
	 * @description 字符串格式化
	 * @param {String} val 字符串
	 * @param {Number} beforeNum 前面保留
	 * @param {Number} lastNum 后面保留
	 * @param {String} split 切割
	 */
	stringFormatReg(val, beforeNum = 0, lastNum = 1, split = '*') {
		let str = '';
		const length = val.length;
		if (!val || length <= beforeNum + lastNum) return val;

		if (beforeNum > 0 && lastNum === 0) {
			for (let i = 0; i < length - beforeNum; i++) {
				str += split;
			}
			return val.substring(0, beforeNum) + str;
		} else if (lastNum > 0 && beforeNum === 0) {
			for (let i = 0; i < length - lastNum; i++) {
				str += split;
			}
			return str + val.substring(length - lastNum, length);
		} else if (beforeNum > 0 && lastNum > 0) {
			for (let i = 0; i < length - (beforeNum + lastNum); i++) {
				str += split;
			}
			return val.substring(0, beforeNum) + str + val.substring(length - lastNum, length);
		} else {
			return val;
		}
	},

	/**
	 * @description 格式化数据
	 * @param {String | Number} value 需要格式化的值
	 * @param {String} key 需要判断的key
	 * @param {Boolean} isAES 是否加密
	 * @param {Number} s 开始位置
	 * @param {Number} e 结束位置
	 * @param {String} split 截取字符
	 * @returns
	 */
	formatValueByExp(value, key, isAES = true, s = 3, e = 4, split = '*') {
		const isMobile = ['mobile', 'Mobile', 'phone', 'Phone', 'tel', 'Tel', 'telPhone', 'TelPhone'].some((item) => key.indexOf(item) > -1);
		const isIdNo = ['idNo', 'idCard', 'idCardNo', 'IdNo'].some((item) => key.indexOf(item) > -1);
		const isBankNo = ['countNo', 'accountNo', 'bankNo', 'bankCardNum'].some((item) => key.indexOf(item) > -1);

		if (!value) return { [key]: value };

		if (!isMobile && !isIdNo && !isBankNo) {
			return { [key]: value };
		}

		let reg = '';
		let str = '';
		const result = {};
		const length = value.length;

		if (isMobile) {
			reg = `^(\\d{${s - 1},${e - 1}})-*\\d{${s},${e}}(\\d{${e}})$`;
		}

		if (isIdNo) {
			s = 5;
			reg = `^(\\d{${s}})\\d+([\\d|\\w]{${e}})$`;
		}

		if (isBankNo) {
			reg = `^(\\d{${s}})\\d+(\\d{${e}})$`;
		}

		for (let i = 0; i < length - (s + e); i++) {
			str += split;
		}

		// 加密
		if (isAES) {
			result[`encrypt_${key}`] = this.AES.encrypt(value);
		}

		result[key] = value.replace(new RegExp(reg), `$1${str}$2`);

		return result;
	}
};

module.exports = utils;
