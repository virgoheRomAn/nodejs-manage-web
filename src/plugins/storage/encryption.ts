import { Base64 } from 'js-base64';

// 混入密钥
const secretKey = 'ZBJ_XJQ_999';

/**
 * @description 基于 Base64 字符混淆
 * @author virgoheRomAn
 * @date 2021-07-14
 */
class Encrypt {
	base64: any = Base64;

	/**
	 * @description 加密
	 * @param {String | Number} str 需要加密的值
	 * @returns
	 */
	encryptionByBase64(str: any): string | null {
		let eStr: string = this.base64.encode(str);
		let prand: string | number = '';

		for (let i = 0; i < secretKey.length; i++) {
			prand += secretKey.charCodeAt(i).toString();
		}

		let sPos: number = Math.floor(prand.length / 5);
		let mult: number = parseInt(
			prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5)
		);
		let incr: number = Math.ceil(secretKey.length / 2);
		let modu: number = Math.pow(2, 31) - 1;

		if (mult < 2) {
			console.error('请选择更复杂或更长的密码.');
			return null;
		}

		let salt: number | string = Math.round(Math.random() * 1000000000) % 100000000;
		prand += salt;

		while (prand.length > 10) {
			prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
		}

		prand = (mult * parseFloat(prand) + incr) % modu;

		let enc_chr: number = 0;
		let enc_str: string = '';

		for (let i = 0; i < eStr.length; i++) {
			enc_chr = parseInt((eStr.charCodeAt(i) ^ Math.floor((prand / modu) * 255)).toString());

			if (enc_chr < 16) {
				enc_str += '0' + enc_chr.toString(16);
			} else {
				enc_str += enc_chr.toString(16);
			}

			prand = (mult * prand + incr) % modu;
		}

		salt = salt.toString(16);

		while (salt.length < 8) {
			salt = '0' + salt;
		}

		enc_str += salt;

		return enc_str;
	}

	/**
	 * @description 解密
	 * @param {String | Number} str 需要解密的值
	 * @returns
	 */
	decryptionByBase64(str: any): any {
		let prand: string | number = '';

		for (let i = 0; i < secretKey.length; i++) {
			prand += secretKey.charCodeAt(i).toString();
		}

		let sPos: number = Math.floor(prand.length / 5);
		let mult: number = parseInt(
			prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5)
		);
		let incr: number = Math.round(secretKey.length / 2);
		let modu: number = Math.pow(2, 31) - 1;
		let salt: number = parseInt(str.substring(str.length - 8, str.length), 16);

		str = str.substring(0, str.length - 8);
		prand += salt;

		while (prand.length > 10) {
			prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
		}

		prand = (mult * parseFloat(prand) + incr) % modu;

		let enc_chr: number = 0;
		let enc_str: string = '';

		for (let i = 0; i < str.length; i += 2) {
			const data: number = parseInt(str.substring(i, i + 2), 16) ^ Math.floor((prand / modu) * 255);
			enc_chr = parseInt(data.toString());
			enc_str += String.fromCharCode(enc_chr);
			prand = (mult * prand + incr) % modu;
		}

		return this.base64.decode(enc_str);
	}
}

export const encyrpt = new Encrypt();

export default Encrypt;
