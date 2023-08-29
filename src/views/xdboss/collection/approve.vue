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
					<FormFieldsLayout :isView="!editor" :editor="editor" :showFields="form.showFields" :formData="form.formData" :rulesData="form.rulesData" />
				</el-form>
			</template>

			<template #footer>
				<el-button @click="back()">返回</el-button>
				<el-button type="primary" @click="submit()">审批</el-button>
			</template>
		</LayoutContainer>
	</div>
</template>

<script setup lang="ts" name="xdBoss.task.todo.debtTransfer">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { createObjectByUrlParams, goToUrl } from '/@/hooks/useRoute';
import { disabledFields, setRenderFieldByData, setRenderFormByAjaxData, filterReadonlyFieldForm } from '/@/hooks/customForm/useFormFields';
import { queryListByPageHandler } from '/@/hooks/customForm/xdboss/formHandleCall';
import { RenderFieldsInit } from './src/renderFields';
import { debtTransferTdApproval } from '/@/api/xdboss/task';

const route = useRoute();
const loading = ref(false);
const editor = ref(true);
const title = ref('催收任务审批');
const ruleFormRef = ref<RefType>();

const params = createObjectByUrlParams({ route });
const renderFields = RenderFieldsInit(editor.value, { ...params, pageChange });

const form = reactive({
	showFields: renderFields.showFields,
	viewShowFields: renderFields.viewShowFields,
	formData: {} as EmptyObjectType,
	viewFormData: {} as EmptyObjectType,
	rulesData: {} as EmptyObjectType
});

// 查询接口
async function initQuery() {
	// 生成form
	form.formData = U.formatFormData(form.showFields);
	form.viewFormData = U.formatFormData(form.viewShowFields);

	// 生成规则
	form.rulesData = U.createRuleData(form.showFields);
}

// 历史审批记录分页查询
function pageChange(val: EmptyObjectType, current: EmptyObjectType, formKey: string) {}

// 提交审批
const submit = async () => {
	const formData = filterReadonlyFieldForm(form, params);
};

/**
 * @description 提交表单
 * @param {Object} form 提交表单信息
 * @param {Object} step 提交步骤信息
 * @param {Boolean} isConfirm 是否是确认弹窗提交
 */
async function approveUpdateFormData(form: EmptyObjectType, step: EmptyObjectType, isConfirm: boolean = false) {}

// 返回
const back = () => {
	goToUrl(`/xdboss/collection/task`, route);
};

onMounted(async () => {
	await initQuery();
});
</script>
