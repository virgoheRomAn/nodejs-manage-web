<template>
	<LayoutDialog ref="dialogRef" isHeaderClose isFixed :fixed="{ width: '500px', height: 'auto' }" editor @submit="submit">
		<template #header>确认提交</template>

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
					isView
					:editor="false"
					:formSetting="{ cardContCls: 'pt10' }"
					:renderLevel="1"
					:showFields="form.showFields"
					:formData="form.formData"
					:rulesData="{}"
				/>
			</el-form>
		</template>
	</LayoutDialog>
</template>

<script setup lang="ts" name="xdBossFinancialRepayConfirm">
import { U } from '/@/utils';
import { setRenderFormByAjaxData } from '/@/hooks/customForm/useFormFields';

const emit = defineEmits(['submit', 'update:form']);

const isRender = ref(false);
const dialogRef = ref();
const form = reactive({
	showFields: {
		transferDate: { key: '还款流水时间', value: '', datatime: true, column: true },
		repayDate: { key: '入账时间', value: '', datatime: true, column: true },
		repayAmount: { key: '实际还款金额', value: '', moneyFormat: true, _suffix: '元', column: true }
	},
	formData: {} as EmptyObjectType,
	rulesData: {} as EmptyObjectType
});

// 打开弹窗
const openDialog = async (data: EmptyObjectType) => {
	// 设置渲染数据
	setRenderFormByAjaxData(form, form.formData, form.showFields, data);

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
const submit = () => {
	emit('submit', form.formData);
};

// 暴露变量
defineExpose({ openDialog, closeDialog });
</script>
