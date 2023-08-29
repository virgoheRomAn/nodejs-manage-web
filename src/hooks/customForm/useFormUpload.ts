import { post } from '/@/plugins/request';

/**
 * @description 生成上传图片方案
 * @param options 上传的参数
 * @param uploadServerCall 上传方法
 * @param uploadResult 上传结果回掉函数
 * @param uploadExtra 上传类型对象的扩展
 * @param extra 扩展字段
 * @returns
 */
export function fileUploadOptions(
	options = {} as EmptyObjectType,
	uploadExtra = {},
	extra = {},
	uploadServerCall: Fn = post,
	downloadServerCall?: Fn
): EmptyObjectType {
	let uploads: EmptyObjectType = {
		fileReg: '',
		accept: '',
		valueType: options.valueType ?? 'jsonArray',
		uploadServerCall,
		downloadServerCall,
		...uploadExtra
	};

	if (options.isOnlyPDF) {
		uploads.fileReg = options.fileReg ?? '(pdf)$';
		uploads.accept = options.accept ?? 'application/pdf';
		uploads.uploadType = 'fileUpload';
		uploads.fileUpload = {
			isPreview: false,
			isFileList: true,
			tips: options.tips ?? '仅支持pdf文件',
			isTips: options.isTips ?? false,
			isMultiple: options.isMultiple ?? true,
			errorTips: options.errorTips ?? '请上传PDF文件'
		};
	} else if (options.isOnlyExcel) {
		uploads.fileReg = options.fileReg ?? '(xls|xlsx|csv)$';
		uploads.accept = options.accept ?? '.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
		uploads.uploadType = 'fileUpload';
		uploads.fileUpload = {
			isPreview: false,
			isFileList: true,
			isTips: options.isTips ?? false,
			isMultiple: options.isMultiple ?? true,
			tips: options.tips ?? '仅支持excel文件',
			errorTips: options.errorTips ?? '请上传 EXCEL 文件'
		};
	} else if (options.isImage) {
		uploads.fileReg = options.fileReg ?? '(jpg|jpeg|png)$';
		uploads.accept = options.accept ?? 'image/*';
		uploads.uploadType = 'imageUpload';
		uploads.imageUpload = {
			isMultiple: options.isMultiple ?? false,
			showFilename: options.showFilename ?? false,
			isTips: options.isTips ?? false,
			errorTips: options.errorTips ?? '请上传 jpg png 图片文件'
		};
	} else if (options.isImageOrPdf) {
		uploads.fileReg = options.fileReg ?? '(jpg|jpeg|png|pdf)$';
		uploads.accept = options.accept ?? 'application/pdf, image/*';
		uploads.uploadType = 'fileUpload';
		uploads.fileUpload = {
			isPreview: false,
			isFileList: true,
			isTips: options.isTips ?? false,
			isMultiple: options.isMultiple ?? true,
			tips: options.tips ?? '支持 jpg png pdf 文件，不超过 20Mb',
			errorTips: options.errorTips ?? '请上传 jpg png pdf 文件'
		};
	} else if (options.isFile) {
		uploads.fileReg = options.fileReg ?? '(jpg|jpeg|png|pdf|rar|zip|xls|xlsx|csv)$';
		uploads.accept =
			options.accept ??
			'image/*, application/pdf, application/rar, .rar, application/x-zip-compressed,.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
		uploads.uploadType = 'fileUpload';
		uploads.fileUpload = {
			isPreview: false,
			isFileList: true,
			isTips: options.isTips ?? false,
			isMultiple: options.isMultiple ?? true,
			tips: options.tips ?? '支持 jpg png pdf rar zip excel 文件，不超过 20Mb',
			errorTips: options.errorTips ?? '请上传文件'
		};
	}

	return { ...uploads, ...extra };
}
