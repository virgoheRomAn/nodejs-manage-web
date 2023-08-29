<template>
	<div class="vhm-layout-container">
		<LayoutContainer :title="title" isFixed :loading="loading">
			<template #default>
				<el-form
					ref="ruleFormRef"
					class="form-box form-box--long"
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
				<el-button type="primary" @click="submit()" v-if="editor">审批</el-button>
			</template>
		</LayoutContainer>

		<!-- 确认信息 -->
		<ConfirmLayout ref="confirmLayoutRef" v-model:form="form.formData" :routeParams="params" @submit="approveUpdateFormData" />
	</div>
</template>

<script setup lang="ts" name="xdBoss.task.todo.debtTransfer">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { createObjectByUrlParams, goToUrl } from '/@/hooks/useRoute';
import { disabledFields, setRenderFieldByData, setRenderFormByAjaxData, filterReadonlyFieldForm } from '/@/hooks/customForm/useFormFields';
import { queryListByPageHandler } from '/@/hooks/customForm/xdboss/formHandleCall';
import { RenderFieldsInit } from './src/debtTransfer';
import { queryFormConfig, debtTransferTdDetail } from '/@/api/common';
import { debtTransferTdApproval } from '/@/api/xdboss/task';

const route = useRoute();
const loading = ref(false);
const editor = ref(false);
const title = ref('');
const detailId = ref('');

const params = createObjectByUrlParams({ route });
const renderFields = RenderFieldsInit(editor.value, { ...params, pageChange });

const ConfirmLayout = defineAsyncComponent(() => import('./src/ConfirmLayout.vue'));
const confirmLayoutRef = ref<RefType>();
const ruleFormRef = ref<RefType>();

const form = reactive({
	showFields: renderFields.showFields,
	viewShowFields: renderFields.viewShowFields,
	formConfig: {} as EmptyObjectType,
	productConfig: {} as EmptyObjectType,
	subFormConfig: {} as EmptyObjectType,
	formData: {} as EmptyObjectType,
	viewFormData: {} as EmptyObjectType,
	rulesData: {} as EmptyObjectType
});

// 查询接口
async function initQuery() {
	const loading = jBox.loading('数据加载中...');

	try {
		// 获取表单配置
		const rs = await queryFormConfig({ ...params, type: 'xdboss' }, false);
		if (rs.code === 'SUCCESS') {
			const data = rs.data;
			form.formConfig = data.formConfig;

			// 设置大表单[只读]
			setRenderFieldByData(form, form.viewShowFields, form.formConfig, form.productConfig, true);
			// 设置大表单[编辑]
			setRenderFieldByData(form, form.showFields, form.formConfig, form.productConfig, false);

			// 规则
			form.rulesData = U.createRuleData(form.showFields);

			// 请求数据 获取债转详情
			const details = await debtTransferTdDetail({ id: detailId.value }, false);
			if (details.code === 'SUCCESS') {
				jBox.closeById(loading);

				// 设置渲染数据
				setRenderFormByAjaxData(form, form.viewFormData, form.viewShowFields, details);

				// 审批列表
				const historicalApprovalRecord = U.getObjectItemByKey({ value: form.viewShowFields }, 'historicalApprovalRecord');
				queryListByPageHandler(
					'historicalApprovalRecord',
					form,
					historicalApprovalRecord.pages,
					historicalApprovalRecord,
					{ orderId: detailId.value },
					false
				);
			}
		}
	} catch (error) {
		jBox.closeById(loading);
		throw new Error((error as Error).message);
	}
}

// 历史审批记录分页查询
function pageChange(val: EmptyObjectType, current: EmptyObjectType, formKey: string) {
	queryListByPageHandler(formKey, form, val, current, { orderId: detailId.value });
}

// 提交审批
const submit = async () => {
	const formData = filterReadonlyFieldForm(form, params);

	// 有详情ID需要传入详情ID
	if (!!detailId.value) formData.id = detailId.value;

	// 没有审批操作
	const step = form.formConfig.outcomes[formData.form_outcome];
	if (!step) {
		jBox.error('请先选择审批结果!');
		return;
	}

	// 表单需要验证
	if (step.verification) {
		await ruleFormRef.value.validate(async (valid: boolean, fields: any) => {
			if (valid) {
				// 如果有弹窗
				if (!!step.confirmPopup) {
					confirmLayoutRef.value.openDialog(formData, step);
					return;
				}

				// 标准处理
				jBox.confirm(`是否确认提交审批结果?`, '确认操作', {
					callback: async (action: any) => {
						if (!!action && action !== 'cancel') {
							approveUpdateFormData(formData, step);
						}
					}
				});
			} else {
				if (!!fields) {
					const errMsg = Object.values(fields as EmptyObjectType)[0][0].message;
					jBox.error(errMsg);
				}
			}
		});
	} else {
		jBox.confirm(`是否确认提交审批结果?`, '确认操作', {
			callback: async (action: any) => {
				if (!!action && action !== 'cancel') {
					approveUpdateFormData(formData, step);
				}
			}
		});
	}
};

/**
 * @description 提交表单
 * @param {Object} form 提交表单信息
 * @param {Object} step 提交步骤信息
 * @param {Boolean} isConfirm 是否是确认弹窗提交
 */
async function approveUpdateFormData(form: EmptyObjectType, step: EmptyObjectType, isConfirm: boolean = false) {
	try {
		const workflow = { ...params, form_key: params.formKey };

		const rs = await debtTransferTdApproval({ form, workflow, step });
		if (rs.code === 'SUCCESS') {
			jBox.success('审批成功！');
			back();
		}
	} catch (error) {}
}

// 返回
const back = () => {
	const returnUrl = params.returnUrl;

	goToUrl(returnUrl ? returnUrl : editor.value ? `/xdboss/task/todo` : `/xdboss/task/history`, route);
};

onMounted(async () => {
	// 将展示的字段全部设置为不展示。根据表单数据展示
	disabledFields(form.showFields);

	// 生成form
	form.formData = U.formatFormData(form.showFields);
	form.viewFormData = U.formatFormData(form.viewShowFields);

	await initQuery();
});

watch(
	() => route,
	(r) => {
		editor.value = r.query.editor === '1' ?? false;
		detailId.value = (r.query.detailId as string) ?? '';
		title.value = editor.value ? '债转任务审批' : '债转任务详情';
	},
	{ immediate: true, deep: true }
);
</script>
