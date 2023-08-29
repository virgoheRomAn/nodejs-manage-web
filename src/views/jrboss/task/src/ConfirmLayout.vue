<template>
	<LayoutDialog ref="dialogRef" isHeaderClose isFixed :fixed="{ width: '800px', height: 'auto' }" editor @submit="submit">
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
				label-width="120px"
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

<script setup lang="ts" name="jrBossTaskApproveConfirm">
import { U } from '/@/utils';
import { C } from '/@/dicts';
import { settings } from '/@/plugins/settings';

const props = defineProps({
	form: { type: Object as PropType<EmptyObjectType>, default: () => ({}) },
	routeParams: { type: Object as PropType<EmptyObjectType>, default: () => ({}) }
});

const emit = defineEmits(['submit', 'update:form']);

const isRender = ref(false);
const editor = ref(false);
const title = ref('确认放款信息');
const setpInfo = ref<EmptyObjectType>({});
const formData = ref<EmptyObjectType>({});
const form = reactive({
	showFields: {
		orderId: { key: '订单号', value: '' },
		productName: { key: '产品名称', value: '' },
		user_name: { key: '客户名称', value: '', column: true },
		order_approvalAmount: { key: '审批金额', value: '', moneyFormat: true },
		order_approvalAmoun_caps: { key: '大写', value: '', moneyToCapital: true },
		order_loanAmount: { key: '放款金额', value: '', moneyFormat: true },
		order_loanAmount_caps: { key: '大写', value: '', moneyToCapital: true }
	},
	formData: {} as EmptyObjectType,
	rulesData: {} as EmptyObjectType
});

const dialogRef = ref();
const ruleFormRef = ref();

// 打开弹窗
const openDialog = (data: EmptyObjectType, step: EmptyObjectType) => {
	formData.value = data;
	setpInfo.value = step;
	isRender.value = true;
	setFormRenderByData(props.form);

	ruleFormRef.value?.clearValidate();
	dialogRef.value.open();
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

		form.formData.productName = props.routeParams.productName;
		form.formData.order_approvalAmoun_caps = data.order_approvalAmount;
		form.formData.order_loanAmount_caps = data.order_loanAmount;
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
