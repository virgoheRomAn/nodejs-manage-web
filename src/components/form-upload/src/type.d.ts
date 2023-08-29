// 上传之后返回的数据类型
export type ResultFormDataType = EmptyObjectType | Array<any> | string;

// 上传完成后 对结果数据填充、格式化
export interface UploadCompleteResult {
	fillField: EmptyObjectType;
	formatField: EmptyObjectType;
	replaceField: EmptyObjectType;
	formatFormDataField: EmptyObjectType;
}

// 上传之后返回的数据
export interface UploadResultData {
	formKey: string;
	fileToken: EmptyObjectType;
	fileUrl: EmptyObjectType;
	current: EmptyObjectType;
	lrz: EmptyObjectType;
	fileData: EmptyObjectType;
	showUrls: Array<any>;
	formData: ResultFormDataType;
}

// 上传限制参数类型
export interface UploadLimit {
	max: number;
	limit: number;
	accept: string;
	fileReg: string;
	lrz: boolean;
}

// 当前选中的文件信息
export interface CurrentFileInfo {
	icon: string;
	name: string;
	type: string;
	size: number;
	isImage: boolean;
	base64Data?: any;
}

/**
 * @description fileUpload 文件上传格式设置
 * @param text       -- 上传按钮文字
 * @param tips       -- 上传提示文字
 * @param icon       -- 按钮 icon
 * @param type       -- 按钮 type
 * @param size       -- 按钮 size
 * @param plain      -- 按钮 plain
 * @param round      -- 按钮 round
 * @param isTips     -- 是否展示提示 默认：true
 * @param errorTips  -- 错误提示
 * @param loading    -- 按钮是否 loading
 * @param isMultiple -- 是否是多张
 * @param isPreview  -- 是否显示缩略图
 * @param isSimpleList  -- 极简展示
 * @param isFileList -- 是否展示上传之后的文件列表
 */
export interface UploadFileInterface {
	text: string;
	tips: string;
	icon: string;
	type: string;
	size: string;
	plain: boolean;
	round: boolean;
	isTips: boolean;
	errorTips: string;
	loading: boolean;
	isMultiple: boolean;
	isPreview: boolean;
	isSimpleList: boolean;
	isFileList: boolean;
}

/**
 * @description imageUpload 图片上传格式设置
 * @param text       		 -- 上传按钮文字
 * @param tips       		 -- 上传提示文字
 * @param isTips     		 -- 是否展示提示 默认：true
 * @param errorTips  		 -- 错误提示
 * @param isMultiple     -- 是否是多张
 * @param isShowFilename -- 是否显示文件名字
 */
export interface UploadImageInterface {
	text: string;
	tips: string;
	isTips: boolean;
	errorTips: string;
	isMultiple: boolean;
	isShowFilename: boolean;
}
