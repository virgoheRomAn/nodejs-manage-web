import { data } from '/@/utils/data';
import { jrDict, jrEnum } from './jrboss/enum';
import { xdDict, xdEnum } from './xdboss/enum';
import { jfManageEnum, jfManageDict } from './jfmanage/enum';
import { useDatabase } from '/@/stores/modules/databse';

/**
 * @description 数据字典集合
 * @author virgoheRomAn
 * @date 2021-07-13
 */
class Const {
	public jrDict = jrDict;
	public jrEnum = jrEnum;
	public xdDict = xdDict;
	public xdEnum = xdEnum;
	public jfManageEnum = jfManageEnum;
	public jfManageDict = jfManageDict;

	// 布尔类型 [是否]
	public ChooseBoolean: Array<object> = [
		{ code: true, text: '是' },
		{ code: false, text: '否' }
	];

	// 数字类型 [是否]
	public ChooseNumber: Array<object> = [
		{ code: 1, text: '是' },
		{ code: 0, text: '否' }
	];

	// 字符串类型 [是否]
	public ChooseString: Array<object> = [
		{ code: '1', text: '是' },
		{ code: '0', text: '否' }
	];

	// 数字类型 [禁用、启用]
	public ChooseNumberStatus: Array<object> = [
		{ code: 0, text: '禁用' },
		{ code: 1, text: '启用' }
	];

	constructor() {}

	/**
	 * @description 将枚举转换成数组
	 * @param enums 枚举
	 * @returns
	 */
	enumToArray(enums: Enumerator): Array<any> {
		let map: { code: string | number; text: any }[] = [];

		for (let n in enums) {
			map.push({ code: n, text: <any>enums[n] });
		}

		return map;
	}

	/**
	 * @description 筛选数据字典
	 * @param {String} dictCode 筛选字典的 code
	 * @param {String} productConfig 产品配置
	 * @param {Array} result
	 * @returns
	 */
	filterDicts(dictCode: string, productConfig: EmptyObjectType | null, result: any[] = []) {
		if (!dictCode) return result;
		const database = useDatabase();
		const { dicts } = database.dict as DictIterface;

		if (!dicts) {
			throw new Error('获取数组字典错误！');
		}

		const filterDicts = dicts.filter((item) => item.type === dictCode);
		const fieldDicts = productConfig ? (productConfig.dicts as any[]).find((item) => item.dictType === dictCode) : null;

		data.formatPickerData(filterDicts, 'codeDesc', 'code').forEach((item) => {
			// 没有对应的数字据字典
			if (!fieldDicts) {
				result.push(item);
			} else {
				fieldDicts.dictIds.split(',').forEach((x: string) => {
					if (x === item.id.toString()) {
						result.push(item);
					}
				});
			}
		});

		return result;
	}

	/**
	 * @description 通过产品id 筛选数据字典
	 * @param {String} dictCode 筛选字典的 code
	 * @param {String} productId 筛选字段需要的产品 id
	 * @param {Array} result
	 * @returns
	 */
	filterDictsByProId(dictCode: string, productId: string, result: any[] = []) {
		if (!dictCode) return result;
		const database = useDatabase();
		const { dicts, fields } = database.dict as DictIterface;

		if (!dicts) {
			throw new Error('获取数组字典错误！');
		}

		const filterDicts = dicts.filter((item) => item.type === dictCode);
		const fieldDicts = fields.find((item) => item.productNum === productId && item.dictType === dictCode);

		data.formatPickerData(filterDicts, 'codeDesc', 'code').forEach((item) => {
			// 没有对应的数字据字典
			if (!fieldDicts) {
				result.push(item);
			} else {
				(fieldDicts.dictId.split(',') as any[]).forEach((x) => {
					if (x === item.id.toString()) {
						result.push(item);
					}
				});
			}
		});

		return result;
	}

	/**
	 * @description 城市树
	 * @returns
	 */
	cityData = () => {
		const database = useDatabase();
		return database.area;
	};

	/**
	 * @description 地址信息的原始数据
	 * @returns
	 */
	getSourceArea = () => {
		const database = useDatabase();
		return database.areaSource;
	};
}

export const C = new Const();

export default window.__C__ = C;
