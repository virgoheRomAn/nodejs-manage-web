'use strict';

/**
 * @description 应用相关配置
 * @author virgoheRomAn
 * @date 2021-12-24
 */
interface ApplicationInterface {
	successCode: Array<any>;
	isElementToast: boolean;
	isElementMessageBox: boolean;
	toastMask: boolean;
	toastDuration: number;
}

// 定义主题配置，用于覆盖
export const theme = {
	// 是否开启侧边栏 Logo
	isShowLogo: false,
	// 是否开启 Footer 底部版权信息
	isFooter: false,
	// 是否开启灰色模式
	isGrayscale: false,
	// 是否开启色弱模式
	isInvert: false
};

export default <ApplicationInterface>{
	// 操作正常code，支持String、Array、int多种类型
	successCode: ['SUCCESS'],

	// 是否使用 ElementUI 轻提示
	isElementToast: true,
	// 是否使用 ElementUI MessageBox 提示
	isElementMessageBox: false,
	// 轻提示遮罩
	toastMask: true,
	// 轻提示持续时间
	toastDuration: 1500,

	...theme
};
