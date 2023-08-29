<template>
	<LayoutDialog ref="dialogRef" isHeaderClose isFixed :fixed="{ width: '600px', height: 'auto' }" editor @submit="submit">
		<template #header>{{ title }}</template>

		<template #render v-if="isRender">
			<el-form
				ref="ruleFormRef"
				class="form-box"
				:class="{ 'form-box-validate': editor, 'form-box-view': !editor }"
				:validate-on-rule-change="false"
				:model="form.formData"
				:rules="form.rulesData"
				:inline="false"
				label-width="170px"
			>
				<FormFieldsLayout
					ref="formFieldsLayoutRef"
					:renderLevel="1"
					:formSetting="{ cardContCls: 'flex-between ptb20' }"
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

<script setup lang="ts" name="xdBossDebtTransferTaskApproveConfirm">
import { U } from '/@/utils';
import { C } from '/@/dicts';
import { settings } from '/@/plugins/settings';
import { debtTransferTdParse } from '/@/api/common';

const props = defineProps({
	form: { type: Object as PropType<EmptyObjectType>, default: () => ({}) },
	routeParams: { type: Object as PropType<EmptyObjectType>, default: () => ({}) }
});

const emit = defineEmits(['submit', 'update:form']);

const isRender = ref(false);
const editor = ref(false);
const title = ref('确认债转信息');
const setpInfo = ref<EmptyObjectType>({});
const formData = ref<EmptyObjectType>({});
const form = reactive({
	showFields: {
		date: { key: '债转日期', value: '', datetime: true, column: true },
		amount: { key: '债转金额汇总', value: '', moneyFormat: true, _suffix: '元', column: true },
		principal: { key: '本金余额汇总', value: '', moneyFormat: true, _suffix: '元', column: true },
		interest: { key: '利息余额汇总', value: '', moneyFormat: true, _suffix: '元', column: true },
		total: { key: '合计', value: '', moneyFormat: true, _suffix: '元', column: true },
		itemNum: { key: '合计笔数', value: '', _suffix: '笔', column: true },
		loanAmount: { key: '合同放款金额汇总', value: '', moneyFormat: true, _suffix: '元', column: true },
		loanInterest: { key: '合同利息余额汇总', value: '', moneyFormat: true, _suffix: '元', column: true },
		loanTransferAmount: { key: '合同债转金额汇总', value: '', moneyFormat: true, _suffix: '元', column: true },
		accruedInterest: { key: '应计利息', value: '', moneyFormat: true, _suffix: '元', column: true }
	},
	formData: {} as EmptyObjectType,
	rulesData: {} as EmptyObjectType
});

const dialogRef = ref();
const ruleFormRef = ref();

// 打开弹窗
const openDialog = async (data: EmptyObjectType, step: EmptyObjectType) => {
	const rs = await debtTransferTdParse(data);
	if (rs.code === 'SUCCESS') {
		formData.value = data;
		setpInfo.value = step;
		isRender.value = true;
		setFormRenderByData(rs.data);

		ruleFormRef.value?.clearValidate();
		dialogRef.value.open();
	}
};

// 关闭弹窗
const closeDialog = () => {
	isRender.value = false;
	dialogRef.value.close();
};

// 设置赋值
const setFormRenderByData = (data: EmptyObjectType) => {
	for (let key in form.formData) {
		form.formData[key] = U.isFalse(data[key]) ? (U.isArray(form.formData[key]) ? [] : '') : data[key];
	}
};

onMounted(() => {
	form.formData = U.formatFormData(form.showFields);
});

// 绑定提交
const submit = () => {
	emit('submit', formData.value, setpInfo.value, true);
};

// 暴露变量
defineExpose({ openDialog, closeDialog });
</script>
