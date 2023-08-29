/**
 * 验证百分比（不可以小数）
 * @param val 当前值字符串
 * @returns 返回处理后的字符串
 */
export function verifyNumberPercentage(val: string): string {
	// 匹配空格
	let v = val.replace(/(^\s*)|(\s*$)/g, '');
	// 只能是数字和小数点，不能是其他输入
	v = v.replace(/[^\d]/g, '');
	// 不能以0开始
	v = v.replace(/^0/g, '');
	// 数字超过100，赋值成最大值100
	v = v.replace(/^[1-9]\d\d{1,3}$/, '100');
	// 返回结果
	return v;
}

/**
 * 验证百分比（可以小数）
 * @param val 当前值字符串
 * @returns 返回处理后的字符串
 */
export function verifyNumberPercentageFloat(val: string): string {
	let v = verifyNumberIntegerAndFloat(val);
	// 数字超过100，赋值成最大值100
	v = v.replace(/^[1-9]\d\d{1,3}$/, '100');
	// 超过100之后不给再输入值
	v = v.replace(/^100\.$/, '100');
	// 返回结果
	return v;
}

/**
 * 小数或整数(不可以负数)
 * @param val 当前值字符串
 * @returns 返回处理后的字符串
 */
export function verifyNumberIntegerAndFloat(val: string) {
	// 匹配空格
	let v = val.replace(/(^\s*)|(\s*$)/g, '');
	// 只能是数字和小数点，不能是其他输入
	v = v.replace(/[^\d.]/g, '');
	// 以0开始只能输入一个
	v = v.replace(/^0{2}$/g, '0');
	// 保证第一位只能是数字，不能是点
	v = v.replace(/^\./g, '');
	// 小数只能出现1位
	v = v.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
	// 小数点后面保留2位
	v = v.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
	// 返回结果
	return v;
}

/**
 * 正整数验证
 * @param val 当前值字符串
 * @returns 返回处理后的字符串
 */
export function verifiyNumberInteger(val: string) {
	// 匹配空格
	let v = val.replace(/(^\s*)|(\s*$)/g, '');
	// 去掉 '.' , 防止贴贴的时候出现问题 如 0.1.12.12
	v = v.replace(/[\.]*/g, '');
	// 去掉以 0 开始后面的数, 防止贴贴的时候出现问题 如 00121323
	v = v.replace(/(^0[\d]*)$/g, '0');
	// 首位是0,只能出现一次
	v = v.replace(/^0\d$/g, '0');
	// 只匹配数字
	v = v.replace(/[^\d]/g, '');
	// 返回结果
	return v;
}

/**
 * 去掉中文及空格
 * @param val 当前值字符串
 * @returns 返回处理后的字符串
 */
export function verifyCnAndSpace(val: string) {
	// 匹配中文与空格
	let v = val.replace(/[\u4e00-\u9fa5\s]+/g, '');
	// 匹配空格
	v = v.replace(/(^\s*)|(\s*$)/g, '');
	// 返回结果
	return v;
}

/**
 * 去掉英文及空格
 * @param val 当前值字符串
 * @returns 返回处理后的字符串
 */
export function verifyEnAndSpace(val: string) {
	// 匹配英文与空格
	let v = val.replace(/[a-zA-Z]+/g, '');
	// 匹配空格
	v = v.replace(/(^\s*)|(\s*$)/g, '');
	// 返回结果
	return v;
}

/**
 * 禁止输入空格
 * @param val 当前值字符串
 * @returns 返回处理后的字符串
 */
export function verifyAndSpace(val: string) {
	// 匹配空格
	let v = val.replace(/(^\s*)|(\s*$)/g, '');
	// 返回结果
	return v;
}

/**
 * 金额用 `,` 区分开
 * @param val 当前值字符串
 * @returns 返回处理后的字符串
 */
export function verifyNumberComma(val: string) {
	// 调用小数或整数(不可以负数)方法
	let v: any = verifyNumberIntegerAndFloat(val);
	// 字符串转成数组
	v = v.toString().split('.');
	// \B 匹配非单词边界，两边都是单词字符或者两边都是非单词字符
	v[0] = v[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	// 数组转字符串
	v = v.join('.');
	// 返回结果
	return v;
}

/**
 * 匹配文字变色（搜索时）
 * @param val 当前值字符串
 * @param text 要处理的字符串值
 * @param color 搜索到时字体高亮颜色
 * @returns 返回处理后的字符串
 */
export function verifyTextColor(val: string, text = '', color = 'red') {
	// 返回内容，添加颜色
	let v = text.replace(new RegExp(val, 'gi'), `<span style='color: ${color}'>${val}</span>`);
	// 返回结果
	return v;
}

/**
 * 数字转中文大写
 * @param val 当前值字符串
 * @param unit 默认：仟佰拾亿仟佰拾万仟佰拾元角分
 * @returns 返回处理后的字符串
 */
export function verifyNumberCnUppercase(val: any, unit = '仟佰拾亿仟佰拾万仟佰拾元角分', v = '') {
	// 当前内容字符串添加 2个0，为什么??
	val += '00';
	// 返回某个指定的字符串值在字符串中首次出现的位置，没有出现，则该方法返回 -1
	let lookup = val.indexOf('.');
	// substring：不包含结束下标内容，substr：包含结束下标内容
	if (lookup >= 0) val = val.substring(0, lookup) + val.substr(lookup + 1, 2);
	// 根据内容 val 的长度，截取返回对应大写
	unit = unit.substr(unit.length - val.length);
	// 循环截取拼接大写
	for (let i = 0; i < val.length; i++) {
		v += '零壹贰叁肆伍陆柒捌玖'.substr(val.substr(i, 1), 1) + unit.substr(i, 1);
	}
	// 正则处理
	v = v
		.replace(/零角零分$/, '整')
		.replace(/零[仟佰拾]/g, '零')
		.replace(/零{2,}/g, '零')
		.replace(/零([亿|万])/g, '$1')
		.replace(/零+元/, '元')
		.replace(/亿零{0,3}万/, '亿')
		.replace(/^元/, '零元');
	// 返回结果
	return v;
}

/**
 * 手机号码
 * @param val 当前值字符串
 * @returns 返回 true: 手机号码正确
 */
export function verifyPhone(val: string) {
	// false: 手机号码不正确
	if (!/^((12[0-9])|(13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0|1,5-9]))\d{8}$/.test(val)) return false;
	// true: 手机号码正确
	else return true;
}

/**
 * 国内电话号码
 * @param val 当前值字符串
 * @returns 返回 true: 国内电话号码正确
 */
export function verifyTelPhone(val: string) {
	// false: 国内电话号码不正确
	if (!/\d{3}-\d{8}|\d{4}-\d{7}/.test(val)) return false;
	// true: 国内电话号码正确
	else return true;
}

/**
 * 登录账号 (字母开头，允许5-16字节，允许字母数字下划线)
 * @param val 当前值字符串
 * @returns 返回 true: 登录账号正确
 */
export function verifyAccount(val: string) {
	// false: 登录账号不正确
	if (!/^[a-zA-Z][a-zA-Z0-9_]{4,15}$/.test(val)) return false;
	// true: 登录账号正确
	else return true;
}

/**
 * 密码 (以字母开头，长度在6~16之间，只能包含字母、数字和下划线)
 * @param val 当前值字符串
 * @returns 返回 true: 密码正确
 */
export function verifyPassword(val: string) {
	// false: 密码不正确
	if (!/^[a-zA-Z]\w{5,15}$/.test(val)) return false;
	// true: 密码正确
	else return true;
}

/**
 * 强密码 (字母+数字+特殊字符，长度在6-16之间)
 * @param val 当前值字符串
 * @returns 返回 true: 强密码正确
 */
export function verifyPasswordPowerful(val: string) {
	// false: 强密码不正确
	if (!/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&\.*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&\.*]+$)(?![\d!@#$%^&\.*]+$)[a-zA-Z\d!@#$%^&\.*]{6,16}$/.test(val))
		return false;
	// true: 强密码正确
	else return true;
}

/**
 * 密码强度
 * @param val 当前值字符串
 * @description 弱：纯数字，纯字母，纯特殊字符
 * @description 中：字母+数字，字母+特殊字符，数字+特殊字符
 * @description 强：字母+数字+特殊字符
 * @returns 返回处理后的字符串：弱、中、强
 */
export function verifyPasswordStrength(val: string) {
	let v = '';
	// 弱：纯数字，纯字母，纯特殊字符
	if (/^(?:\d+|[a-zA-Z]+|[!@#$%^&\.*]+){6,16}$/.test(val)) v = '弱';
	// 中：字母+数字，字母+特殊字符，数字+特殊字符
	if (/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&\.*]+$)[a-zA-Z\d!@#$%^&\.*]{6,16}$/.test(val)) v = '中';
	// 强：字母+数字+特殊字符
	if (/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&\.*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&\.*]+$)(?![\d!@#$%^&\.*]+$)[a-zA-Z\d!@#$%^&\.*]{6,16}$/.test(val))
		v = '强';
	// 返回结果
	return v;
}

/**
 * IP地址
 * @param val 当前值字符串
 * @returns 返回 true: IP地址正确
 */
export function verifyIPAddress(val: string) {
	// false: IP地址不正确
	if (
		!/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(
			val
		)
	)
		return false;
	// true: IP地址正确
	else return true;
}

/**
 * 邮箱
 * @param val 当前值字符串
 * @returns 返回 true: 邮箱正确
 */
export function verifyEmail(val: string) {
	// false: 邮箱不正确
	if (
		!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
			val
		)
	)
		return false;
	// true: 邮箱正确
	else return true;
}

/**
 * 身份证
 * @param val 当前值字符串
 * @returns 返回 true: 身份证正确
 */
export function verifyIdCard(val: string) {
	// false: 身份证不正确
	if (!/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(val)) return false;
	// true: 身份证正确
	else return true;
}

/**
 * 姓名
 * @param val 当前值字符串
 * @returns 返回 true: 姓名正确
 */
export function verifyFullName(val: string) {
	// false: 姓名不正确
	if (!/^[\u4e00-\u9fa5]{1,6}(·[\u4e00-\u9fa5]{1,6}){0,2}$/.test(val)) return false;
	// true: 姓名正确
	else return true;
}

/**
 * 邮政编码
 * @param val 当前值字符串
 * @returns 返回 true: 邮政编码正确
 */
export function verifyPostalCode(val: string) {
	// false: 邮政编码不正确
	if (!/^[1-9][0-9]{5}$/.test(val)) return false;
	// true: 邮政编码正确
	else return true;
}

/**
 * url 处理
 * @param val 当前值字符串
 * @returns 返回 true: url 正确
 */
export function verifyUrl(val: string) {
	// false: url不正确
	if (
		!/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
			val
		)
	)
		return false;
	// true: url正确
	else return true;
}

/**
 * 车牌号
 * @param val 当前值字符串
 * @returns 返回 true：车牌号正确
 */
export function verifyCarNum(val: string) {
	// false: 车牌号不正确
	if (
		!/^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(
			val
		)
	)
		return false;
	// true：车牌号正确
	else return true;
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string): boolean {
	return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str: string): boolean {
	const valid_map = ['admin', 'editor'];
	return valid_map.indexOf(str.trim()) >= 0;
}

/**
 * 检查是否是手机号
 * @param rule
 * @param value
 * @param callback
 */
export function checkPhone(rule: any, value: any, callback: any): void {
	let reg = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
	if (!reg.test(value)) {
		callback(new Error('请输入正确的手机号码'));
	} else {
		callback();
	}
}

/**
 * 校验手机号或座机
 * @param rule
 * @param value
 * @param callback
 */
export function checkAllPhone(rule: any, value: any, callback: any): void {
	let reg = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
	let reg1 = /^(0[0-9]{2,3}-)?[0-9]{7,8}$/;
	if (!reg.test(value) && !reg1.test(value)) {
		callback(new Error('请输入正确的手机号码或座机号码'));
	} else {
		callback();
	}
}

/**
 * 校验是否是身份证号
 * @param rule
 * @param value
 * @param callback
 */
export function checkID(rule: any, value: any, callback: any): void {
	let reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;
	if (!reg.test(value)) {
		callback(new Error('请输入正确的身份证号'));
	} else {
		callback();
	}
}

/**
 * 社会信用代码
 * @param rule
 * @param value
 * @param callback
 */
export function checkCreditCode(rule: any, value: any, callback: any): void {
	let reg = /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/;
	if (!reg.test(value)) {
		callback(new Error('统一社会信用代码格式有误！'));
	} else {
		callback();
	}
}

/**
 * Unicode编码中的汉字范围, 校验汉字姓名
 * @param rule
 * @param value
 * @param callback
 */
export function validateName(rule: any, value: any, callback: any): void {
	let reg = /^[\u2E80-\u9FFF]{2,10}$/;
	if (!reg.test(value)) {
		callback(new Error('名字只能输入汉字且长度为2-10个汉字！'));
	} else {
		callback();
	}
}

/**
 * 校验空格
 * @param rule
 * @param value
 * @param callback
 */
export function checkSpace(rule: any, value: any, callback: any): void {
	if (value.indexOf(' ') > -1) {
		callback(new Error('输入的内容中含有空格，请检查！'));
	} else {
		callback();
	}
}

/**
 * 只是简单正整数校验
 * @param rule
 * @param value
 * @param callback
 */
export function checkNumber(rule: any, value: any, callback: any): void {
	let reg = /^[0-9]*$/;
	if (!reg.test(value)) {
		callback(new Error('该输入框只能输入数字！'));
	} else {
		callback();
	}
}

/**
 * 校验电子邮箱
 * @param rule
 * @param value
 * @param callback
 */
export function checkEmail(rule: any, value: any, callback: any): void {
	let reg = /^[a-zA-Z0-9_-]+([_\.][A-Za-z0-9]+)*@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
	setTimeout(() => {
		if (!reg.test(value)) {
			callback(new Error('电子邮箱格式有误！'));
		} else {
			callback();
		}
	}, 1000);
}

/**
 * 校验最多两位小数的数字格式
 * @param rule
 * @param value
 * @param callback
 */
export function checkFloatNumber(rule: any, value: any, callback: any): void {
	let reg = /^[0-9]+([.]\d{1,2})?$/;
	if (!reg.test(value)) {
		callback(new Error('请输入数字，且最多只能有两位小数！'));
	} else {
		callback();
	}
}

/**
 * 由于后端会将估值字段为空的返回来为0，所以单独给渠道订单估值的那几个字段校验不能为0
 * @param rule
 * @param value
 * @param callback
 */
export function checkZero(rule: any, value: any, callback: any): void {
	if (value === 0) {
		callback(new Error('估价金额或审批金额不能为0！'));
	} else {
		callback();
	}
}

/**
 * 验证年利率 0 - 24%
 * @param rule
 * @param value
 * @param callback
 */
export function checkYearRate(rule: any, value: any, callback: any): void {
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
 * 金额必须大于 0
 * @param rule
 * @param value
 * @param callback
 */
export function greaterThanZero(rule: any, value: any, callback: any): void {
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
 * 输入的文案不能包含空格
 * @param rule
 * @param value
 * @param callback
 */
export function checkSpaceText(rule: any, value: any, callback: any): void {
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
 * 验证确认密码
 * @param rule
 * @param value
 * @param callback
 */
export function validateAgainPassword(rule: any, value: any, callback: any): void {
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
