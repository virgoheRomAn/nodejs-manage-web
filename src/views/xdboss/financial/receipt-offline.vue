<template>
	<div class="vhm-layout-container">
		<LayoutContainer :title="title" isFixed :loading="loading">
			<template #default>
				<el-form
					ref="ruleFormRef"
					class="form-box form-box--big"
					:class="{ 'form-box-validate': editor, 'form-box-view': !editor }"
					:validate-on-rule-change="false"
					:model="form.formData"
					:rules="form.rulesData"
					:inline="false"
					label-width="150px"
				>
					<!-- 只读区域 -->
					<FormFieldsLayout
						wrapperCls="mb20"
						isView
						:editor="false"
						:showFields="form.viewShowFields"
						:formData="form.viewFormData"
						:rulesData="{}"
					/>

					<!-- 编辑区域 -->
					<FormFieldsLayout
						:isView="!editor"
						:editor="editor"
						:showFields="form.showFields"
						:formData="form.formData"
						:rulesData="form.rulesData"
						v-if="editor"
					/>
				</el-form>
			</template>

			<template #footer>
				<el-button @click="back()">返回</el-button>
				<el-button type="primary" @click="submit()" v-if="editor">申请</el-button>
			</template>
		</LayoutContainer>

		<!-- 还款类型弹窗 -->
		<RepayTypeDialog ref="repayTypeDialogRef" />

		<!-- 试算明细弹窗 -->
		<RepayTrialDialog ref="repayTrialDialogRef" />

		<!-- 确认提交 -->
		<RepayConfirmDialog ref="repayConfirmDialogRef" @submit="submitForm" />
	</div>
</template>

<script setup lang="ts" name="xdBoss.receipt.details">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { createObjectByUrlParams, goToUrl } from '/@/hooks/useRoute';
import { setRenderFormByAjaxData } from '/@/hooks/customForm/useFormFields';
import { RenderOfflineRepayFields } from './src/receipt';
import { queryReceiptDetail, settleRepayTrial, offlineRepayByReceipt } from '/@/api/xdboss/financial';

const RepayTypeDialog = defineAsyncComponent(() => import('./src/RepayTypeDialog.vue'));
const RepayTrialDialog = defineAsyncComponent(() => import('./src/RepayTrialDialog.vue'));
const RepayConfirmDialog = defineAsyncComponent(() => import('./src/RepayConfirmDialog.vue'));
const repayTypeDialogRef = ref<RefType>();
const repayTrialDialogRef = ref<RefType>();
const repayConfirmDialogRef = ref<RefType>();
const ruleFormRef = ref<RefType>();

const loading = ref(false);
const editor = ref(true);
const title = ref('还款登账申请');

const route = useRoute();
const params = createObjectByUrlParams({ route });
const renderFields = RenderOfflineRepayFields(editor.value, { ...params, change, showDialog });

const settleRepayTrialRs = ref<EmptyObjectType>({});
const form = reactive({
	showFields: renderFields.showFields,
	viewShowFields: renderFields.viewShowFields,
	formData: {} as EmptyObjectType,
	viewFormData: {} as EmptyObjectType,
	rulesData: {} as EmptyObjectType
});

// 查询接口
async function initQuery(data?: EmptyObjectType) {
	try {
		// 借据详情
		const rs = await queryReceiptDetail(params);
		if (rs.code === 'SUCCESS') {
			// 设置渲染数据
			setRenderFormByAjaxData(form, form.viewFormData, form.viewShowFields, { data: rs.data.receiptInfo });

			// 还款试算
			initSettleRepayTrial(false);
		}
	} catch (error) {
		throw new Error((error as Error).message);
	}
}

onMounted(async () => {
	// 生成form
	form.formData = U.formatFormData(form.showFields);
	form.viewFormData = U.formatFormData(form.viewShowFields);

	// 规则
	form.rulesData = U.createRuleData(form.showFields);

	await initQuery();
});

// 登账提交
const submit = async () => {
	await ruleFormRef.value.validate(async (valid: boolean, fields: any) => {
		if (valid) {
			repayConfirmDialogRef.value.openDialog({ data: form.formData });
		} else {
			if (!!fields) {
				const errMsg = Object.values(fields as EmptyObjectType)[0][0].message;
				jBox.error(errMsg);
			}
		}
	});
};

// 登账数据提交
const submitForm = async () => {
	try {
		const rs = await offlineRepayByReceipt({ receiptNum: params.receiptNum, ...form.formData });
		if (rs.code === 'SUCCESS') {
			jBox.success('登账成功！');
			back();
		}
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

// 返回
const back = () => {
	goToUrl(`/xdboss/financial/receipt`, route);
};

// 还款试算
async function initSettleRepayTrial(loading: boolean) {
	try {
		const param = { receiptNum: params.receiptNum, incomeType: form.formData.incomeType, repayDate: form.formData.repayTrailDate };
		const rs = await settleRepayTrial(param, loading);
		settleRepayTrialRs.value = rs;

		if (rs.code === 'SUCCESS') {
			form.formData['shouldRepayAmount'] = rs.data['shouldRepayAmount'];
		}
	} catch (error) {
		form.formData['shouldRepayAmount'] = 0;
	} finally {
		const shouldRepayAmount = U.getObjectItemByKey({ value: form.showFields }, 'shouldRepayAmount');
		const amount = U.count.sub(form.formData.shouldRepayAmount, form.formData.remainingAmount);
		form.formData.repayAmount = amount < 0 ? 0 : amount;

		// 明细按钮状态
		shouldRepayAmount.neighbor.map((x: any) => (x.disabled = amount <= 0));
	}
}

// 选择还款方式 还款日期 重新试算
function change() {
	initSettleRepayTrial(true);
}

/**
 * @description 点击展示弹窗
 */
function showDialog(key: string, target: any, cRender: EmptyObjectType, form: EmptyObjectType) {
	if (key === 'incomeType') {
		repayTypeDialogRef.value.openDialog();
	}

	if (key === 'shouldRepayAmount') {
		repayTrialDialogRef.value.openDialog(settleRepayTrialRs.value);
	}
}
</script>
