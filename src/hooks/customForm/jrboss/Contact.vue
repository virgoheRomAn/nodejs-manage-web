<template>
	<LayoutDialog
		ref="dialogRef"
		isHeaderClose
		isFixed
		:fixed="{ width: '600px', height: 'auto' }"
		:editor="editor"
		:isChange="isChange"
		@submit="submitForm"
		@change="submitForm"
	>
		<template #header>{{ title }}</template>

		<template #render v-if="isRender">
			<el-form
				ref="ruleFormRef"
				class="form-box form-box--big"
				:class="{ 'form-box-validate': editor, 'form-box-view': !editor }"
				:validate-on-rule-change="false"
				:model="form.formData"
				:rules="form.rulesData"
				:inline="false"
				label-width="140px"
			>
				<FormFieldsLayout
					ref="formFieldsLayoutRef"
					:renderLevel="1"
					:formSetting="{ cardContCls: 'flex-between' }"
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

<script setup lang="ts" name="jrBossCustomFormContact">
import { U } from '/@/utils';
import { C } from '/@/dicts';
import { settings } from '/@/plugins/settings';
import { RenderContactFieldsInit } from './renderFields';
import { disabledFields, setRenderFieldByData } from '/@/hooks/customForm/useFormFields';

const props = defineProps({
	configKey: { type: String, default: '' },
	form: { type: Object as PropType<EmptyObjectType>, default: () => ({}) },
	routeParams: { type: Object as PropType<EmptyObjectType>, default: () => ({}) },
	formConfig: { type: Object as PropType<EmptyObjectType>, default: () => ({}) },
	productConfig: { type: Object as PropType<EmptyObjectType>, default: () => ({}) }
});

const emit = defineEmits(['submit', 'update:form']);

const isRender = ref(false);
const title = ref('');
const editor = ref(true);
const isChange = ref(false);
const number = ref(0);
const conifg = ref<EmptyObjectType>({});
const params = { ...props.routeParams, ...{ selectChangeCall } };
const form = reactive({
	showFields: RenderContactFieldsInit(editor.value, params),
	subFormConfig: {} as EmptyObjectType,
	formData: {} as EmptyObjectType,
	rulesData: {} as EmptyObjectType
});

const dialogRef = ref();
const ruleFormRef = ref();

// 打开弹窗
const openDialog = (key: string, data: EmptyObjectType, row: any, index: number, list: any) => {
	const isDelete = key === 'tableDelete';

	nextTick(() => {
		switch (key) {
			case 'tableAdd':
				title.value = `新增联系人`;
				break;
			case 'tableDetails':
				title.value = `查看联系人 - ${row.name}`;
				break;
			case 'tableChange':
				title.value = `编辑联系人 - ${row.name}`;
				break;
		}

		if (!isDelete) {
			// 自定义设置数据
			setFormRenderByData(row, list);

			number.value = index;
			editor.value = key !== 'tableDetails';
			isChange.value = key === 'tableChange';
			isRender.value = true;

			// 生成规则
			form.rulesData = !editor.value ? {} : U.createRuleData(form.showFields);
		} else {
			jBox.confirm(`是否确认删除联系人 「${row.name}」?`, '删除操作', {
				callback: async (action: any) => {
					if (!!action && action !== 'cancel') {
						const form = props.form;
						form[props.configKey].splice(index, 1);

						emit('update:form', form);
					}
				}
			});
		}
	});

	if (!isDelete) {
		ruleFormRef.value?.clearValidate();
		dialogRef.value.open();
	}
};

// 关闭弹窗
const closeDialog = () => {
	isRender.value = false;
	dialogRef.value.close();
};

// 选择联系人关系
function selectChangeCall(value: any, cRender: EmptyObjectType, pRender: EmptyObjectType) {
	pRender.companyPhone.isNotRenderShow = value !== '10';
	pRender.companyName.isNotRenderShow = value !== '10';
	pRender.idNo.isNotRenderShow = value !== '10';

	// 生成规则
	form.rulesData = U.createRuleData(form.showFields);
}

// 级联选择
const cascaderChange = (code: Array<any>, text: Array<any>, key: string, item: EmptyObjectType) => {};

// 设置赋值
const setFormRenderByData = (data: EmptyObjectType, list: any[]) => {
	for (let key in form.formData) {
		form.formData[key] = U.isFalse(data[key]) ? (U.isArray(form.formData[key]) ? [] : '') : data[key];
	}

	// 判断配偶信息
	const marital = props.form['user_marital'];
	const relationship = data['relationship'];
	const relationshipRender = form.showFields['relationship'];
	const companyName = form.showFields['companyName'];
	const companyPhone = form.showFields['companyPhone'];
	const idNo = form.showFields['idNo'];
	const allSelect = relationshipRender['allSelect'];

	// 看看其他联系人中有没有选择过配偶
	const isContactMarital = list.some((x: any) => x.relationship === '10');

	// 是否是配偶
	const isMarital = relationship === '10' && marital === '2';

	// 只有已婚才可以选择配偶
	if (marital === '2' && !isContactMarital) {
		relationshipRender.select = U.clone(allSelect);
	} else {
		if (relationship === '10') {
			relationshipRender.select = U.clone(allSelect);
		} else {
			relationshipRender.select = U.clone(allSelect).filter((x: any) => x.code !== '10');
		}
	}

	relationshipRender['disabled'] = isMarital;
	companyPhone.isNotRenderShow = relationship !== '10';
	companyName.isNotRenderShow = relationship !== '10';
	idNo.isNotRenderShow = relationship !== '10';
};

watch(
	() => props,
	(val: EmptyObjectType) => {
		const { configKey, formConfig, productConfig } = val;
		conifg.value = formConfig[configKey];
		if (Object.keys(conifg.value).length > 0) {
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
