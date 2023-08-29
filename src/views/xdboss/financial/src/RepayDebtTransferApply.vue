<template>
	<LayoutDialog ref="dialogRef" isHeaderClose isFixed :fixed="{ width: '500px', height: 'auto' }" editor @submit="submit">
		<template #header>发起债转申请</template>

		<template #render v-if="isRender">
			<el-form
				ref="ruleFormRef"
				class="form-box form-box--long form-box-view"
				:validate-on-rule-change="false"
				:model="form.formData"
				:rules="form.rulesData"
				:inline="false"
				label-width="120px"
			>
				<FormFieldsLayout
					:isView="false"
					editor
					:formSetting="{ cardContCls: 'pt10' }"
					:renderLevel="1"
					:showFields="form.showFields"
					:formData="form.formData"
					:rulesData="form.rulesData"
				/>
			</el-form>
		</template>
	</LayoutDialog>
</template>

<script setup lang="ts" name="xdBossFinancialRepayConfirm">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { setRenderFormByAjaxData } from '/@/hooks/customForm/useFormFields';

const emit = defineEmits(['submit', 'update:form']);

const isRender = ref(false);
const dialogRef = ref();
const ruleFormRef = ref();
const form = reactive({
	showFields: {
		productId: { key: '产品类型', value: '', select: C.xdDict.DebtTransferProduct }
	} as EmptyObjectType,
	formData: {} as EmptyObjectType,
	rulesData: {
		productId: [{ required: true, message: '请选择产品类型', trigger: 'change' }]
	} as EmptyObjectType
});

// 打开弹窗
const openDialog = async () => {
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

// 绑定提交
const submit = async () => {
	await ruleFormRef.value.validate(async (valid: boolean, fields: any) => {
		if (valid) {
			closeDialog();
			emit('submit', form.formData);
		} else {
			if (!!fields) {
				const errMsg = Object.values(fields as EmptyObjectType)[0][0].message;
				jBox.error(errMsg);
			}
		}
	});
};

// 暴露变量
defineExpose({ openDialog, closeDialog });
</script>
