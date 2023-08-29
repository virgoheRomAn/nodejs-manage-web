import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import config from '/@/config';
import jBoxToast from './jBoxToast/index.js';

let loadingGlobalId: any = '';

const closeToastCall = Symbol('closeToastCall');

class MessageBox {
	public isElementToast: boolean = config.isElementToast;
	public isElementMessageBox: boolean = config.isElementMessageBox;
	public duration: number = config.toastDuration;
	public hasMask: boolean = config.toastMask;

	// 自动关闭轻提示回调方法
	[closeToastCall](duration: number, callback: any): void {
		setTimeout(() => {
			ElMessage.closeAll();
			callback?.call();
		}, duration);
	}

	// 加载数据
	loading(text: string, { hasMask = this.hasMask } = {}): any {
		let loading: any;

		if (this.isElementToast) {
			loadingGlobalId = loading = ElLoading.service({ text, background: 'transparent', spinner: '', customClass: 'custom-loading-mask' });
		} else {
			loadingGlobalId = loading = jBoxToast.loading(text, { element: { mask: hasMask } });
		}

		return loading;
	}

	// 纯文本提示
	info(message: string, closeCallback?: Function, { duration = this.duration, hasMask = this.hasMask }: any = {}): void {
		if (this.isElementToast) {
			ElMessage.info({ message, duration });
			this[closeToastCall](duration, closeCallback);
		} else {
			jBoxToast.alert(message, { close_time: duration, element: { mask: hasMask }, closeCallback });
		}
	}

	// 警告提示
	waring(message: string, closeCallback?: Function, { duration = this.duration, hasMask = this.hasMask }: any = {}): void {
		if (this.isElementToast) {
			ElMessage.warning({ message, duration });
			this[closeToastCall](duration, closeCallback);
		} else {
			jBoxToast.waring(message, { close_time: duration, element: { mask: hasMask }, closeCallback });
		}
	}

	// 错误提示
	error(message: string, closeCallback?: Function, { duration = 3000, hasMask = this.hasMask }: any = {}): void {
		if (this.isElementToast) {
			ElMessage.error({ message, duration });
			this[closeToastCall](duration, closeCallback);
		} else {
			jBoxToast.error(message, { close_time: duration, element: { mask: hasMask }, closeCallback });
		}
	}

	// 纯文本提示
	success(message: string, closeCallback?: Function, { duration = this.duration, hasMask = this.hasMask }: any = {}): void {
		if (this.isElementToast) {
			ElMessage.success({ message, duration });
			this[closeToastCall](duration, closeCallback);
		} else {
			jBoxToast.success(message, { close_time: duration, element: { mask: hasMask }, closeCallback });
		}
	}

	// 手动关闭loading
	closeLoading(loading?: any, callback?: any): void {
		if (this.isElementToast) {
			loading.close();
			callback?.call();
		} else {
			jBoxToast.close(callback);
		}
	}

	// 手动关闭提示
	close(callback?: any): void {
		if (this.isElementToast) {
			ElMessage.closeAll();
			callback?.call();
		} else {
			jBoxToast.close(callback);
		}
	}

	// 关闭指定id的弹层
	closeById(loadingId: any, callback?: any): void {
		if (this.isElementToast) {
			loadingId.close();
			callback?.call();
		} else {
			jBoxToast.closeById(loadingId, callback);
		}
	}

	// 全部关闭
	closeAll(callback?: any): void {
		if (this.isElementToast) {
			loadingGlobalId && loadingGlobalId.close();
			ElMessage.closeAll();
			callback?.call();
		} else {
			jBoxToast.closeAll(callback);
		}
	}

	// 警告框
	warn(text: string, title?: string, option?: any): void {
		if (this.isElementMessageBox) {
			ElMessageBox.alert(text, title, Object.assign(option, { confirmButtonText: '确定', cancelButtonText: '取消' }));
		} else {
			jBoxToast.warn(text, title, option);
		}
	}

	// 确认信息
	confirm(text: string, title?: string, option?: any): void {
		if (this.isElementMessageBox) {
			ElMessageBox.confirm(text, title, Object.assign(option, { confirmButtonText: '确定', cancelButtonText: '取消' }));
		} else {
			jBoxToast.confirm(text, title, option);
		}
	}

	// 输入信息
	prompt(text: string, title?: string, option?: any): void {
		if (this.isElementMessageBox) {
			ElMessageBox.prompt(text, title, Object.assign(option, { confirmButtonText: '确定', cancelButtonText: '取消' }));
		} else {
			jBoxToast.prompt(text, title, option);
		}
	}
}

export const jBox = new MessageBox();

export default jBox;
