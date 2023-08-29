import { base } from '../base';
import { global } from '../global';
import { datetime } from '../datetime';
import { U } from '..';

/**
 * @description 数据处理工具
 * @author virgoheRomAn
 * @date 2021-07-12
 */
class Data {
	constructor() {}

	/**
	 * @description 清空数组
	 * @param {Array} ary 数据源
	 * @returns {Array}
	 */
	emptyArray(ary: EmptyArrayType): EmptyArrayType {
		return (ary = ary.splice(0, ary.length));
	}

	/**
	 * @description 清空对象
	 * @param {Object} obj 数据源
	 * @returns {Object}
	 */
	emptyObject(obj: EmptyObjectType): EmptyObjectType {
		for (let key in obj) {
			obj[key] = base.isObject(obj[key]) ? {} : base.isArray(obj[key]) ? [] : '';
		}
		return obj;
	}

	/**
	 * @description 清空数据
	 * @param {Array | Object | String} data 数据源
	 * @returns
	 */
	emptyData(data: any): EmptyObjectType | EmptyArrayType | string {
		if (base.isObject(data)) {
			return this.emptyObject(data);
		}

		if (base.isArray(data)) {
			return this.emptyArray(data);
		}

		return (data = '');
	}

	/**
	 * @description 深度清空渲染源 [带又value的渲染数据]
	 * @param {Object} render 数据源
	 * @returns
	 */
	emptyObjectDeep(render: any): void {
		for (let key in render) {
			let item = render[key];

			if (!base.isObject(item.value) && !base.isArray(item.value)) {
				item.value = '';
			} else if (base.isObject(item.value)) {
				this.emptyObjectDeep(item.value);
			} else if (base.isArray(item.value)) {
				item.value = [];
			}
		}
	}

	/**
	 * @description 深度清空数据源 [不带value的接口数据]
	 * @param {Object} form 数据源
	 * @param {Boolean} isOnlyOneArray 数组是否只保留一个
	 * @returns
	 */
	emptyDataDeep(form: any, isOnlyOneArray: boolean = false): void {
		if (base.isObject(form)) {
			for (let key in form) {
				let item = form[key];

				if (base.isString(item)) {
					form[key] = '';
				} else if (base.isNumber(item)) {
					form[key] = 0;
				} else if (base.isBoolean(item)) {
					form[key] = false;
				} else {
					this.emptyDataDeep(form[key], isOnlyOneArray);
				}
			}
		}

		if (base.isArray(form as EmptyArrayType)) {
			// 判断是否是对象数组
			const isObjectArray = form.some((x: any) => U.isObject(x) || U.isArray(x));

			if (!isObjectArray) {
				this.emptyArray(form);
			} else {
				if (isOnlyOneArray) {
					form = form.filter((x: any, i: number) => i === 0);
				}

				for (let item of form as EmptyArrayType) {
					this.emptyDataDeep(item, isOnlyOneArray);
				}
			}
		}
	}

	/**
	 * @description 对比子对象中的元素是否在父对象中存在且值相同
	 * @param {Object} parent 父辈对象
	 * @param {Object} child 子类对象
	 * @returns
	 */
	isUniteObjectByChild(parent: EmptyObjectType, child: EmptyObjectType): boolean {
		const result: number[] = [];

		for (let key in parent) {
			for (let k in child) {
				if (k === key && parent[key] === child[k]) {
					result.push(1);
				} else {
					continue;
				}
			}
		}

		return result.every((x) => x === 1) && result.length === Object.keys(child).length;
	}

	/**
	 * @description 合并多维数组
	 * @param {Array} ary
	 * @returns
	 */
	mergeDimensionsArray(ary: EmptyArrayType): EmptyArrayType {
		return ary.reduce((pre, cur) => pre.concat(base.isArray(cur) ? this.mergeDimensionsArray(cur) : cur), []);
	}

	/**
	 * @description 数组、数组对象去重
	 * @param {Array} arr 数组内容
	 * @param {Array} attr 需要去重的键值（数组对象）
	 * @returns
	 */
	removeArrayDuplicate(arr: EmptyArrayType, attr?: string): EmptyArrayType {
		if (!Object.keys(arr).length) {
			return arr;
		} else {
			if (attr) {
				const obj: EmptyObjectType = {};
				return arr.reduce((cur: EmptyArrayType[], item: EmptyArrayType) => {
					obj[item[attr]] ? '' : (obj[item[attr]] = true && item[attr] && cur.push(item));
					return cur;
				}, []);
			} else {
				return [...new Set(arr)];
			}
		}
	}

	/**
	 * @description 判断两数组字符串是否相同，数组字符串中存在相同时会自动去重（按钮权限标识不会重复）
	 * @param news 新数据
	 * @param old 源数据
	 * @returns 两数组相同返回 `true`，反之则反
	 */
	judementSameArr(newArr: unknown[] | string[], oldArr: string[]): boolean {
		const news: EmptyArrayType = this.removeArrayDuplicate(newArr);
		const olds: EmptyArrayType = this.removeArrayDuplicate(oldArr);
		let count = 0;
		const leng = news.length;
		for (let i in olds) {
			for (let j in news) {
				if (olds[i] === news[j]) count++;
			}
		}
		return count === leng ? true : false;
	}

	/**
	 * @description 判断两个对象是否相同
	 * @param a 要比较的对象一
	 * @param b 要比较的对象二
	 * @returns 相同返回 true，反之则反
	 */
	isObjectValueEqual<T>(a: T, b: T): boolean {
		if (!a || !b) return false;
		let aProps = Object.getOwnPropertyNames(a);
		let bProps = Object.getOwnPropertyNames(b);
		if (aProps.length !== bProps.length) return false;

		for (const prop of aProps) {
			let propName = prop;
			let propA = (<EmptyObjectType>a)[propName];
			let propB = (<EmptyObjectType>b)[propName];
			if (!b.hasOwnProperty(propName)) return false;
			if (propA instanceof Object) {
				if (!this.isObjectValueEqual(propA, propB)) return false;
			} else if (propA !== propB) {
				return false;
			}
		}

		return true;
	}

	/**
	 * @description 查询数组中元素出现的个数 [不包含对象数组]
	 * @param {Array} array
	 * @returns
	 */
	queryFieldsNumber(array: EmptyArrayType): EmptyArrayType {
		return array.reduce((pre, cur) => {
			if (cur in pre) {
				pre[cur]++;
			} else {
				pre[cur] = 1;
			}
			return pre;
		}, {});
	}

	/**
	 * @description 格式化picker选择数据
	 * @param {Array} data  数据源
	 * @param {String} text  替换的文本
	 * @param {String} code  替换的code
	 * @returns {Array} 返回改造后的数据
	 */
	formatPickerData(data: EmptyArrayType, text: string, code: string): EmptyArrayType {
		data.forEach((item) => {
			item['text'] = item[text];
			item['code'] = item[code];
		});

		return data;
	}

	/**
	 * @description 将枚举转换成数组
	 * @param enums 枚举
	 * @returns
	 */
	enum2Array(enums: any): Array<any> {
		let map: { code: string | number; text: any }[] = [];

		for (let n in enums) {
			map.push({ code: n, text: <any>enums[n] });
		}

		return map;
	}

	/**
	 * @description 将对象抓换成对应的数组
	 * @param {Object} obj 数据源
	 * @param {String} key 对象数组中子项的 key
	 * @param {String} value 对象数组中子项的 value
	 * @param {Array} array 返回数组
	 * @returns {Array} 返回改造后的数据
	 */
	object2Array(obj: EmptyObjectType, key: string = 'code', value: string = 'text', array: EmptyArrayType = []): boolean | EmptyArrayType {
		if (!base.isObject(obj)) return false;

		for (let k in obj) {
			array.push({ [key]: k ?? '', [value]: obj[k] ?? '' });
		}

		return array;
	}

	/**
	 * @description 通过 value 从 array 中获取对应 field 的数组数据
	 * @param {Array} array
	 * @param {String} field 集合中需要筛选对比的字段
	 * @param {String} value
	 * @param {Array} result
	 * @returns {Array}
	 */
	getArrayByFieldValue(array: EmptyArrayType, field: string, value: string, result: EmptyArrayType = []): EmptyArrayType {
		for (let item of array) {
			if (!field) result = array;
			if (item[field] === value) {
				result.push(item);
			}
		}

		return result;
	}

	/**
	 * @description 根据传入值返回在数组的位置
	 * @param value  某个字符
	 * @param arr  数组
	 * @param fields  数组中判断依据的字段
	 * @returns {Number}
	 */
	getArrayIndexByVal(value: string, arr: EmptyArrayType, fields: string = 'code'): number {
		for (let i = 0; i < arr.length; i++) {
			let item = arr[i];
			if (!!item[fields] && !!item[fields].toString()) {
				if (item[fields] === value) {
					return i;
				}
			} else {
				if (item === value) {
					return i;
				}
			}
		}

		return -1;
	}

	/**
	 * @description 根据传入Id返回对应的值
	 * @param id  id
	 * @param arr  数组
	 * @param fields  数组中判断依据的字段
	 * @param rFields  数组中判断依据的字段返回想要的字段
	 * @returns {String}
	 */
	getArrayValueById(id: string | number | boolean, arr: EmptyArrayType, fields: string = 'code', rFields: string = 'text'): string {
		for (const item of arr) {
			if (!!fields) {
				if (item[fields] === id) {
					return item[rFields];
				}
			}
		}

		return '';
	}

	/**
	 * @description 通过 field 字段 在源对象中提取出新的对象
	 * @param {Object} data 源
	 * @param {String} field 特殊字符
	 * @param {Object} result 返回对象
	 * @returns {Object}
	 */
	extractObjectByField(data: EmptyDataType, field: string, result: EmptyObjectType = {}): EmptyObjectType | boolean {
		if (!base.isObject(data)) return false;
		data = base.clone(data);
		for (let key in data) {
			let item = data[key];

			if (item.field === field) {
				result[key] = item;
			}
		}

		return result;
	}

	/**
	 * @description 去掉提交表单中的空属性
	 * @param {Object} form
	 * @returns {Object}
	 */
	doEmptyObject(form: EmptyObjectType): EmptyObjectType {
		for (let key in form) {
			if (base.isFalse(form[key]) || base.isEmpty(form[key])) {
				delete form[key];
			}
		}
		return form;
	}

	/**
	 * @description 去掉提交表单中的空属性 [只有字符串]
	 * @param {Object} form
	 * @returns {Object}
	 */
	doEmptyString(form: EmptyObjectType): EmptyObjectType {
		for (let key in form) {
			if (base.isFalse(form[key])) {
				delete form[key];
			}
		}
		return form;
	}

	/**
	 * @description 获取对象中指定 key 的 item
	 * @param {Object} source
	 * @param {String | Array} key 数组的时候返回数组
	 * @param {Object} result
	 * @returns {Object}
	 */
	getObjectItemByKey(source: EmptyObjectType, key: string | Array<string>, result: EmptyObjectType = {}): EmptyObjectType {
		// 如果 key 是数组
		if (typeof key === 'object' && base.isArray(key)) {
			for (let k of key) {
				result[k] = this.getObjectItemByKey(source, k, result[k]);
			}
		}

		for (let k in source.value) {
			const item = source.value[k];

			// 如果有需要切割的字段 fieldValue
			if (!!item.fieldValue) {
				const keys = item.fieldValue.map((x: any) => Object.keys(x)[0]);
				if (!!keys.includes(key)) {
					const current: EmptyObjectType = item.fieldValue.find((x: any) => Object.keys(x).find((d) => d === key));

					result = {
						currentKey: key,
						isNotInSource: true,
						...current[key as string]
					};
				}
			}

			// 标准字段
			if (k === key) {
				if (!item.sameName) {
					result = source.value[k];
					break;
				} else {
					// 有同名继续执行
					result = this.getObjectItemByKey(source.value[k], key, result);
				}
			} else {
				if (!base.isObject(source.value[k])) continue;

				if (!base.isObject(source.value[k].value)) continue;

				result = this.getObjectItemByKey(source.value[k], key, result);
			}
		}

		return result;
	}

	/**
	 * @description 设置导出表格的格式 title 和 字段
	 * @param {Object} data 需要格式化的数据
	 * @param {Object} result 返回结果 header:表格头部 fields:表格头部对应的字段
	 * @returns
	 */
	formatExportLayout(data: EmptyObjectType, result: EmptyObjectType = { header: [], fields: [] }): EmptyObjectType | boolean {
		if (!base.isObject(data)) return false;

		for (let key in data) {
			let item = data[key];
			// 跳过不需要导出的数据字段
			if (item.isNotExport) continue;

			result.header.push(item.key || '');
			result.fields.push(key || '');
		}

		return result;
	}

	/**
	 * @description 格式化导出数据
	 * @param {Array} source 源数据
	 * @param {Array} fields 需要提取源数据中的字段数组
	 * @param {Object} validateFields 验证源数据中的字段 转换相应的需求
	 * @param {Object} result 返回值
	 * @returns
	 */
	formatExportData(
		source: EmptyArrayType,
		fields: EmptyArrayType,
		validateFields: EmptyObjectType,
		result: EmptyArrayType = []
	): EmptyArrayType | boolean {
		if (!base.isArray(source)) {
			console.warn(`导出的数据格式错误`);
			return false;
		}

		for (let [index, value] of base.clone(source).entries()) {
			value['serialNo'] = index + 1;

			for (let key in value) {
				let item = value[key];
				// 验证的值
				let validateItem = validateFields[key];

				// 如果 数据源列表 比 验证列表多 跳过验证数组中没有的部分
				if (!validateItem) continue;

				// 跳过不需要导出的数据字段
				if (validateItem.isNotExport) continue;

				// 数据转换
				if (validateItem.convert) {
					value[key] = base.isFalse(item) ? '' : this.getArrayValueById(item, validateItem.convert);
					continue;
				}

				// 时间戳
				if (validateItem.timestamp) {
					value[key] = base.isFalse(item) ? '' : datetime.formatDatetime(item, validateItem.valueFormat || '{y}-{m}-{d} {h}:{i}:{s}');
					continue;
				}
			}

			result.push(fields.map((item) => value[item]));
		}

		return result;
	}

	/**
	 * @description 格式化 form 数据提交到接口
	 * @param {Object | Array} renderData 渲染页面的不规则数据格式
	 * @param {Boolean} deep 深度赋值,去掉父辈字段,只保留最里层字段 [默认：true]
	 * @param {Boolean} cutting 深度切割数组 将数组里面的 对象拆分 [默认：false]
	 * @param {Boolean} submit 是否是提交模式 用于区分渲染还是提交 [默认：true]
	 * @param {Object} result 返回的对象
	 * @returns {Object}
	 */
	formatFormData(
		renderData: EmptyObjectType | Array<any>,
		{ deep = true, cutting = false, submit = true }: EmptyObjectType = {},
		result: EmptyObjectType = {}
	): EmptyObjectType {
		if (!base.isObject(renderData) && !base.isArray(renderData as Array<any>)) return {};

		// 克隆源数据
		const formData = base.clone(renderData);

		/**
		 * @description 传入的是 JSON 对象
		 */
		if (base.isObject(formData)) {
			// 遍历对象
			for (let key in formData) {
				let item = formData[key];

				// 排除空值[undefined] 和 不需要转换数据
				if (item === undefined || item === null) {
					result[key] = '';
					continue;
				} else {
					if (item.isNotAjax && !!submit) continue;
					if (item.isNotRender) continue;
				}

				// 处理没有 value 属性的 json 对象
				if (base.isObject(item) && item.value === undefined) {
					result = this.formatFormData(item, { deep, cutting, submit }, result);
					continue;
				}

				// 标准的格式，value 直接赋值
				if (!base.isObject(item.value) && !base.isArray(item.value)) {
					// 直接赋值
					result[key] = base.isObject(item) ? item.value : item;

					// 单位换算
					if (item.formCount || item.count) {
						let count = item.formCount || item.count;
						result[key] = base.isObject(item) ? global.count[count.t](item.value, count.n) : global.count[count.t](item, count.n);
						continue;
					}

					// 提交日期格式 日期字符串
					if (item.submitDate === 'str') {
						result[key] = item.value.split(item.splitDate || '-').join('');
						continue;
					}
				}

				// 如果值是对象
				if (base.isObject(item.value)) {
					// 处理特殊的级联
					if (item.cascader) {
						result[key] = [];
					}

					// 如果对象的为空
					if (base.isObjectEmpty(item.value)) {
						result[key] = {};
						continue;
					}

					// 深度递归
					if (deep) {
						// 整体递归 && 单个不递归
						if (item.isNotDeep) {
							result[key] = this.formatFormData(item.value, { deep: !item.isNotDeep, cutting, submit }, result[key]);
						} else {
							result = this.formatFormData(item.value, { deep, cutting, submit }, result);
						}
					} else {
						// 不做递归
						result[key] = this.formatFormData(item.value, { deep, cutting, submit }, (result[key] = {}));
					}
				}

				// 如果值是数组
				if (base.isArray(item.value)) {
					/**
					 * 深度切割数组 将数组拆分
					 * isCutting 单独组切割
					 */
					if (item.isCutting) {
						const value = item.fieldValue ?? item.value;
						result[key] = [];
						result = this.formatFormData(value, { deep, cutting: true, submit }, result);
						continue;
					}

					/**
					 * 需要把值拆分到 fieldValue 对应的真实提交字段中，value为数组
					 */
					if (!!item.fieldValue) {
						result[key] = this.formatFormData(item.fieldValue, { deep, cutting, submit }, (result[key] = []));
						continue;
					}

					// 深度递归
					if (deep) {
						// 整体递归 && 单个不递归
						if (item.isNotDeep) {
							result[key] = this.formatFormData(item.value, { deep: !item.isNotDeep, cutting, submit }, (result[key] = []));
						} else {
							result[key] = this.formatFormData(item.value, { deep, cutting, submit }, (result[key] = []));
						}
					} else {
						// 不做递归
						result[key] = this.formatFormData(item.value, { deep, cutting, submit }, (result[key] = []));
					}
				}
			}
		}

		/**
		 * @description 传入的是 Array 数组
		 */
		if (typeof formData === 'object' && base.isArray(formData)) {
			formData.forEach((item: EmptyDataType, index: number) => {
				if (typeof formData === 'object' && base.isObject(item)) {
					// 对象里面区分 是否 含有子对象
					if (Object.values(item).some((t) => base.isObject(t))) {
						// 深度切割数组
						if (!!cutting) {
							result = this.formatFormData(item, { deep, cutting, submit }, result);
						} else {
							result[index] = this.formatFormData(item, { deep, cutting, submit }, result[index]);
						}
					} else {
						// 如果有 vlaue 属性赋值 value 属性
						if (!!item.value) {
							result[index] = item.value;
						} else {
							result[index] = JSON.parse(JSON.stringify(item));
						}
					}
				} else {
					result.push(JSON.parse(JSON.stringify(item)));
				}
			});
		}

		return result;
	}

	/**
	 * @description 回显接口返回的数据
	 * @param {Object} form 页面上渲染的数据
	 * @param {Object} data 接口返回的数据
	 * @param {Object} isNotSame 返回数据的可以不相同
	 * @returns
	 */
	setAjaxFormatData(form: any, data: any, isNotSame: boolean = false): boolean {
		if (!base.isObject(form) && !base.isArray(form)) return false;

		/**
		 * 遍历渲染数据
		 */
		for (let key in form) {
			let item = form[key];

			// 单例模式
			if (base.isString(item)) {
				form[key] = data[key];
				continue;
			}

			// 跳过不需要格式化的字段
			if (item.isNotSetData) continue;
			if (item.isNotFormat) continue;
			if (item.value === undefined) continue;

			if (!base.isObject(item.value) && !base.isArray(item.value)) {
				let suffix = item.suffix;

				// 标准[存在默认值，当数据字段为空时使用默认值]
				item.value = base.isFalse(data[key]) ? (item.default ? item.default : '') : base.isString(data[key]) ? data[key] + (suffix || '') : data[key];

				// 如果是boolean值
				if (item.boolean || item.switch) {
					item.value = base.isFalse(data[key]) ? (item.default ? item.default : '') : data[key];
					continue;
				}

				// 如果是渲染 text 不渲染 value
				if (item.renderText) {
					item.text = item.renderFeilds ? data[item.renderFeilds] + (suffix || '') || '' : data[key] + (suffix || '') || '';
					continue;
				}

				// 赋值的KEY 和 返回的KEY 不一致
				if (item.dataField && isNotSame) {
					item.value = base.isFalse(data[item.dataField]) ? (item.default ? item.default : '') : data[item.dataField];
					continue;
				}

				// 格式是数字 判断优先级在 count 之前
				if (item.type === 'number') {
					if (item.showCount) {
						item.value = base.isFalse(data[key])
							? parseFloat(global.count[item.showCount.t](data[key], item.showCount.n)).toFixed(item.showCount.tofixed)
							: 0;
					} else {
						item.value = base.isFalse(data[key]) ? parseFloat(data[key]).toFixed(item.tofixed) : 0;
					}
					continue;
				}

				// code 转换 text [数据字典]
				if (item.convert) {
					item.value = base.isFalse(data[key]) ? '' : this.getArrayValueById(data[key], item.convert) + (item.split || '');
					continue;
				}

				// 时间戳
				if (item.timestamp) {
					item.value = data[key] ? datetime.getFormatDateByTime(data[key], item.dateStr || '') : '';
					continue;
				}

				// 时间格式
				if (item.datetime) {
					item.value = data[key] ? datetime.formatDatetime(data[key], item.valueFormat || '{y}-{m}-{d}') : '';
					continue;
				}

				// 单位换算
				if (item.showCount) {
					let count = item.showCount;
					item.value = data[key] ? global.moneyFormat(global.count[count.t](data[key], count.n), count.tofixed) + (suffix || '') : '';
					continue;
				} else if (item.count) {
					let count = item.count;
					item.value = data[key] ? global.moneyFormat(global.count[count.t](data[key], count.n), count.tofixed) + (suffix || '') : '';
					continue;
				}
			} else if (base.isObject(item.value)) {
				// 如果是默认值为空，不需要递归，如：value:{}
				if (base.isEmpty(item.value)) {
					item.value = data[key];
				} else {
					this.setAjaxFormatData(item.value, data, isNotSame);
				}
			} else if (base.isArray(item.value)) {
				/* 返回的数据源 为数组 */
				if (base.isArray(data[key])) {
					/**
					 * 预显示数据为空 item.value:[]
					 * item.formatField 需要 push 进 item.value 中的字段集合
					 */
					if (item.value.length === 0) {
						data[key].forEach((m: EmptyDataType, i: number) => {
							if (item.formatField) {
								// 将 item.formatField 克隆并且 push 到显示的 item.value 中
								item.value.push(base.clone(item.formatField));

								// 如果有开关控制
								if (item.opens) {
									item.opens.push(item.readonly ? false : true);
								}

								// 设置 push 到 item.value 的字段中的值与返回的 data 匹配
								this.setAjaxFormatData({ [key]: { value: item.value[i] } } as EmptyDataType, m, isNotSame);
							} else {
								// 直接 push 返回数据源
								item.value.push(m);
							}
						});
					} else {
						/**
						 * item.value 不为空，预先定义出需要显示的字段
						 * 预设有字段，如：两个联系人信息  item.value:[{friendName1:""},{friendName2:""}]
						 */
						if (data[key].length !== 0) {
							// 如果返回的数据大于预设的数据个数
							if (data[key].length > item.value.length) {
								data[key].forEach((x: EmptyDataType, i: number) => {
									if (i <= item.value.length - 1) {
										this.setAjaxFormatData(item.value[i], x, isNotSame);
									} else {
										item.value.push(base.clone(item.formatField));

										// 设置 push 到 item.value 的字段中的值与返回的 data 匹配
										this.setAjaxFormatData({ [key]: { value: item.value[i] } } as EmptyDataType, x, isNotSame);
									}
								});
							} else {
								item.value.forEach((x: EmptyDataType, i: number) => {
									this.setAjaxFormatData(x, data[key][i], isNotSame);
								});
							}
						}
					}
				} else {
					// 给数组里面的元素赋值
					item.value.forEach((x: EmptyDataType) => {
						this.setAjaxFormatData(x, data, isNotSame);
					});
				}
			}
		}

		return true;
	}

	/**
	 * @description 父子关系的数组转换成树形结构数据
	 * @param {Array} data
	 * @returns {*}
	 */
	translateDataToTree(data: EmptyArrayType): EmptyArrayType {
		const parent: EmptyArrayType = data.filter((value) => value.parentId === 'undefined' || value.parentId === null);
		const children: EmptyArrayType = data.filter((value) => value.parentId !== 'undefined' && value.parentId !== null);

		const translator = (parent: EmptyArrayType, children: EmptyArrayType) => {
			parent.forEach((parent: EmptyObjectType) => {
				children.forEach((current: EmptyObjectType, index: number) => {
					if (current.parentId === parent.id) {
						const temp = JSON.parse(JSON.stringify(children));
						temp.splice(index, 1);
						translator([current], temp);
						typeof parent.children !== 'undefined' ? parent.children.push(current) : (parent.children = [current]);
					}
				});
			});
		};

		translator(parent, children);

		return parent;
	}

	/**
	 * @description 树形结构数据转换成父子关系的数组
	 * @param {Array} data
	 * @returns {[]}
	 */
	translateTreeToData(data: EmptyArrayType): EmptyArrayType {
		const result: EmptyArrayType = [];

		data.forEach((item: EmptyObjectType) => {
			const loop = (data: EmptyObjectType) => {
				const child: EmptyArrayType = data.children;

				result.push({
					id: data.id,
					name: data.name,
					parentId: data.parentId
				});

				if (child) {
					for (const c of child) {
						loop(c);
					}
				}
			};
			loop(item);
		});

		return result;
	}
}

export const data = new Data();

export const D = new Data();

export default Data;
