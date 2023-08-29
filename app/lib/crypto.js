'user strict';

/**
 * @description 数据加密
 * @author virgoheRomAn
 * @date 2023-05-05
 */
const CryptoJS = require('crypto-js');

class AES {
	constructor(secretKey = `sNlhZfG7LzkC7lZSButTgi3cD7GJNnU4`) {
		// 加密密钥
		this.secretKey = secretKey;
	}

	/**
	 * @description 加密
	 * @param {String} content 需要加密的内容
	 */
	encrypt(content) {
		const key = CryptoJS.enc.Utf8.parse(this.secretKey);
		const encryptResult = CryptoJS.AES.encrypt(content, key, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		}).toString();

		return encodeURIComponent(encryptResult);
	}

	/**
	 * @description 解密
	 * @param {String} content 加密之后的内容
	 */
	decrypt(content) {
		content = decodeURIComponent(content);

		const key = CryptoJS.enc.Utf8.parse(this.secretKey);
		const decryptResult = CryptoJS.AES.decrypt(content, key, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		}).toString(CryptoJS.enc.Utf8);

		return decryptResult;
	}
}

module.exports = AES;
