/**
 * @description 拷贝类
 * @param {Object} target
 * @param {Object} source
 */
function copyProperties(target: any, source: EmptyDataType): void {
	for (let key of Reflect.ownKeys(source)) {
		if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
			let desc: any = Object.getOwnPropertyDescriptor(source, key);
			Object.defineProperty(target, key, desc);
		}
	}
}

/**
 * @description 多重继承类
 * @param {...any} Mixins
 * @returns
 */
export const MixClass: any = (...Mixins: EmptyDataType): any => {
	class Mix {
		constructor() {
			for (let Mixin of Mixins) {
				copyProperties(this, new Mixin()); // 拷贝实例属性
			}
		}
	}

	for (let Mixin of Mixins) {
		copyProperties(Mix, Mixin); // 拷贝静态属性
		copyProperties(Mix.prototype, Mixin.prototype); // 拷贝原型属性
	}

	return Mix;
};
