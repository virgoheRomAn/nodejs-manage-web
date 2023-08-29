<template>
	<LayoutDialog ref="dialogRef" isHeaderClose editor isFixed :fixed="{ width: '700px', height: 'auto' }" @submit="submitForm">
		<template #header>{{ isRetry ? '重新发起对账' : '发起人工对账' }}</template>

		<template #render v-if="isRender">
			<el-form
				ref="ruleFormRef"
				class="form-box form-box--long form-box-validate"
				:validate-on-rule-change="false"
				:model="form.formData"
				:rules="form.rulesData"
				:inline="false"
				label-width="170px"
			>
				<FormFieldsLayout
					:isView="false"
					:renderLevel="1"
					editor
					:formSetting="{ cardContCls: 'pt20' }"
					:showFields="form.showFields"
					:formData="form.formData"
					:rulesData="form.rulesData"
				/>
			</el-form>
		</template>
	</LayoutDialog>
</template>

<script setup lang="ts" name="ReconciliationManualProcess">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { fileUploadOptions } from '/@/hooks/customForm/useFormUpload';
import { setRenderFormByAjaxData } from '/@/hooks/customForm/useFormFields';
import { reconciliationManualProcess, reconciliationRetry } from '/@/api/jfmanage/system';

const emit = defineEmits(['submit', 'update:form']);

const isRender = ref(false);
const isRetry = ref(false);
const dialogRef = ref();
const ruleFormRef = ref();
const formData = ref<EmptyObjectType>({});

const form = reactive({
	showFields: {
		code: { key: '对账类型', value: 'CITIC', select: [], disabled: true, column: true },
		daterange: {
			key: '对账范围',
			value: [],
			setAjaxValue: ['date', 'date2'],
			fieldValue: [{ date: { value: '' } }, { date2: { value: '' } }],
			isNotTimestamp: true,
			isCutting: true,
			daterange: true,
			column: true
		},
		fileA: {
			key: '中信银行对账文件',
			value: [],
			column: true,
			isUpload: true,
			...fileUploadOptions({ isFile: true, valueType: 'string' }, { max: 1 })
		},
		fileB: { key: '系统对账文件', value: '', isView: true, editor: false, isNotAjax: true }
	} as EmptyObjectType,

	formData: {} as EmptyObjectType,
	rulesData: {} as EmptyObjectType
});

// 打开弹窗
const openDialog = async (data: EmptyObjectType) => {
	formData.value = data;

	const date1 = U.getFormatDateByTime(data.date, 'date');
	const date2 = U.getFormatDateByTime(data.date2, 'date');

	isRetry.value = data.isRetry;
	form.showFields.code.select = data.reconciliationTypes;
	form.showFields.daterange.disabled = data.isRetry;

	if (data.isRetry) {
		form.formData.daterange = [date1, date2];
		form.formData.date = date1;
		form.formData.date2 = date2;
	} else {
		emptyData();
	}

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
	form.rulesData = U.createRuleData(form.showFields);
});

// 清空数据
const emptyData = () => {
	form.formData['daterange'] = [];

	for (let key in form.formData) {
		if (!['code'].includes(key)) {
			form.formData[key] = U.emptyData(form.formData[key]);
		}
	}
};

/**
 * 弹窗确认方法
 */
async function submitForm() {
	if (!ruleFormRef.value) return;

	await ruleFormRef.value.validate(async (valid: boolean, fields: any) => {
		if (valid) {
			let rs: ResponesResult = { code: '', data: '', message: '' };

			if (!isRetry.value) {
				rs = await reconciliationManualProcess(form.formData);
			} else {
				rs = await reconciliationRetry({ id: formData.value.id, ...form.formData });
			}

			if (rs.code === 'SUCCESS') {
				jBox.success('对账完成！');
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

// 暴露变量
defineExpose({ openDialog, closeDialog });
</script>
