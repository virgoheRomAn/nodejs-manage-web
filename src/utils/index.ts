// @ts-nocheck
import Base from './base';
import Data from './data';
import Datetime from './datetime';
import Global from './global';
import Validate from './validate';
import { MixClass } from './extends';

// 定义接口类型
interface UtilInterface extends Base, Data, Datetime, Global, Validate {}

// 继承多类
class Utils extends MixClass(Base, Data, Datetime, Global, Validate) implements UtilInterface {
	constructor() {
		super();
	}

	/**
	 * @description 合并类
	 * @param  {...any} args
	 */
	extendClass(...args: EmptyArrayType) {
		MixClass(...args);
	}
}

export const util: UtilInterface = new Utils();
export const U: UtilInterface = new Utils();
export default window.__U__ = U;
