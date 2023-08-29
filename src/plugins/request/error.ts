import { jBox } from '/@/plugins/jBox';

/**
 * @description 生成错误
 * @author virgoheRomAn
 * @date 2021-12-25
 */
class CustomError {
	constructor(public toast: any) {
		this.toast = toast;
	}

	/**
	 * @description 提示错误信息
	 * @param {Error} error 页面提示错误信息
	 * @param {Object} serviceError 抛出服务器返回 错误信息
	 */
	errorLogs(error: Error, serviceError: any): Error {
		this.toast.error(error.message);
		throw new Error(serviceError.message);
	}

	/**
	 * @description 创建错误信息
	 * @param {String} message 页面显示错误信息
	 * @param {String} serviceError 服务器返回的错误信息
	 */
	errorCreate(message: string, serviceError?: any): void {
		const error: Error = new Error(message);
		this.errorLogs(error, serviceError);
	}
}

export const err: CustomError = new CustomError(jBox);

export default CustomError;
