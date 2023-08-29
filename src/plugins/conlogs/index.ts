/**
 * @description 返回这个样式的颜色值
 * @param {String} type 样式名称 [ primary | success | warning | danger | text ]
 */
const typeColor = (type: string = 'default'): string => {
	let color = '';
	switch (type) {
		case 'default':
			color = '#35495E';
			break;
		case 'primary':
			color = '#3488ff';
			break;
		case 'success':
			color = '#43B883';
			break;
		case 'warning':
			color = '#e6a23c';
			break;
		case 'danger':
			color = '#f56c6c';
			break;
		default:
			break;
	}
	return color;
};

/**
 * @description 打印一个 [ title | text ] 样式的信息
 * @param {String} title title text
 * @param {String} info info text
 * @param {String} type style
 */
export const capsule = (title: string, info: string, type: string = 'primary') => {
	console.log(
		`%c ${title} %c ${info} %c`,
		'background:#35495E; padding: 3px 1px; border-radius: 3px 0 0 3px; color: #fff;',
		`background:${typeColor(type)}; padding: 3px 1px; border-radius: 0 3px 3px 0;  color: #fff;`,
		'background:transparent'
	);
};

/**
 * @description 打印一个 [ title | text | time ] 样式的信息
 * @param {String} title title text
 * @param {String} info info text
 * @param {String} time info text
 * @param {String} type style
 */
export const more = (title: string, info: string, time: string, type: string = 'primary') => {
	console.log(
		`%c ${title} %c ${info} %c ${time}`,
		`background:${typeColor(`warning`)}; padding: 3px 1px; border-radius: 3px 0 0 3px; color: #fff;`,
		`background:${typeColor(type)}; padding: 3px 1px; border-radius: 0;  color: #fff;`,
		`background:${typeColor(`default`)}; padding: 3px 1px; border-radius: 0 3px 3px 0;  color: #fff;`
	);
};

/**
 * @description 打印彩色文字
 */
export const colorful = (textArr: Array<any>) => {
	console.log(`%c${textArr.map((t) => t.text || '').join('%c')}`, ...textArr.map((t) => `color: ${typeColor(t.type)};`));
};

/**
 * @description 打印 default 样式的文字
 */
export const defaults = (text: string) => {
	colorful([{ text }]);
};

/**
 * @description 打印 primary 样式的文字
 */
export const primary = (text: string) => {
	colorful([{ text, type: 'primary' }]);
};

/**
 * @description 打印 success 样式的文字
 */
export const success = (text: string) => {
	colorful([{ text, type: 'success' }]);
};

/**
 * @description 打印 warning 样式的文字
 */
export const warning = (text: string) => {
	colorful([{ text, type: 'warning' }]);
};

/**
 * @description 打印 danger 样式的文字
 */
export const danger = (text: string) => {
	colorful([{ text, type: 'danger' }]);
};

interface LogInterface {
	capsule: (title: string, info: string, type: string) => any;
	more: (title: string, info: string, time: string, type: string) => any;
	colorful: (textArr: Array<any>) => any;
	defaults: (text: string) => any;
	primary: (text: string) => any;
	success: (text: string) => any;
	warning: (text: string) => any;
	danger: (text: string) => any;
}

/**
 * @description 实现自定义前端日志
 * @method capsule  打印一个 [ title | text ] 样式的信息
 * @method more     打印一个 [ title | text | time ] 样式的信息
 * @method colorful 打印彩色文字
 * @method defaults 打印 default 样式的文字
 * @method primary  打印 primary 样式的文字
 * @method success  打印 success 样式的文字
 * @method warning  打印 warning 样式的文字
 * @method danger   打印 danger 样式的文字
 */
class Logs implements LogInterface {
	capsule(title: string, info: string, type?: string) {
		capsule(title, info, type);
	}

	more(title: string, info: string, time: string, type?: string) {
		more(title, info, time, type);
	}

	colorful(textArr: any[]) {
		colorful(textArr);
	}

	defaults(text: string) {
		defaults(text);
	}

	primary(text: string) {
		primary(text);
	}

	success(text: string) {
		success(text);
	}

	warning(text: string) {
		warning(text);
	}

	danger(text: string) {
		danger(text);
	}
}

export default new Logs();
