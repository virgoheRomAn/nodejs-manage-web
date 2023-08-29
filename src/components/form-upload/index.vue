<template>
	<div class="upload-bar">
		<div class="upload-bar__preview">
			<!-- 文件上传模式 -->
			<template v-if="uploadType === 'fileUpload'">
				<!-- 普通上传 -->
				<div class="upload-bar__btn" v-if="editor && previewFileList.length < uploadLimit.max">
					<el-button class="upload-bar__btn--cont" v-bind="fileUploadBtn">
						<span>{{ `上传${fileUpload.text}` }}</span>
						<input type="file" :accept="uploadLimit.accept" :multiple="fileUpload.isMultiple" @change="change($event)" />
					</el-button>
					<span class="upload-bar__btn--tips" v-if="fileUpload.isTips">{{ fileUpload.tips }}</span>
				</div>

				<!-- 替换附件 -->
				<div class="upload-bar__btn" v-else-if="editor && isReplace && max === 1">
					<el-button class="upload-bar__btn--cont" v-bind="fileUploadBtn">
						<span>{{ `替换${fileUpload.text}` }}</span>
						<input type="file" :accept="uploadLimit.accept" @change="replace($event)" />
					</el-button>
					<span class="upload-bar__btn--tips" v-if="fileUpload.isTips">{{ fileUpload.tips }}</span>
				</div>

				<div class="upload-bar__filelist" v-if="fileUpload.isFileList && previewFileList.length > 0">
					<ul>
						<template v-for="(item, index) in previewFileList" :key="index">
							<li :class="{ mb15: previewFileList.length >= 4 }" v-if="!fileUpload.isSimpleList">
								<div class="upload-bar__filelist--item" :class="{ 'upload-bar__mark--red': item.mark }">
									<!-- 图片模式预览 -->
									<template v-if="item.isImage">
										<div class="filelist-type filelist-image">
											<el-image fit="cover" :src="item.fileUrl" :preview-src-list="multipleShowUrlList">
												<template #error>
													<div class="image-slot error">
														<SvgIcon name="ele-PictureFilled" />
													</div>
												</template>
												<template #placeholder>
													<div class="image-slot loading">
														<SvgIcon name="ele-Loading" />
													</div>
												</template>
											</el-image>

											<label class="filelist-image--handler">
												<SvgIcon name="ele-ZoomIn" @click="showPreview(formKey, multipleShowUrlList.indexOf(item.fileUrl), item)" />
											</label>
										</div>
									</template>

									<!-- 其他文件 -->
									<template v-else>
										<div class="filelist-type"><img :src="item.fileUrl" /></div>
									</template>

									<el-tooltip :disabled="item.fileName.length < 16" effect="dark" :content="item.fileName" placement="top">
										<label>{{ item.fileName }}</label>
									</el-tooltip>

									<div class="upload-bar__filelist--handle">
										<el-button type="primary" size="small" @click="downloadFileCall(item, item.fileToken, index)">下载</el-button>
										<el-button type="danger" size="small" v-if="item.editor" @click="deleteFileItem(item, index)">删除</el-button>
									</div>
								</div>
							</li>
							<li class="is-no-border" v-else>
								<div class="upload-bar__filelist--simple" :class="{ 'upload-bar__mark--red': item.mark }">
									<el-tooltip :disabled="item.fileName.length < 16" effect="dark" :content="item.fileName" placement="top">
										<label>{{ item.fileName }}</label>
									</el-tooltip>

									<el-button type="primary" size="small" @click="downloadFileCall(item, item.fileToken, index)">下载</el-button>
									<el-button type="danger" size="small" v-if="item.editor" @click="deleteFileItem(item, index)">删除</el-button>
								</div>
							</li>
						</template>
					</ul>
				</div>
			</template>

			<!-- 图片上传模式 -->
			<template v-else-if="uploadType === 'imageUpload'">
				<div class="upload-bar__image">
					<span class="upload-bar__image--tips" v-if="imageUpload.tips && imageUpload.isTips">{{ imageUpload.tips }}</span>
					<ul>
						<li v-for="(item, index) in previewFileList" :key="index">
							<div class="upload-bar__preview--cont" :class="{ 'upload-bar__mark--red': item.mark }">
								<!-- 图片模式预览 -->
								<template v-if="item.isImage">
									<el-image fit="cover" :src="item.fileUrl" :preview-src-list="multipleShowUrlList">
										<template #error>
											<div class="image-slot error">
												<SvgIcon name="ele-PictureFilled" />
											</div>
										</template>
										<template #placeholder>
											<div class="image-slot loading">
												<SvgIcon name="ele-Loading" />
											</div>
										</template>
									</el-image>
								</template>

								<!-- 其他文件 -->
								<template v-else>
									<div class="upload-bar__preview--filelist"><img :src="item.fileUrl" /></div>
								</template>

								<label class="upload-bar__preview--handler">
									<template v-if="item.isImage">
										<SvgIcon name="ele-ZoomIn" @click="showPreview(formKey, multipleShowUrlList.indexOf(item.fileUrl), item)" />
									</template>
									<template v-if="!item.isImage">
										<SvgIcon name="ele-Download" @click="downloadFileCall(item, item.fileToken, index)" />
									</template>

									<!-- 多张图片 读取出来的图片不可以删除 -->
									<SvgIcon name="ele-Delete" v-if="imageUpload.isMultiple && item.editor" @click="deleteFileItem(item, index)" />
									<!-- 单张图片不需要有删除 -->
									<SvgIcon name="ele-Delete" v-if="!imageUpload.isMultiple && editor" @click="deleteFileItem(item, index)" />
								</label>
							</div>

							<div v-if="imageUpload.showFilename" class="upload-bar__preview--filename">
								<el-tooltip :disabled="item.fileName.length < 16" effect="dark" :content="item.fileName" placement="top">
									<label>{{ item.fileName }}</label>
								</el-tooltip>
							</div>
						</li>

						<template v-if="imageUpload.isMultiple || previewFileList.length !== 1">
							<li class="multiple" v-if="editor && previewFileList.length < uploadLimit.max">
								<label class="upload-bar__button">
									<SvgIcon name="ele-Plus" />
									<span class="u-mt-5">{{ `上传${imageUpload.text}` }}</span>
									<input type="file" :accept="uploadLimit.accept" :multiple="imageUpload.isMultiple" @change="change($event)" />
								</label>
							</li>
						</template>
					</ul>
				</div>
			</template>

			<!-- 全局提示 -->
			<div class="upload-bar--tips" v-if="isGlobalTips">
				<label>{{ fileUpload.tips }}</label>
			</div>
		</div>

		<LayoutPreview
			:ref="
				(el) => {
					if (el) previewRef[formKey] = el;
				}
			"
			:preview="{ srcList: multipleShowUrlList }"
		/>
	</div>
</template>
<script setup lang="ts" name="vhmFormUpload">
import type {
	ResultFormDataType,
	UploadResultData,
	UploadLimit,
	CurrentFileInfo,
	UploadFileInterface,
	UploadImageInterface,
	UploadCompleteResult
} from './src/type';
import lrz from 'lrz';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { post } from '/@/plugins/request';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { getFileToken, downOssFile } from '/@/api/file';

const props = defineProps({
	// 是否开启读取的文件不可以删除[去掉删除按钮] 新上传的文件可以删除
	openUploadedDelete: { type: Boolean, default: false },
	// 是否可以编辑[去掉删除按钮]
	editor: { type: Boolean, default: true },
	// 限制个数
	max: { type: Number, default: 5 },
	// 限制大小 MB
	limit: { type: Number, default: 20 },
	// 限制格式
	fileReg: { type: String, default: '(jpg|jpeg|png)$' },
	// 文件上传格式
	accept: { type: String, default: 'image/*' },
	// 是否开去全局提示
	isGlobalTips: { type: Boolean, default: false },
	// 是否压缩
	lrz: { type: Boolean, default: true },
	// 是否替换文件  max需要为1
	isReplace: { type: Boolean, default: false },
	// 是否返回 Base64
	isBase64: { type: Boolean, default: false },
	// 上传类型 [imageUpload | fileUpload]
	uploadType: { type: String, default: 'imageUpload' },
	// 上传完成后返回的格式 [jsonArray | array | string | json]
	valueType: { type: String, default: 'jsonArray' },
	// 当前组件的标识
	formKey: { type: String, default: '' },
	// 当前绑定的form
	form: { type: null, default: null },
	// 当前绑定的form
	showFields: { type: Object as PropType<EmptyObjectType>, default: () => ({}) },
	// 文件上传
	fileUpload: { type: Object as PropType<UploadFileInterface>, default: () => ({}) },
	// 图片上传
	imageUpload: { type: Object as PropType<UploadImageInterface>, default: () => ({}) },
	// 返回数据设置
	completeResult: { type: Object as PropType<UploadCompleteResult>, default: () => ({}) },
	// 上传的方法
	uploadServerCall: { type: Function, default: null },
	// 下载方法
	downloadServerCall: { type: Function, default: null }
});

const emit = defineEmits(['uploadComplete', 'uploadDelete']);

const baseUrl = import.meta.env.VITE_API_BASEURL;
const imageSuiffx = ['jpg', 'jpeg', 'png', 'gif', 'jfif'];
const fileTypeImage = {
	pdf: new URL(`../../assets/icon/icon_pdf.png`, import.meta.url).href,
	doc: new URL(`../../assets/icon/icon_doc.png`, import.meta.url).href,
	docx: new URL(`../../assets/icon/icon_doc.png`, import.meta.url).href,
	xls: new URL(`../../assets/icon/icon_xls.png`, import.meta.url).href,
	xlsx: new URL(`../../assets/icon/icon_xls.png`, import.meta.url).href,
	zip: new URL(`../../assets/icon/icon_zip.png`, import.meta.url).href,
	rar: new URL(`../../assets/icon/icon_zip.png`, import.meta.url).href,
	file: new URL(`../../assets/icon/icon_file.png`, import.meta.url).href,
	html: new URL(`../../assets/icon/icon_html.png`, import.meta.url).href
};

// 上传地址
const uploadUrls = 'https://up.qiniu.com';
// 上传服务器方法
const uploadFileServerCall = props.uploadServerCall ?? post;
// 下载文件方法
const downloadFileServerCall = props.downloadServerCall ?? downOssFile;

// 文件上传对象
const fileUpload = reactive<UploadFileInterface>({
	...{
		text: props.showFields.key || '',
		icon: 'ele-UploadFilled',
		type: 'primary',
		size: 'default',
		tips: '',
		errorTips: '',
		plain: false,
		round: false,
		isTips: false,
		isMultiple: true,
		isPreview: true,
		isSimpleList: false,
		isFileList: true
	},
	...props.fileUpload
});

// 图片上传对象
const imageUpload = reactive<UploadImageInterface>({
	...{
		text: props.showFields.key || '',
		tips: '',
		errorTips: '',
		isTips: false,
		isMultiple: false,
		showFilename: true
	},
	...props.imageUpload
});

// 公共的上传参数 [不区分图片还是文件]
const commonUpload = reactive({
	text: fileUpload.tips || imageUpload.text,
	tips: fileUpload.tips || imageUpload.tips,
	isTips: fileUpload.isTips || imageUpload.isTips,
	errorTips: fileUpload.errorTips || imageUpload.errorTips,
	isMultiple: fileUpload.isMultiple || imageUpload.isMultiple
});

// 返回页面的需要提交的数据格式
const arrayType = ['array'].includes(props.valueType);
const jsonArrayType = ['jsonArray'].includes(props.valueType);
const jsonType = ['json'].includes(props.valueType);
const stringType = ['string'].includes(props.valueType);
const resultFormDataType: ResultFormDataType = ['array', 'jsonArray'].includes(props.valueType) ? [] : jsonType ? {} : stringType ? '' : '';

/**
 * @description 返回结果
 * @param {String} current 当前需要展示的目标
 * @param {String} fileToken 当前文件的 token
 * @param {String} fileUrl 当前文件的 url
 * @param {Object} lrz 压缩情况
 * @param {Array}  showUrls  页面展示的上传之后文件 数组列表的格式 ["http://***", "http://***", ...]
 * @param {Object} fileData  返回页面上的文件信息
 */
const resultData = reactive<UploadResultData>({
	formKey: props.formKey,
	fileToken: {},
	fileUrl: {},
	current: {},
	lrz: {},
	fileData: {},
	showUrls: [],
	formData: resultFormDataType
});

// 上传限制 [个数 大小 类型 格式]
const uploadLimit = reactive<UploadLimit>({
	max: props.max,
	limit: props.limit,
	accept: props.accept,
	fileReg: props.fileReg,
	lrz: props.lrz
});

// 当前选择的文件信息
const currentFileInfo = reactive<{ [key: string]: CurrentFileInfo }>({});

// 存储上传文件的key 主要针对多张图标 给每张图片打上表示
const currentFileKeys = reactive({});

// 文件列表
const previewFileList = reactive<Array<any>>([]);

// 按钮属性
const fileUploadBtn = computed(() => ({ icon: fileUpload.icon, type: fileUpload.type, size: fileUpload.size, loading: fileUpload.loading }));
// 是否是替换文件上传
const isReplace = computed(() => props.isReplace && uploadLimit.max === 1);
// 展示列表过滤
const multipleShowUrlList = computed(() => U.compactArray(previewFileList.map((x) => !!x.isImage && x.fileUrl)));

// 预览组件
const previewRef = ref<RefType>({});

/**
 * @description 上传方法
 * @param {Object} e
 */
const change = (e: Event) => {
	const files = (e.target as HTMLInputElement).files as FileList;
	// const file = (e.target as HTMLInputElement).files![0];

	if (files.length > uploadLimit.max) {
		jBox.error(`上传文件个数大于限制个数 ${uploadLimit.max}`);
		(e.target as HTMLInputElement).value = '';
		return false;
	}

	let keyIndex = previewFileList.length + 1;

	for (let i = 0; i < files.length; i++) {
		const fileKey = `${props.formKey}_${keyIndex}`;
		const file = files[i];
		keyIndex++;
		file['fileKey'] = fileKey;

		const { fileReg, limit, lrz } = uploadLimit;
		let isImage = file.type.indexOf('image/') > -1;

		// excel word 等 使用 name 的后缀判断格式
		let fileSuffix = file.name.split('').reverse().join('').split('.')[0].split('').reverse().join('').toLowerCase();
		let fileType = isImage ? file.type : fileSuffix;

		if (!new RegExp(fileReg, 'gi').test(fileType)) {
			jBox.error(commonUpload.errorTips || `文件格式错误 当前文件格式 ${fileType}`);
			(e.target as HTMLInputElement).value = '';
			return false;
		}

		if (file.size > limit * 1024 * 1024) {
			jBox.error(`上传文件大于 ${limit} MB`);
			(e.target as HTMLInputElement).value = '';
			return false;
		}

		// 设置当前文件信息
		currentFileInfo[fileKey] = {
			icon: fileTypeImage[fileSuffix] ?? fileTypeImage['file'] ?? '',
			name: file.name ?? '',
			type: fileType,
			size: file.size,
			isImage
		};

		if (isImage && lrz) {
			lrzFile(file);
		} else {
			// 文件类型 直接上传
			uploadFileCall(file);
		}
	}

	// 清空当前上传组件的值，确保可以重复选择
	(e.target as HTMLInputElement).value = '';
};

/**
 * @description 替换文件
 * @param {Object} e
 */
const replace = (e: Event) => {
	change(e);
	deleteFileItem({}, 0);
};

/**
 * @description 压缩图片
 */
function lrzFile(file: EmptyObjectType) {
	const fileKey = file.fileKey;
	console.log(`图片-${file.name}-压缩前：${file.size / 1024} KB`);

	lrz(file)
		.then((rst: { fileLen: number; file: { name: any } }) => {
			console.log(`图片-${file.name}-压缩后：${rst.fileLen / 1024} KB`);
			// 存储压缩对象
			resultData.lrz[fileKey] = { isError: false, message: '压缩成功', file: rst.file, name: file.name };
			rst.file.name = file.name;
			rst.file['fileKey'] = fileKey;

			// File 转换 Base64 [不需要转换 返回原File]
			blobToDataURL(rst.file, () => {
				uploadFileCall(rst.file);
			});
		})
		.catch(() => {
			// 存储压缩对象
			resultData.lrz[fileKey] = { isError: true, message: '压缩失败', file: file, name: file.name };

			// File 转换 Base64 [不需要转换 返回原File]
			blobToDataURL(file, () => {
				uploadFileCall(file);
			});
		})
		.always(() => {});
}

/**
 * @description 文件转换成 base64 [不需要转换 返回原File]
 * @param {String} blob 上传的文件
 * @param {String} callback 转换成功之后的回调地址
 */
function blobToDataURL(blob: any, callback: Fn) {
	const reader = new FileReader();
	const fileKey = blob['fileKey'];

	// 不需要转换 则直接返回原文件
	if (!props.isBase64) {
		resultData.fileData[fileKey] = { file: blob, base64: false };
		callback && callback.call(reader, 'file', blob);

		return;
	}

	// 转换 base64
	reader.onload = (evt: Event) => {
		const base64 = (evt.target as EmptyObjectType).result;
		resultData.fileData[fileKey] = { file: blob, base64 };
		currentFileInfo[fileKey]['base64Data'] = base64;
		callback && callback.call(reader, 'base64', base64);
	};

	reader.readAsDataURL(blob);
}

/**
 * @description 上传文件
 * @param {String} file 上传的文件
 */
async function uploadFileCall(file: any) {
	let loading = jBox.loading('上传中...');
	let formData = new FormData();
	formData.append('file', file);

	try {
		const rs = await getFileToken({ filename: file.name });
		if (rs.code === 'SUCCESS') {
			let fileToken = rs.data.token;
			let key = rs.data.key;
			formData.append('token', fileToken);
			formData.append('key', key);

			const r = await uploadFileServerCall({ url: uploadUrls, params: formData, config: { headers: { type: 'qiniu' } }, type: false });
			if (r.code === 'SUCCESS') {
				jBox.closeById(loading, () => {
					jBox.success('上传成功！');
					renderUploadResult(rs.data, file, true);

					// File 转换 Base64 [不需要转换 返回原File]
					blobToDataURL(file, () => {
						// 回调函数
						emit('uploadComplete', { result: resultData, source: props });
					});
				});
			}
		}
	} catch (err) {
		console.error(err);
		jBox.closeById(loading, () => {
			jBox.error('上传失败，请重试！');
		});
	}
}

/**
 * @description 下载文件
 * @param {Object} item 当前项
 * @param {String} fileToken 下载的 token
 * @param {String} index 索引
 * @param {Function} callback 完成的回调函数
 */
async function downloadFileCall(item: EmptyObjectType, fileToken: string, index: number, isLoading = true, callback: Fn) {
	let loading = isLoading && jBox.loading('下载中...');

	try {
		let fileSuffix = fileToken.split('').reverse().join('').split('.')[0].split('').reverse().join('').toLowerCase();

		const rs = await downloadFileServerCall({ fileName: fileToken });
		if (rs.code === 'SUCCESS') {
			jBox.closeById(loading, () => {
				if (fileSuffix === 'txt') {
					window.open(`${rs.data}&attname=${item.fileName}.txt`, '_self');
				} else {
					window.open(`${rs.data}`);
				}
			});
		}
	} catch (err) {
		console.error(err);
		jBox.closeById(loading, () => {
			jBox.error('文件下载失败！');
		});
	}
}

/**
 * @description 渲染上传完成之后的数据
 * @param data 上传完成之后的数据
 * @param file 上传文件对象
 * @param isUpload 是上传模式还是读取模式
 */
function renderUploadResult(data: any, file: any, isUpload: boolean = true) {
	const extraField: EmptyObjectType = {};
	const fileKey = !!file ? file['fileKey'] : null;
	const { formatField, replaceField } = props.completeResult;

	// 如果有格式化的参数[回显阶段]
	if (formatField && !isUpload) {
		for (let key in formatField) {
			if (formatField[key].indexOf('%') > -1) {
				const rKey = formatField[key].replace(/^(%)([a-zA-Z]{1,})(%)$/gi, `$2`);
				extraField[key] = data[rKey];
			} else {
				extraField[key] = formatField[key];
			}
		}
	}

	const filepath = data.key || data.filepath || data.attachmentSerialNo || extraField.filepath;
	const fileSuffix = filepath.split('').reverse().join('').split('.')[0].split('').reverse().join('').toLowerCase();
	const filename = isUpload ? currentFileInfo[fileKey].name : data.filename || filepath;
	const fileIcon = isUpload ? currentFileInfo[fileKey].icon : fileTypeImage[fileSuffix] ?? fileTypeImage['file'] ?? '';
	const isImage = isUpload ? currentFileInfo[fileKey].isImage : imageSuiffx.includes(fileSuffix);
	const editor = isUpload ? true : props.openUploadedDelete ? data.editor : props.editor;

	// 填充赋值赋值
	let form = {
		fileKey,
		filename,
		filepath,
		fileUrl: `${window.location.origin}${baseUrl}file/redirect?fileName=${filepath}`,
		editor: true,
		...extraField
	};

	// 如果有需要替换添加的字段[提交阶段]
	if (replaceField && isUpload) {
		for (let key in replaceField) {
			form[key] = form[replaceField[key]];
		}
	}

	switch (props.valueType) {
		case 'string':
			emptyPreviewList(isUpload);

			// 返回的参数
			resultData.formData = form.filepath;
			break;
		case 'json':
			emptyPreviewList(isUpload);

			// 返回的参数
			resultData.formData = form;
			break;
		case 'array':
			// 返回的参数
			(resultData.formData as any[]).push(U.clone(form.filepath));
			break;
		case 'jsonArray':
			// 返回的参数
			(resultData.formData as any[]).push(U.clone(form));
			console.log(resultData.formData);
			break;
	}

	// 返回值
	resultData.fileToken[fileKey] = { fileToken: form.filepath };
	resultData.fileUrl[fileKey] = { fileUrl: form.fileUrl };
	resultData.showUrls.push(form.fileUrl);

	// 展示列表
	previewFileList.push({
		fileName: form.filename,
		fileToken: form.filepath,
		fileUrl: isImage ? form.fileUrl : fileIcon,
		isImage,
		editor,
		mark: data.mark ?? data.remark ?? false
	});
}

/**
 * @description 清空显示数据
 */
function emptyPreviewList(isUpload: boolean) {
	if (!isUpload) {
		// 清空展示列表
		U.emptyArray(previewFileList);
		// 清空返回的展示列表
		U.emptyArray(resultData.showUrls);
	}
}

/**
 * @description 显示预览图
 */
function showPreview(formKey: string, index: number, item: EmptyObjectType) {
	const ref = previewRef.value[formKey];
	ref.open(index);
}

/**
 * @description 删除文件列表
 * @param data 传入的数据
 * @param index 索引
 */
function deleteFileItem(data: any, index: number) {
	const fileKey = `${props.formKey}_${index + 1}`;
	if (fileKey) {
		delete resultData.fileToken[fileKey];
		delete resultData.fileUrl[fileKey];
	}
	previewFileList.splice(index, 1);
	resultData.showUrls.splice(index, 1);

	if (arrayType || jsonArrayType) {
		(resultData.formData as any[]).splice(index, 1);
	} else if (jsonType) {
		resultData.formData = {};
	} else {
		resultData.formData = '';
	}

	emit('uploadDelete', { result: resultData, source: props, index });
}

// props.showFields.value 作为初始值渲染回显数据
watch(
	() => props.showFields,
	(data) => {
		if (jsonArrayType) {
			emptyPreviewList(false);
			data.value.forEach((item: any, index: number) => !!item && renderUploadResult(item, { fileKey: `${props.formKey}_${index + 1}` }, false));
		}

		if (arrayType) {
			emptyPreviewList(false);
			data.value.forEach(
				(item: any, index: number) =>
					!!item && renderUploadResult({ filename: props.showFields.key, filepath: item }, { fileKey: `${props.formKey}_${index + 1}` }, false)
			);
		}

		if (jsonType) {
			if (!!U.isObject(data.value)) {
				renderUploadResult(data.value, { fileKey: `${props.formKey}_1` }, false);
			}
		}

		if (stringType) {
			if (!!U.isString(data.value)) {
				renderUploadResult({ filename: props.showFields.key, filepath: data.value }, { fileKey: `${props.formKey}_1}` }, false);
			}
		}
	},
	{ immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
@import '/@/style/mixins/index.scss';

.upload-bar {
	position: relative;
	display: flex;
	flex-direction: row;

	&__preview {
		flex: 1;
		font-size: 24px;
		color: #f5f5f6;

		// 预览文件
		&--filelist {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;
			padding: 15px;

			> img {
				display: block;
				width: 100%;
				height: 100%;
				object-fit: scale-down;
			}
		}

		// 操作按钮
		&--handler {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.4);
			display: none;
			align-items: center;
			justify-content: center;

			i {
				cursor: pointer;
				font-size: 24px !important;

				&:first-child {
					margin-right: 10px;
				}
			}
		}
	}

	// 图片模式上传的按钮
	&__button {
		position: relative;
		@extend %view;
		padding-top: 5px;
		border: 1px dashed var(--border-color-1);
		border-radius: 5px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden;

		i {
			font-size: 36px !important;
			color: var(--color-text-normal);
		}

		span {
			color: var(--color-text-sub);
			font-size: 13px;
			font-weight: 400;
		}

		input[type='file'] {
			@extend %position;
			opacity: 0;
		}
	}

	// 图片模式上传的预览
	&__image {
		&--tips {
			color: var(--color-text-sub);
			font-size: 14px;
		}

		ul {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			margin: 0;
			padding: 0;

			&.multiple-preview {
				li {
					margin-bottom: 10px;
				}
			}

			li {
				margin: 10px 15px 10px 0;

				&.more {
					width: auto;
					display: flex;
					align-items: center;
				}

				&.multiple {
					border: 0 none;
				}

				// 展示缩略图
				.upload-bar__preview--cont {
					@extend %view;
					border: 1px solid var(--border-color-1);
					border-radius: 5px;
					overflow: hidden;
					position: relative;

					&:hover {
						.upload-bar__preview--handler {
							display: flex;
						}
					}

					:deep(.el-image) {
						@extend %view;

						.image-slot {
							@extend %view;
							display: flex;
							align-items: center;
							justify-content: center;
							font-size: 12px;
							color: var(--color-text-sub);

							&.error {
								i {
									font-size: 80px !important;
								}
							}

							&.loading {
								i {
									font-size: 28px !important;
								}
							}
						}
					}
				}

				// 名字
				.upload-bar__preview--filename {
					display: block;
					width: $preview_width;
					height: 34px;
					margin-top: 8px;
					line-height: 17px;
					font-size: 14px;
					text-align: center;
					color: var(--color-text-normal);
					@include text-ellipsis(2);
				}
			}
		}
	}

	&__btn {
		& + .upload-bar__filelist {
			margin-top: 20px;
		}

		&--cont {
			position: relative;
		}

		&--tips {
			margin-left: 10px;
			color: var(--color-text-sub);
			font-size: 14px;
		}

		input[type='file'] {
			@extend %position;
			opacity: 0;
			width: 100%;
			height: 100%;
			cursor: pointer;
		}
	}

	&__filelist {
		position: relative;

		// 预览图片
		.el-image {
			@extend %block;

			.image-slot {
				@extend %block;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 12px;
				color: var(--color-text-sub);

				&.error {
					i {
						font-size: 50px !important;
					}
				}

				&.loading {
					i {
						font-size: 28px !important;
					}
				}
			}
		}

		> ul {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			padding-left: 0;
			margin: 0;

			li {
				width: 250px;
				margin: 0 15px 0 0;
				border: 1px solid var(--border-color-0);
				border-radius: 5px;

				&.is-no-border {
					border: 0 none;
				}
			}
		}

		&--simple {
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 8px;
			border-radius: 3px;
			background: var(--vhm-color-f5f5f6);

			label {
				font-size: 13px;
				line-height: 17px;
				color: var(--color-text-normal);
				flex: 1;
				padding: 0 15px 0 0;
				@include text-ellipsis(1);
				word-break: normal;
				word-wrap: break-word;
			}
		}

		&--item {
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 5px;

			> .filelist-type {
				position: relative;
				display: block;
				width: 50px;
				height: 60px;

				&.filelist-image {
					width: 60px;
					height: 60px;

					&:hover {
						.filelist-image--handler {
							display: flex;
						}
					}

					.filelist-image--handler {
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						padding: 0;
						background: rgba(0, 0, 0, 0.4);

						display: none;
						align-items: center;
						justify-content: center;

						i {
							cursor: pointer;
							color: var(--vhm-color-f5f5f6);
							font-size: 24px !important;
						}
					}
				}

				> img {
					display: block;
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}

			> .filelist-info {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				flex: 1;
				height: 50px;
			}

			label {
				font-size: 13px;
				line-height: 17px;
				color: var(--color-text-normal);
				flex: 1;
				padding: 0 15px 0;
				@include text-ellipsis(2);
				word-break: normal;
				word-wrap: break-word;
			}
		}

		&--handle {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-end;

			> .el-button {
				margin: 3px 0;
			}
		}
	}

	&__mark--red {
		position: relative;
		border: 1px solid var(--vhm-color-error) !important;

		&::before,
		&::after {
			position: absolute;
			content: '';
			display: block;
			width: 14px;
			height: 14px;
			border-radius: 50%;
			background: var(--el-color-white);
		}

		&::before {
			left: -7px;
		}

		&::after {
			right: -7px;
		}
	}

	// 全局提示
	&--tips {
		color: var(--color-text-sub);
		font-size: 14px;

		> label {
			color: var(--vhm-color-error);
		}
	}
}
</style>
