import Schema from 'async-validator';
import { base } from '../base';
import { data } from '../data';

/**
 * @description 验证工具
 * @author virgoheRomAn
 * @date 2021-07-12
 */
class Validate {
	verifyExp: EmptyObjectType = {
		// 大于0的数字(包含小数和整数)的正则表达式
		greaterThanZero: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/,
		// 正数（包括小数）
		positiveNumber: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
		// 正整数(不包括小数)
		positiveInteger: /^[+]{0,1}(\d+)$/,
		// 整数
		integer: /^(([^0][0-9]+|0)$)|^(([1-9]+)$)/,
		// 浮点
		float: /^((([^0][0-9]+|0)\.([0-9]{1,2}))$)|^(([1-9]+)\.([0-9]{1,2})$)/,
		// 金额
		amount: /^[0-9]([0-9]*)+([.]\d{1,2})?$/,
		// 手机
		mobile: /^(1[0-9]{10})$/,
		// 密码
		password: /^(?!\d+$)(?![a-z]+$)(?![A-Z]+$)(?![a-z\d]+$)(?![a-zA-Z]+$)(?![A-Z\d]+$)[a-zA-Z\d]{8,17}$/,
		// 用户名
		userName: /^[\u4e00-\u9fa5]{2,20}$/,
		// 银行卡
		bankNo: /^\d{9,}$/,
		// 电子邮箱
		email: /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/,
		// 身份证号码
		idCardNo:
			/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
		// ip地址
		ip: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
		// 端口号
		port: /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
	};

	constructor() {}

	/**
	 * @description 判读是否为外链
	 * @param path
	 * @returns {boolean}
	 */
	isExternal(path: string): boolean {
		return /^(https?:|mailto:|tel:|\/\/)/.test(path);
	}

	/**
	 * @description 判断是否为IP
	 * @param ip
	 * @returns {boolean}
	 */
	isIP(ip: string): boolean {
		return this.verifyExp.ip.test(ip);
	}

	/**
	 * @description 判断是否是小写字母
	 * @param value
	 * @returns {boolean}
	 */
	isLowerCase(value: string): boolean {
		const reg = /^[a-z]+$/;
		return reg.test(value);
	}

	/**
	 * @description 判断是否是大写字母
	 * @param value
	 * @returns {boolean}
	 */
	isUpperCase(value: string): boolean {
		const reg = /^[A-Z]+$/;
		return reg.test(value);
	}

	/**
	 * @description 判断是否是大写字母开头
	 * @param value
	 * @returns {boolean}
	 */
	isAlphabets(value: string): boolean {
		const reg = /^[A-Za-z]+$/;
		return reg.test(value);
	}

	/**
	 * @description 判断是否是端口号
	 * @param value
	 * @returns {boolean}
	 */
	isPort(value: string): boolean {
		return this.verifyExp.port.test(value);
	}

	/**
	 * @description 判断是否是手机号
	 * @param value
	 * @returns {boolean}
	 */
	isPhone(value: string): boolean {
		const reg = /^1\d{10}$/;
		return this.verifyExp.mobile.test(value);
	}

	/**
	 * @description 判断是否是身份证号(第二代)
	 * @param value
	 * @returns {boolean}
	 */
	isIdCard(value: string): boolean {
		return this.verifyExp.idCardNo.test(value);
	}

	/**
	 * @description 判断是否是邮箱
	 * @param value
	 * @returns {boolean}
	 */
	isEmail(value: string): boolean {
		return this.verifyExp.email.test(value);
	}

	/**
	 * @description 判断是否中文
	 * @param value
	 * @returns {boolean}
	 */
	isChina(value: string): boolean {
		const reg = /^[\u4E00-\u9FA5]{2,4}$/;
		return reg.test(value);
	}

	/**
	 * @description 验证年利率
	 * @param {Object} rule 规则
	 * @param {Any} value 验证的值
	 * @param {Function} callback 回调方法
	 */
	checkYearRate(rule: EmptyObjectType, value: any, callback: Fn): void {
		if (rule.required === false) {
			callback();
		} else {
			if (Number(value) > 0 && Number(value) <= 24) {
				callback();
			} else {
				callback(new Error('申请利率大于0%且小于等于24%'));
			}
		}
	}

	/**
	 * @description 验证金额必须大于 0
	 * @param {Object} rule 规则
	 * @param {Any} value 验证的值
	 * @param {Function} callback 回调方法
	 */
	greaterThanZero(rule: EmptyObjectType, value: any, callback: Fn): void {
		if (rule.required === false) {
			callback();
		} else {
			if (Number(value) > 0) {
				callback();
			} else {
				callback(new Error(rule.message));
			}
		}
	}

	/**
	 * @description 验证输入的文案不能包含空格
	 * @param {Object} rule 规则
	 * @param {Any} value 验证的值
	 * @param {Function} callback 回调方法
	 */
	checkSpaceText(rule: EmptyObjectType, value: any, callback: Fn): void {
		if (rule.required === false) {
			callback();
		} else {
			if (value.indexOf(' ') > -1) {
				callback(new Error(rule.message || '输入的内容中含有空格，请检查！'));
			} else {
				callback();
			}
		}
	}

	/**
	 * @description 格式化数字数据
	 * @param {String | Number} number 需要格式化的值
	 * @param {String} type 类型
	 * @param {Number} s 开始位置
	 * @param {Number} e 结束位置
	 * @param {String} split 截取字符
	 * @returns
	 */
	formatNumberByExp(number: string | number, type: string, s: number = 3, e: number = 4, split: string = '*'): number | string {
		if (type === 'mobile' && !this.verifyExp.mobile.test(number)) {
			console.warn(`手机号码格式错误，手机号码：${number}}`);
			return number;
		}

		if (type === 'idNo' && !this.verifyExp.idCardNo.test(number)) {
			console.warn(`身份证号码格式错误，身份证号：${number}}`);
			return number;
		}

		if (type === 'bankNo' && !this.verifyExp.bankNo.test(number)) {
			console.warn(`银行卡号码格式错误，卡号：${number}}`);
			return number;
		}

		let str: string = '';
		let length: number = (<string>number).length;
		let reg = type === 'idNo' ? `^(\\d{${s}})\\d+([\\d|\\w]{${e}})$` : `^(\\d{${s}})\\d+(\\d{${e}})$`;
		for (let i = 0; i < length - (s + e); i++) {
			str += split;
		}
		return (<string>number).replace(new RegExp(reg), `$1${str}$2`);
	}

	/**
	 * @description form 表单验证
	 * @param {Object} context 当前作用域
	 * @param {Array} rules 验证规则
	 * @param {Function} tips 错误提示方法
	 * @param {Function} callback 验证的回调方法
	 * @returns
	 */
	validateForm(context: EmptyObjectType, rules: EmptyArrayType, tips: EmptyObjectType, callback: Fn) {
		if (!context) return false;

		if (base.isObjectEmpty(rules)) {
			callback?.call(this, true, []);
			return false;
		}

		if (!base.isObject(rules)) return false;

		let error: EmptyObjectType = {};
		let validate: boolean = true;

		let isError: Fn = (item: EmptyObjectType, key: string): void => {
			tips.error(item.message);
			error[key] = item.message;
			validate = false;
		};

		const validateCall: Fn = (key: string, err: EmptyObjectType | NonNullable<null>): void => {
			if (!!err) {
				isError(err, key);
			}
		};

		for (let key in rules) {
			let item = rules[key];
			let ctx = item.source ? base.clone(context[item.source]) : context;

			if (item.required) {
				if (item.validate && typeof item.validate === 'function') {
					item.validate.call(ctx, key, item, ctx[key], validateCall);
					break;
				}

				// 校验的值是个Object
				if (base.isObject(ctx[key])) {
					if (Object.keys(ctx[key]).includes('value')) {
						if (!ctx[key].value || ctx[key].value === '') {
							isError(item, key);
							break;
						}
					}
				} else {
					if (!ctx[key] || ctx[key] === '') {
						isError(item, key);
						break;
					}
				}

				// 正则
				if (item.regs) {
					// 校验的值是个Object
					if (base.isObject(ctx[key])) {
						if (Object.keys(ctx[key]).includes('value')) {
							if (!item.regs.rule.test(ctx[key].value)) {
								isError(item.regs, key);
								break;
							}
						}
					} else {
						if (!item.regs.rule.test(ctx[key])) {
							isError(item.regs, key);
							break;
						}
					}
				}

				// 检测值是否Boolean类型
				if (ctx.isBoolean) {
					if (!ctx[key]) {
						isError(item, key);
						break;
					}
				}

				// 检测值是否Array类型
				if (base.isArray(ctx[key])) {
					if (ctx[key].length === 0) {
						isError(item, key);
						break;
					} else {
						for (let value of ctx[key]) {
							for (let k in item.validateFields) {
								// 标准
								if (!value[k] || value[k] === '') {
									isError(item.validateFields[k], k);
									return;
								}

								// 正则
								if (item.validateFields[k].regs) {
									if (!item.validateFields[k].regs.rule.test(value[key])) {
										isError(item.validateFields[k], k);
										return;
									}
								}

								// 检测值是否Boolean类型
								if (value.isBoolean) {
									if (!value[key]) {
										isError(item.validateFields[k], k);
										return;
									}
								}
							}
						}
					}
				}
			}
		}

		callback?.call(this, validate, error);
	}

	/**
	 * @description 生成 el-form 对应的规则集
	 * @param {Object} source 数据源
	 * @param {Object} result 返回结果
	 * @param {Object} fixedrRequired 固定必填规则 不在根据每一项的 isNotrequired 觉得是否必填
	 * @returns
	 */
	createRuleData(source: EmptyObjectType | EmptyArrayType, result: EmptyObjectType = {}, fixedrRequired?: boolean): EmptyObjectType {
		if (!base.isObject(source) && !base.isArray(source as EmptyArrayType)) return {};

		// 生成规则信息
		const createMsg: Fn = (item: EmptyObjectType, message: string, trigger: string, required: boolean = true, rule: EmptyDataType): EmptyDataType => {
			// 对象规则，如果空对象就是验证数据
			// 由于返回字段和页面展示字段的格式不对应 暂时取消 type 验证
			let type = 'string';

			if (base.isNumber(item.value) || item.isNumberValueRule || item.number) type = 'number';
			else if (base.isArray(item.value) || !!item.cascader) type = 'array';
			else if (base.isObject(item.value)) type = base.isEmpty(item.value) ? 'string' : 'object';

			// if (!!item.isNotRenderShow) required = false;
			if (fixedrRequired !== undefined) required = fixedrRequired;

			if (!!rule) {
				if (required) {
					if (base.isArray(rule)) {
						// 将自定义的必填规则设置为读取的必填规则
						return [{ required, message, trigger }].concat(rule.map((x) => x.required === undefined && ((x.required = required), x)));
					} else {
						// 将自定义的必填规则设置为读取的必填规则
						rule.required = required;
						return [{ required, message, trigger }, rule];
					}
				} else {
					return [{ required, message, trigger }];
				}
			} else {
				return [{ required, message, trigger }];
			}
		};

		// 克隆源数据
		const sourceData = base.clone(source);

		// 对象处理最后结果
		if (base.isObject(sourceData)) {
			// 遍历对象
			for (let key in sourceData) {
				let item = sourceData[key];

				// 不需要提交的过滤掉
				if (item.isNotAjax) continue;

				// 不需要深度处理
				if (
					(!base.isObject(item.value) && !base.isArray(item.value)) ||
					base.isEmpty(item.value) ||
					!!item.isRuleNotDeep ||
					!!item.isUpload ||
					!!item.cascader ||
					!!item.tree
				) {
					if (!!item.datetime) {
						result[key] = createMsg(item, `请选择${item.key}`, `change`, !item.isNotrequired, item.rules);
						continue;
					}

					if (!!item.cascader) {
						result[key] = createMsg(item, `请选择${item.key}`, `change`, !item.isNotrequired, item.rules);
						continue;
					}

					if (!!item.select) {
						result[key] = createMsg(item, `请选择${item.key}`, `change`, !item.isNotrequired, item.rules);
						continue;
					}

					if (!!item.tree) {
						result[key] = createMsg(item, `请勾选${item.key}`, `change`, !item.isNotrequired, item.rules);
						continue;
					}

					if (!!item.ruleCheck || !!item.checkboxGroupArray) {
						result[key] = createMsg(item, `请选择${item.key}`, `change`, !item.isNotrequired, item.rules);
						continue;
					}

					if (!!item.isUpload || !!item.uploadType) {
						result[key] = createMsg(item, `请上传${item.key}`, `change`, !item.isNotrequired, item.rules);
						continue;
					}

					// 如果生成规则有填充格式
					if (!!item.formatField) {
						result[key] = {};
						for (let k in item.formatField) {
							result[key][k] = createMsg(
								item.formatField[k],
								`请输入${item.formatField[k].key}`,
								`blur`,
								!item.formatField[k].isNotrequired,
								item.formatField[k].rules
							);
						}
						continue;
					}

					result[key] = createMsg(item, `请输入${item.key || item.placeholder}`, `blur`, !item.isNotrequired, item.rules);
					continue;
				}

				// 数组或者多项需要深度处理
				if (base.isArray(item.value) || base.isObject(item.value)) {
					// 对象规则
					if (!!item.isObjectRule) {
						result[key] = {};
						result[key]['fields'] = this.createRuleData(item.value, result[key]['fields'], fixedrRequired);
						result[key]['type'] = 'object';
						result[key]['required'] = !item.isNotrequired;
						continue;
					} else if (!!item.isValueSubFormVerify) {
						// 数组规则
						const fields = {};
						result[key] = [
							{
								type: 'array',
								required: !item.isNotrequired,
								len: item.value.length,
								defaultField: { type: 'object', required: !item.isNotrequired, fields: this.createRuleData(item.value, fields, fixedrRequired) }
							}
						];
						continue;
					} else {
						// 对象需要深度递归
						if (!!item.isRuleDeep) {
							result[key] = this.createRuleData(item.value, (result[key] = {}), fixedrRequired);
							continue;
						}

						if (!item.isNotRenderShow) {
							result = this.createRuleData(item.value, result, fixedrRequired);
							continue;
						}
					}
				}
			}
		}

		// 数组递归
		if (base.isArray(sourceData)) {
			sourceData.forEach((item: any) => {
				if (!item.isNotRenderShow) {
					result = this.createRuleData(item, result, fixedrRequired);
				}
			});
		}

		return result;
	}

	/**
	 * @description 更新规则
	 * @param {Object | Array} source 源渲染数据
	 * @param {Object | Array} rules 源规则集
	 * @returns
	 */
	updateRuleData(source: EmptyDataType, rules: EmptyDataType): boolean | EmptyDataType {
		if (!base.isObject(source) && !base.isArray(source)) return false;
		if (!base.isObject(rules)) return false;

		// 遍历对象
		for (let key in rules) {
			const render = data.getObjectItemByKey({ value: base.clone(source) }, key);
			let item = rules[key];
			item[0].required = !(<EmptyDataType>render).isNotRenderShow;
		}

		return rules;
	}

	/**
	 * @description 更新某个字段的key规则
	 * @param {String} key 源渲染数据
	 * @param {Boolean} required 是否必填
	 * @param {Array} rules 源规则集
	 * @returns
	 */
	updateRuleDataByKey(key: string, required: boolean, rules: EmptyObjectType): boolean | EmptyObjectType {
		if (!base.isObject(rules)) return false;
		const rule: EmptyArrayType = rules[key];

		rule.forEach((item: EmptyObjectType): void => {
			item.required = required;
		});

		return rules;
	}

	/**
	 * @description 使用 asyncValidator 验证表单
	 * @param {Object} form 当前作用域
	 * @param {Object} rules 验证规则
	 * @param {Function} toast 错误提示方法
	 * @param {Function} callback 验证的回调方法
	 */
	asyncValidator(form: EmptyObjectType, rules: EmptyObjectType, toast: Record<string, any>, callback: Fn): void {
		let validate = false;
		const validator = new Schema(rules);

		const options = {
			suppressWarning: false, // 是否禁止无效值的内部警告
			first: true, // 是否在第一个规则验证错误时调用回调，不再处理其他验证规则
			firstFields: false // 是否在指定字段的第一个规则验证错误时调用回调，不再处理相同字段的验证规则，true代表所有字段
		};

		validator.validate(form, options, (errors, fields) => {
			if (errors) {
				for (let err of errors) {
					toast.error(err.message);
					validate = false;
					callback?.call(this, validate, err, errors);
				}
			} else {
				validate = true;
				callback?.call(this, validate, {}, []);
			}
		});
	}
}

// 导出方法
export const validate = new Validate();

export const V = new Validate();

export default Validate;
