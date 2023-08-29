<template>
	<LayoutDialog
		ref="dialogRef"
		isFixed
		:fixed="{ width: '1000px', height: 'auto' }"
		isHeaderClose
		:editor="editor"
		:isChange="isChange"
		@submit="submitForm"
		@change="submitForm"
	>
		<template #header>{{ title }}</template>

		<template #render v-if="isRender">
			<el-form
				ref="ruleFormRef"
				class="form-box form-box--big is-no-margin-right"
				:class="{ 'form-box-validate': editor, 'form-box-view': !editor }"
				:validate-on-rule-change="false"
				:model="form.formData"
				:rules="form.rulesData"
				:inline="false"
				label-width="120px"
			>
				<FormFieldsLayout
					:renderLevel="1"
					:formSetting="{ cardContCls: 'flex-between' }"
					:isView="!editor"
					:editor="editor"
					:showFields="form.showFields"
					:formData="form.formData"
					:rulesData="form.rulesData"
				/>
			</el-form>
		</template>
	</LayoutDialog>
</template>

<script setup lang="ts" name="jfManagePermissionMenuDialog">
import { FormInstance } from 'element-plus';
import { U } from '/@/utils';
import { C } from '/@/dicts';
import { setRenderFormByAjaxData } from '/@/hooks/customForm/useFormFields';
import { saveAnnouncement } from '/@/api/jfmanage/notice';

const props = defineProps({
	menuTree: { type: Array as PropType<Array<any>>, default: () => [] }
});

const emit = defineEmits(['submit']);

const isRender = ref(false);
const title = ref('');
const editor = ref(true);
const isChange = ref(false);
const dialogRef = ref();
const ruleFormRef = ref<FormInstance>();
const formData = ref<EmptyObjectType>({});
const form = reactive({
	showFields: {
		dates: {
			key: '有效时间',
			value: [],
			startPlaceholder: '生效时间',
			endPlaceholder: '失效时间',
			setAjaxValue: ['startTime', 'endTime'],
			fieldValue: [{ startTime: { value: '', timestamp: true } }, { endTime: { value: '', timestamp: true } }],
			isNotTimestamp: true,
			isCutting: true,
			daterange: true,
			column: true
		},
		title: { key: '公告标题', value: '', column: true },
		content: { key: '公告内容', value: '', htmlVal: '', textVal: '', editorConfig: { maxLength: 2000 }, textEditor: true, column: true }
	},

	formData: {},
	rulesData: {}
});

// 打开弹窗
const openDialog = (type: string, row?: any) => {
	nextTick(() => {
		if (type === 'add') {
			U.emptyData(form.formData);
		}

		if (!!row) {
			formData.value = row;

			// 设置渲染数据
			setRenderFormByAjaxData(form, form.formData, form.showFields, { data: row });
		}

		title.value = type === 'add' ? '新增公告' : '编辑公告';
		editor.value = type !== 'details';
		isChange.value = type === 'edit';
		isRender.value = true;
	});

	ruleFormRef.value?.clearValidate();
	dialogRef.value.open();
};

// 关闭弹窗
const closeDialog = () => {
	isRender.value = false;
	dialogRef.value.close();
};

onMounted(() => {
	form.formData = U.formatFormData(form.showFields);
	form.rulesData = U.createRuleData(form.showFields);
});

/**
 * 弹窗确认方法
 */
async function submitForm() {
	if (!ruleFormRef.value) return;

	await ruleFormRef.value.validate(async (valid: boolean, fields: any) => {
		if (valid) {
			if (isChange.value) {
				form.formData['id'] = formData.value.id;
			}

			const rs = await saveAnnouncement(form.formData);

			if (rs.code === 'SUCCESS') {
				jBox.success(isChange.value ? '编辑公告成功！' : '新增公告成功！');
				closeDialog();

				emit('submit');
			}
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
	emit('submit', ruleFormRef.value, isChange.value, form.formData, form.rulesData);
};

// 修改
const change = () => {
	emit('submit', ruleFormRef.value, isChange.value, form.formData, form.rulesData);
};

// 暴露变量
defineExpose({ openDialog, closeDialog });
</script>
