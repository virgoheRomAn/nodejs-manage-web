<template>
	<LayoutDialog ref="dialogRef" isHeaderClose :editor="false" isFixed :fixed="{ width: '700px', height: 'auto' }" model="waring">
		<template #header>对账详情</template>

		<template #render v-if="isRender">
			<el-form
				ref="ruleFormRef"
				class="form-box form-box--long form-box-view"
				:validate-on-rule-change="false"
				:model="form.formData"
				:rules="form.rulesData"
				:inline="false"
				label-width="170px"
			>
				<FormFieldsLayout
					isView
					:editor="false"
					:renderLevel="1"
					:formSetting="{ cardContCls: 'plr20' }"
					:showFields="form.showFields"
					:formData="form.formData"
					:rulesData="form.rulesData"
				/>
			</el-form>
		</template>
	</LayoutDialog>
</template>

<script setup lang="ts" name="ReconciliationDetails">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { fileUploadOptions } from '/@/hooks/customForm/useFormUpload';
import { setRenderFormByAjaxData } from '/@/hooks/customForm/useFormFields';

const emit = defineEmits(['submit', 'update:form']);

const isRender = ref(false);
const dialogRef = ref();
const ruleFormRef = ref();

const form = reactive({
	showFields: {
		successAmount: { key: '对账总额（元）', value: '', moneyFormat: true, column: true },
		successSize: { key: '对账笔数', value: '', column: true },
		fileA: {
			key: '',
			defaultKey: '对账文件',
			value: [],
			setKeyField: 'partyA',
			isUpload: true,
			column: true,
			editor: false,
			...fileUploadOptions({ isFile: true, valueType: 'string' }, { max: 1 })
		},
		fileB: {
			key: '',
			defaultKey: '对账文件',
			value: [],
			setKeyField: 'partyB',
			isUpload: true,
			column: true,
			editor: false,
			...fileUploadOptions({ isFile: true, valueType: 'string' }, { max: 1 })
		}
	} as EmptyObjectType,

	formData: {} as EmptyObjectType,
	rulesData: {} as EmptyObjectType
});

// 打开弹窗
const openDialog = async (rows: EmptyObjectType) => {
	// 设置数据
	setRenderFormByAjaxData(form, form.formData, form.showFields, { data: rows });

	isRender.value = true;
	dialogRef.value.open();
};

// 关闭弹窗
const closeDialog = () => {
	isRender.value = false;
	dialogRef.value.close();
};

onMounted(() => {
	form.formData = U.formatFormData(form.showFields);
});

// 暴露变量
defineExpose({ openDialog, closeDialog });
</script>
