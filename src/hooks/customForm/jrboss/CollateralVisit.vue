<template>
	<LayoutDialog ref="dialogRef" isHeaderClose :editor="editor" :isChange="isChange" @submit="submitForm" @change="submitForm">
		<template #header>{{ title }}</template>

		<template #render v-if="isRender">
			<el-form
				ref="ruleFormRef"
				class="form-box form-box--long is-no-margin-right"
				:class="{ 'form-box-validate': editor, 'form-box-view': !editor }"
				:validate-on-rule-change="false"
				:model="form.formData"
				:rules="form.rulesData"
				:inline="false"
				label-width="130px"
			>
				<FormFieldsLayout
					ref="formFieldsLayoutRef"
					:isView="!editor"
					:editor="editor"
					:showFields="form.showFields"
					:formData="form.formData"
					:rulesData="form.rulesData"
					@cascaderChange="cascaderChange"
				/>
			</el-form>
		</template>
	</LayoutDialog>
</template>

<script setup lang="ts" name="jrBossCustomFormCollateralVisit">
import { U } from '/@/utils';
import { C } from '/@/dicts';
import { settings } from '/@/plugins/settings';
import { RenderCollateralVisitFieldsInit } from './renderFields';
import { disabledFields, setRenderFieldByData, setRenderFormByAjaxData } from '/@/hooks/customForm/useFormFields';

const props = defineProps({
	configKey: { type: String, default: '' },
	form: { type: Object as PropType<EmptyObjectType>, default: null },
	routeParams: { type: Object as PropType<EmptyObjectType>, default: null },
	formConfig: { type: Object as PropType<EmptyObjectType>, default: null },
	productConfig: { type: Object as PropType<EmptyObjectType>, default: null }
});

const emit = defineEmits(['submit', 'update:form']);

const isRender = ref(false);
const title = ref('');
const editor = ref(true);
const isChange = ref(false);
const number = ref(0);
const conifg = ref<EmptyObjectType>({});
const form = reactive({
	showFields: RenderCollateralVisitFieldsInit(editor.value, props.routeParams),
	subFormConfig: {} as EmptyObjectType,
	formData: {} as EmptyObjectType,
	rulesData: {} as EmptyObjectType
});

const dialogRef = ref();
const ruleFormRef = ref();

// 打开弹窗
const openDialog = (key: string, data: EmptyObjectType, row: any, index: number) => {
	nextTick(() => {
		switch (key) {
			case 'tableDetails':
				title.value = `查看抵押物回访信息`;
				break;
		}

		// 设置数据
		setRenderFormByAjaxData(form, form.formData, form.showFields, { data: row });

		number.value = index;
		editor.value = key !== 'tableDetails';
		isChange.value = key === 'tableChange';
		isRender.value = true;

		// 生成规则
		form.rulesData = !editor.value ? {} : U.createRuleData(form.showFields);
	});

	ruleFormRef.value?.clearValidate();
	dialogRef.value.open();
};

// 关闭弹窗
const closeDialog = () => {
	isRender.value = false;
	dialogRef.value.close();
};

// 级联选择
const cascaderChange = (code: Array<any>, text: Array<any>, key: string, item: EmptyObjectType) => {};

// 设置赋值
const setFormRenderByData = (data: EmptyObjectType) => {
	for (let key in form.formData) {
		// 获取渲染字段
		const showField = U.getObjectItemByKey({ value: form.showFields }, key);

		// 时间戳
		if (showField.timestamp) {
			form.formData[key] = U.isFalse(data[key]) ? (U.isArray(form.formData[key]) ? [] : '') : U.getFormatDateByTime(data[key], 'date');
			continue;
		}

		// 渲染含有子表单同时数组模式渲染
		if (showField.render === 'array' && !!showField.subFormRenderKey) {
			const { formatField, value } = showField;
			const finallyField = U.clone(formatField);
			U.emptyArray(value);
			form.formData[key] = U.isFalse(data[key]) ? (U.isArray(form.formData[key]) ? [] : '') : data[key];

			form.formData[key].forEach(() => {
				value.push(U.clone(finallyField));
			});
			continue;
		}

		// 城市级联
		if (showField.cascader) {
			const sourceArea = C.getSourceArea();
			const codeArray = sourceArea.map((x) => x.value);
			const hasCityCode = showField.valueField.every((x: any) => codeArray.includes(data[x]));
			const result = U.compactArray(showField.valueField.map((x: any) => data[x]));
			form.formData[showField.cascader.ref] = !hasCityCode ? [] : result;
			continue;
		}

		// 图片渲染给 value 赋值 充当初始值
		if (showField.isUpload) {
			showField.value = U.isFalse(data[key]) ? (U.isArray(form.formData[key]) ? [] : '') : data[key];
		}

		form.formData[key] = U.isFalse(data[key]) ? (U.isArray(form.formData[key]) ? [] : '') : data[key];
	}
};

watch(
	() => props,
	(val: EmptyObjectType) => {
		const { configKey, formConfig, productConfig } = val;
		conifg.value = formConfig[configKey];

		if (!!conifg.value && Object.keys(conifg.value).length > 0) {
			// 生成表单
			form.formData = U.formatFormData(form.showFields, { cutting: false, submit: true });
			// 设置大表单
			Object.keys(productConfig).length > 0 && setRenderFieldByData(form, form.showFields, conifg.value, productConfig);
		}
	},
	{ immediate: false, deep: true }
);

onMounted(() => {
	// 隐藏字段
	disabledFields(form.showFields);
});

/**
 * 弹窗确认方法
 */
async function submitForm() {
	const result = U.clone(form.formData);
	const formData = props.form;
	const configKey = props.configKey;

	if (!ruleFormRef.value) return;

	await ruleFormRef.value.validate(async (valid: boolean, fields: any) => {
		if (valid) {
			if (isChange.value) {
				formData[configKey].splice(number.value, 1, result);
			} else {
				formData[configKey].push(result);
			}

			emit('update:form', formData);
			closeDialog();
		} else {
			if (!!fields) {
				const errMsg = Object.values(fields as EmptyObjectType)[0][0].message;
				jBox.error(errMsg);
			}
		}
	});
}

// 绑定提交
const submit = () => {
	emit('submit', ruleFormRef.value, isChange.value, props.configKey, number.value, form.formData, form.rulesData);
};

// 绑定提交
const change = () => {
	emit('submit', ruleFormRef.value, isChange.value, props.configKey, number.value, form.formData, form.rulesData);
};

// 暴露变量
defineExpose({ openDialog, closeDialog });
</script>
