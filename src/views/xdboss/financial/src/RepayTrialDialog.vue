<template>
	<LayoutDialog ref="dialogRef" isHeaderClose isFixed :fixed="{ width: '500px', height: 'auto' }" model="waring">
		<template #header>温馨提示</template>

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

<script setup lang="ts" name="xdBossFinancialRepayTrial">
import { U } from '/@/utils';
import { setRenderFormByAjaxData } from '/@/hooks/customForm/useFormFields';

const isRender = ref(false);
const dialogRef = ref();
const form = reactive({
	showFields: {
		shouldRepayAmount: { key: '试算总额', value: '', moneyFormat: true, _suffix: '元', column: true },
		shouldRepayPrincipal: { key: '试算本金', value: '', moneyFormat: true, _suffix: '元', column: true },
		shouldRepayInterest: { key: '试算利息', value: '', moneyFormat: true, _suffix: '元', column: true },
		shouldRepayOverduePenalty: { key: '试算罚息', value: '', moneyFormat: true, _suffix: '元', column: true },
		shouldRepayFee: { key: '试算费用', value: '', moneyFormat: true, _suffix: '元', column: true }
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

// 暴露变量
defineExpose({ openDialog, closeDialog });
</script>
<style lang="scss" scoped>
.repay-type {
	color: var(--color-text-normal);

	> label,
	> span {
		display: block;
	}

	> label {
		margin: 0 0 3px;
		font-size: 14px;
		color: var(--color-text-main);
	}

	> span {
		margin-bottom: 20px;
		line-height: 18px;
		font-size: 12px;
		padding-left: 23px;

		&:last-child {
			margin-bottom: 0;
		}
	}
}
</style>
