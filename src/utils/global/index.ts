/**
 * @description 全局公共类
 * @author virgoheRomAn
 * @date 2021-07-12
 */
class Global {
	// 精度计算
	count: EmptyObjectType = this.precisionCount();

	/**
	 * @constructor 数据补零
	 * @param {Number | String} num 需要补零的值
	 * @param {Number} n 补零的位数
	 * @returns {String}
	 */
	zero(num: number | string, n: number): string {
		let len = num.toString().length;
		while (len < n) {
			num = '0' + num;
			len++;
		}
		return num.toString();
	}

	/**
	 * @description 去掉所有空格
	 * @param {String} str 需要处理的字符
	 * @returns {String} 去掉空格的字符
	 */
	removeAllSpace(str: string): string {
		return str.replace(/\s+/g, '');
	}

	/**
	 * @description 提取字符串中的小数
	 * @param {String} str
	 * @returns {Number}
	 */
	getFlaotByStr(str: string): number {
		let leftStr = str.split('.')[0];
		let rightStr = str.split('.').slice(1).join('.');
		let integer = leftStr.replace(/[^0-9]/gi, '');
		let float = rightStr.replace(/[^0-9]/gi, '');
		return parseFloat(float ? integer + '.' + float : integer);
	}

	/**
	 * @description 获取页面URL中的参数
	 * @param {String} name 参数名
	 * @returns {String}
	 */
	getUrlQueryString(name: string): string | null {
		let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		let r = window.location.search.substr(1).match(reg);
		if (r !== null) return decodeURI(r[2]);
		return null;
	}

	/**
	 * @description 将url请求参数转为json格式
	 * @param {String} url
	 * @returns {{} | any}
	 */
	getUrlParamsObject(url: string): EmptyObjectType {
		const search = url.split('?')[1];
		if (!search) {
			return {};
		}
		return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"').replace(/\+/g, ' ') + '"}');
	}

	/**
	 * @description 将对象转换成URL 参数
	 * @param {String} baseUrl
	 * @param {Object} obj
	 * @returns {{} | any}
	 */
	setUrlParamsByObject(baseUrl: string, obj: any): string {
		let parameters: string = '';
		for (const key in obj) {
			parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
		}
		parameters = parameters.replace(/&$/, '');
		return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
	}

	/**
	 * @description 格式化货币格式
	 * @param {Number | String} number 需要格式换的金额
	 * @param {Number} places 保留小数位数
	 * @param {String} symbol 前缀 [货币符号]
	 * @param {String} thousand 切割货币的字符
	 * @param {String} decimal 小数点字符
	 * @returns {String}
	 */
	moneyFormat(number: number | string = 0, places: number = 2, symbol: string = '', thousand: string = ',', decimal: string = '.'): string | number {
		let negative: string = (number as number) < 0 ? '-' : '';
		let transNumber: string = String(parseInt(Math.abs(Number(number) || 0).toFixed(places), 10));
		let transNumberLength: number = transNumber.length;
		transNumberLength = transNumberLength > 3 ? transNumberLength % 3 : 0;

		return (
			symbol +
			negative +
			(transNumberLength ? transNumber.substr(0, transNumberLength) + thousand : '') +
			transNumber.substr(transNumberLength).replace(/(\d{3})(?=\d)/g, '$1' + thousand) +
			(places
				? decimal +
				  Math.abs(parseFloat(number as string) - parseFloat(transNumber as string))
						.toFixed(places)
						.slice(2)
				: '')
		);
	}

	/**
	 * @description 小写金额转换成大写金额
	 * @param {Number | String} n 需要转换的小写金额
	 * @return {String}
	 */
	moneyToCapital(n: number | string): string {
		let transNumber: string | number = typeof n === 'string' ? n.replace(/,/g, '') : n;
		let unit: string = '千百拾亿千百拾万千百拾元角分';
		let result: string = '';

		if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(transNumber as string)) return '数据非法';

		transNumber += '00';
		let p: number = (transNumber as string).indexOf('.');
		if (p >= 0) {
			transNumber = (transNumber as string).substring(0, p) + (transNumber as string).substr(p + 1, 2);
		}
		unit = unit.substr(unit.length - (transNumber as string).length);

		for (let i = 0; i < (transNumber as string).length; i++) {
			result += '零壹贰叁肆伍陆柒捌玖'.charAt((transNumber as any).charAt(i)) + unit.charAt(i);
		}

		return result
			.replace(/零([千百拾角])/g, '零')
			.replace(/(零)+/g, '零')
			.replace(/零([万亿元])/g, '$1')
			.replace(/(亿)万|壹(拾)/g, '$1$2')
			.replace(/^元零?|零分/g, '')
			.replace(/元$/g, '元整');
	}

	/**
	 * @description 将数字转换为汉字
	 * @param {Number | String} num 需要转换的数字
	 * @returns
	 */
	convertToChinaNum(num: number | string): string {
		let arr1: string[] = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九');
		let arr2: string[] = new Array('', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿');
		let result: string = '';

		if ((typeof num === 'number' && isNaN(num)) || (typeof num === 'string' && !num)) {
			return '';
		}

		let english: any[] = num.toString().split('');

		for (let i = 0; i < english.length; i++) {
			let des_i: number = english.length - 1 - i;
			result = arr2[i] + result;

			let arr1_index: number = english[des_i];
			result = arr1[arr1_index] + result;
		}

		// 将【零千、零百】换成【零】 【十零】换成【十】
		result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十');
		// 合并中间多个零为一个零
		result = result.replace(/零+/g, '零');
		// 将【零亿】换成【亿】【零万】换成【万】
		result = result.replace(/零亿/g, '亿').replace(/零万/g, '万');
		// 将【亿万】换成【亿】
		result = result.replace(/亿万/g, '亿');
		// 移除末尾的零
		result = result.replace(/零+$/, '');
		// 将【零一十】换成【零十】
		// result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
		// 将【一十】换成【十】
		result = result.replace(/^一十/g, '十');

		return result;
	}

	/**
	 * @description 精度计算
	 * @returns
	 */
	precisionCount() {
		return {
			/**
			 * @description 加法
			 * @param {String | Number} arg1
			 * @param {String | Number} arg2
			 * @returns
			 */
			add: (arg1: number | string, arg2: number | string): number | string => {
				let r1: any;
				let r2: any;
				let m: any;

				try {
					r1 = arg1.toString().split('.')[1].length;
				} catch (e) {
					r1 = 0;
				}

				try {
					r2 = arg2.toString().split('.')[1].length;
				} catch (e) {
					r2 = 0;
				}

				m = Math.pow(10, Math.max(r1, r2));

				return (<number>arg1 * m + <number>arg2 * m) / m;
			},

			/**
			 * @description 减法
			 * @param {String | Number} arg1
			 * @param {String | Number} arg2
			 * @returns
			 */
			sub: (arg1: number | string, arg2: number | string): number | string => {
				let r1: any;
				let r2: any;
				let m: any;
				let n: any;

				try {
					r1 = arg1.toString().split('.')[1].length;
				} catch (e) {
					r1 = 0;
				}

				try {
					r2 = arg2.toString().split('.')[1].length;
				} catch (e) {
					r2 = 0;
				}

				m = Math.pow(10, Math.max(r1, r2));
				n = r1 >= r2 ? r1 : r2;

				return ((<number>arg1 * m - <number>arg2 * m) / m).toFixed(n);
			},

			/**
			 * @description 乘法
			 * @param {String | Number} arg1
			 * @param {String | Number} arg2
			 * @returns
			 */
			mul: (arg1: number | string, arg2: number | string): number | string => {
				let m = 0;
				let s1 = arg1.toString();
				let s2 = arg2.toString();

				try {
					m += s1.split('.')[1].length;
				} catch (e) {}

				try {
					m += s2.split('.')[1].length;
				} catch (e) {}

				return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
			},

			/**
			 * @description 除法
			 * @param {String | Number} arg1
			 * @param {String | Number} arg2
			 * @returns
			 */
			div: (arg1: number | string, arg2: number | string): number | string => {
				let t1 = 0;
				let t2 = 0;
				let r1: any;
				let r2: any;

				try {
					t1 = arg1.toString().split('.')[1].length;
					t2 = arg2.toString().split('.')[1].length;
				} catch (e) {}

				r1 = Number(arg1.toString().replace('.', ''));
				r2 = Number(arg2.toString().replace('.', ''));

				return this.count.mul(r1 / r2, Math.pow(10, t2 - t1));
			}
		};
	}

	/**
	 * @description 递归生成数据树
	 * @param {Array} data 数据源
	 * @param {String} parentCode 父辈code 与 parentField 对比
	 * @param {String} parentField 父辈筛选字段
	 * @param {String} parentValue 父辈筛选值
	 * @returns
	 */
	createTreeData(data: Array<any>, parentCode: string | number, parentField: string, parentValue: string): EmptyArrayType {
		let tree: Array<any> = [];

		data.forEach((item) => {
			if (item[parentField] === parentCode) {
				let children = this.createTreeData(data, item[parentValue], parentField, parentValue);

				if (children.length > 0) {
					tree.push({ ...item, code: item.value, text: item.label, children });
				} else {
					tree.push({ ...item, code: item.value, text: item.label });
				}
			}
		});

		return tree;
	}

	/**
	 * @description 在树中查找父Id
	 * @param {String} id 当前Id
	 * @param {Array} tree 树形结构
	 * @returns
	 */
	queryParentIdArrayById(id: string | number, tree: EmptyArrayType): EmptyObjectType {
		const parentArray: EmptyArrayType = [];
		const parentIdArray: EmptyArrayType = [];

		// 定义一个递归函数，用于遍历整棵树并查找子节点的所有父节点
		function traverse(node: EmptyObjectType, nodeId: string | number) {
			if (node.id === nodeId) {
				return true;
			}

			if (node.children) {
				for (const childNode of node.children) {
					if (traverse(childNode, nodeId)) {
						parentArray.push(node);
						parentIdArray.push(node.id);
						return true;
					}
				}
			}

			return false;
		}

		// 从根节点开始遍历整棵树，并调用递归函数查找子节点的所有父节点
		for (const node of tree) {
			if (traverse(node, id)) {
				break;
			}
		}

		const parents = parentArray.sort((a, b) => a - b);
		const parentIds = parentIdArray.sort((a, b) => a - b);

		return { parents, parentIds };
	}

	/**
	 * @description 在树中查找父Id
	 * @param {String} ids 当前Id集合
	 * @param {Array} tree 树形结构
	 * @returns
	 */
	createChildrenTreeByIds(ids: EmptyArrayType, tree: EmptyArrayType, result: EmptyArrayType = []): EmptyArrayType {
		// permissionList: any[] = [
		// 	{ id: '1', pId: '0', label: '一级菜单-1' },
		// 	{ id: '1-2', pId: '1', label: '二级菜单-1-2' },
		// 	{ id: '1-3', pId: '1-2', label: '三级菜单-1-3' },
		// 	{ id: '1-4', pId: '1-3', label: '四级菜单-1-4' },

		// 	{ id: '2', pId: '0', label: '一级菜单-2' },
		// 	{ id: '2-1', pId: '2', label: '二级菜单-2-1' },
		// 	{ id: '2-1-1', pId: '2-1', label: '三级菜单-2-1-1' },
		// 	{ id: '2-1-2', pId: '2-1', label: '三级菜单-2-1-2' },
		// ];

		// console.log(this.permissionList);
		// const data = JSON.parse(JSON.stringify(tree));
		// const parentId: EmptyArrayType = [];

		// for (let item of data) {
		// 	for (let x of ids) {
		// 		if (item.id === x) {
		// 			result.push(item);
		// 			parentId.push(item.parentId);

		// 			if (item.parentId !== '-1') {
		// 				this.createChildrenTreeByIds(parentId, tree, result);
		// 			}
		// 		}
		// 	}
		// }

		// // result = tree.map(({ children: child, ...r }) => ({ children: (<EmptyArrayType>child).filter((i) => idSet.has(i.id)), ...r }));

		// console.log(result);
		return result;
	}
}

export const global = new Global();

export const G = new Global();

export default Global;
