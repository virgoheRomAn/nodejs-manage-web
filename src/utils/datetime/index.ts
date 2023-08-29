import dayjs from 'dayjs';
import { global } from '../global';

/**
 * @description 日期类
 * @author virgoheRomAn
 * @date 2021-07-12
 */
class Datetime {
	dayjs: any;

	constructor() {
		this.dayjs = dayjs;
	}

	/**
	 * @description 返回某年某月的天数
	 * @param {String} date 日期年月
	 * @returns
	 */
	getCountDays(date: string | Date): string | number {
		let curDate: Date = new Date(date);
		let curMonth: number = curDate.getMonth();
		curDate.setMonth(curMonth + 1);
		curDate.setDate(0);

		return curDate.getDate();
	}

	/**
	 * @description 通过毫秒格式换时间
	 * @param {Number | String} time 时间字符串 时间毫秒
	 * @param {String} type 格式时间类型
	 * @param {String} split 格式时间的字符
	 * @returns
	 */
	getFormatDateByTime(time: string | Date, type: string, split: string = '-'): any {
		let _date_: Date = !!time ? new Date(time) : new Date();
		let year: number = _date_.getFullYear();
		let month: number = _date_.getMonth() + 1;
		let date: number = _date_.getDate();
		let h: number = _date_.getHours();
		let m: number = _date_.getMinutes();
		let s: number = _date_.getSeconds();

		switch (type) {
			case 'split':
				return { year, month: global.zero(month, 2), date: global.zero(date, 2) };
			case 'hour':
				return `${global.zero(h, 2)}:${global.zero(m, 2)}`;
			case 'time':
				return `${global.zero(h, 2)}:${global.zero(m, 2)}:${global.zero(s, 2)}`;
			case 'date':
				return `${year}-${global.zero(month, 2)}-${global.zero(date, 2)}`;
			case 'dateStr':
				return `${year}年${global.zero(month, 2)}月${global.zero(date, 2)}日`;
			case 'dateSplit':
				return `${year}${split}${global.zero(month, 2)}${split}${global.zero(date, 2)}`;
			case 'full':
				return `${year}年${global.zero(month, 2)}月${global.zero(date, 2)}日 ${global.zero(h, 2)}:${global.zero(m, 2)}:${global.zero(s, 2)}`;
			default:
				return `${year}-${global.zero(month, 2)}-${global.zero(date, 2)} ${global.zero(h, 2)}:${global.zero(m, 2)}:${global.zero(s, 2)}`;
		}
	}

	/**
	 * @description 格式化时间
	 * @param {Number | String} time
	 * @param {String} cFormat 格式化模式
	 * @returns {string | null}
	 */
	formatDatetime(time: Date | string | number = new Date(), format: string = '{y}-{m}-{d} {h}:{i}:{s}'): string | number | null {
		if (arguments.length === 0) {
			return null;
		}

		let date: Date;

		if (typeof time === 'object') {
			date = time;
		} else {
			if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
				time = parseInt(time);
			}
			if (typeof time === 'number' && (<string | number>time).toString().length === 10) {
				time = time * 1000;
			}
			date = new Date(time);
		}

		const formatObj: EmptyObjectType = {
			y: date.getFullYear(),
			m: date.getMonth() + 1,
			d: date.getDate(),
			h: date.getHours(),
			i: date.getMinutes(),
			s: date.getSeconds(),
			w: date.getDay(),
			a: date.getDay()
		};

		return format.replace(/{([ymdhiswa])+}/g, (result, key) => {
			let value = formatObj[key];

			if (key === 'w') {
				return ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][value];
			}

			if (key === 'a') {
				return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][value];
			}

			value = global.zero(value, 2);
			return value || 0;
		});
	}

	/**
	 * @description 获取最近时间
	 * @param {Number} day 附近几天
	 * @param {String} format 格式化模式
	 * @returns
	 */
	getDayWithFormat(day: number, format: string): string | number | null {
		const today = new Date();
		const targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
		today.setTime(targetday_milliseconds);

		return this.formatDatetime(today, format);
	}

	/**
	 * @description 获取最近时间数组
	 * @param {Number | Object} day 附近几天
	 * @param {String} format 格式化模式
	 * @param {Date | String} time 指定时间
	 * @returns
	 */
	getDatetimeArrayWithFormat(day: number | EmptyObjectType, time: Date | string, format: string): EmptyArrayType {
		let days: EmptyArrayType = [];
		const date: Date = !!time ? (typeof time === 'object' ? time : new Date(time)) : new Date();

		// day 为对象模式 {start:1, end:3} 当前日期前面一天 后面三天
		if (typeof day === 'object') {
			for (let i = -day.start; i < day.end + 1; i++) {
				let dateItem = new Date(date.getTime() + i * 24 * 60 * 60 * 1000);
				days.push(this.formatDatetime(dateItem, format));
			}
		} else {
			for (let i = 0; i < 24 * day; i += 24) {
				let dateItem = new Date(date.getTime() + i * 60 * 60 * 1000);
				days.push(this.formatDatetime(dateItem, format));
			}
		}

		return days;
	}

	/**
	 * @description 倒计时
	 * @param {Number | Object} start 开始时间
	 * @param {Number | Object} end 技术时间
	 * @param {String} format 格式化模式
	 * @returns
	 */
	getCutdownDatetime({ start, end, differ }: EmptyObjectType = {}, format: string = '{y}-{m}-{d} {h}:{i}:{s}'): string | boolean {
		let diffTime: number = 0;

		if (!differ) {
			const startTime: Date = new Date(start);
			const endTime: Date = new Date(end);

			diffTime = endTime.getTime() - startTime.getTime();
		} else {
			diffTime = differ;
		}

		if (diffTime <= 0) return false;

		const formatObj: EmptyObjectType = {
			d: Math.floor(diffTime / (1000 * 60 * 60 * 24)),
			h: Math.floor((diffTime / (1000 * 60 * 60)) % 24),
			i: Math.floor((diffTime / (1000 * 60)) % 60),
			s: Math.floor((diffTime / 1000) % 60)
		};

		return format.replace(/{([ymdhis])+}/g, (result, key) => {
			let value = formatObj[key];

			value = global.zero(value, 2);
			return value || 0;
		});
	}

	/**
	 * 将时间转换为 `几秒前`、`几分钟前`、`几小时前`、`几天前`
	 * @param param 当前时间，new Date() 格式或者字符串时间格式
	 * @param format 需要转换的时间格式字符串
	 * @description param 10秒：  10 * 1000
	 * @description param 1分：   60 * 1000
	 * @description param 1小时： 60 * 60 * 1000
	 * @description param 24小时：60 * 60 * 24 * 1000
	 * @description param 3天：   60 * 60* 24 * 1000 * 3
	 * @returns 返回拼接后的时间字符串
	 */
	formatPast(param: string | Date, format: string = 'YYYY-mm-dd'): string | number | null {
		// 传入格式处理、存储转换值
		let t: any;
		let s: number;
		// 获取js 时间戳
		let time: number = new Date().getTime();
		// 是否是对象
		typeof param === 'string' || 'object' ? (t = new Date(param).getTime()) : (t = param);
		// 当前时间戳 - 传入时间戳
		time = Number.parseInt(`${time - t}`);
		if (time < 10000) {
			// 10秒内
			return '刚刚';
		} else if (time < 60000 && time >= 10000) {
			// 超过10秒少于1分钟内
			s = Math.floor(time / 1000);
			return `${s}秒前`;
		} else if (time < 3600000 && time >= 60000) {
			// 超过1分钟少于1小时
			s = Math.floor(time / 60000);
			return `${s}分钟前`;
		} else if (time < 86400000 && time >= 3600000) {
			// 超过1小时少于24小时
			s = Math.floor(time / 3600000);
			return `${s}小时前`;
		} else if (time < 259200000 && time >= 86400000) {
			// 超过1天少于3天内
			s = Math.floor(time / 86400000);
			return `${s}天前`;
		} else {
			// 超过3天
			let date = typeof param === 'string' || 'object' ? new Date(param) : param;
			return this.formatDatetime(date, format);
		}
	}

	/**
	 * 时间问候语
	 * @param param 当前时间，new Date() 格式
	 * @description param 调用 `formatAxis(new Date())` 输出 `上午好`
	 * @returns 返回拼接后的时间字符串
	 */
	formatAxis(param: Date): string {
		let hour: number = new Date(param).getHours();
		if (hour < 6) return '凌晨好！';
		else if (hour < 9) return '早上好！';
		else if (hour < 12) return '上午好！';
		else if (hour < 14) return '中午好！';
		else if (hour < 17) return '下午好！';
		else if (hour < 19) return '傍晚好！';
		else if (hour < 22) return '晚上好！';
		else return '夜里好！';
	}
}

export const datetime = new Datetime();

export const DT = new Datetime();

export default Datetime;
