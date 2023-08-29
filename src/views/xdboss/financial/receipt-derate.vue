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
					<FormFieldsLayout
						ref="formFieldsLayoutRef"
						:isView="!editor"
						:editor="editor"
						:showFields="form.showFields"
						:formData="form.formData"
						:rulesData="form.rulesData"
					/>
				</el-form>
			</template>

			<template #footer>
				<el-button @click="back()">返回</el-button>
			</template>
		</LayoutContainer>
	</div>
</template>

<script setup lang="ts" name="xdBoss.receipt.derate">
// TODO：暂时不做
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { createObjectByUrlParams, goToUrl } from '/@/hooks/useRoute';
import { setRenderFormByAjaxData } from '/@/hooks/customForm/useFormFields';
import { setFormRenderByData } from '/@/hooks/customForm/xdboss/initConfig';
import { queryListByPageHandler } from '/@/hooks/customForm/xdboss/formHandleCall';

const route = useRoute();
const loading = ref(false);
const editor = ref(false);
const title = ref('线下减免申请');
const receiptNum = ref('');
const productNum = ref('');

const formConfig = ref({});
const params = createObjectByUrlParams({ route });

const ruleFormRef = ref<RefType>();
const formFieldsLayoutRef = ref<RefType>();
const repayRecordTableMerge = ref<any[]>([]);

const form = reactive({
	showFields: {},
	formData: {} as EmptyObjectType,
	rulesData: {} as EmptyObjectType
});

watch(
	() => route,
	(r) => {
		editor.value = r.query.editor === '1' ?? false;
		receiptNum.value = (r.query.receiptNum as string) ?? '';
		productNum.value = (r.query.productNum as string) ?? '';
	},
	{ immediate: true, deep: true }
);

// 查询接口
async function initQuery(data?: EmptyObjectType) {
	// 生成form
	form.formData = U.formatFormData(form.showFields);
}

// 返回
const back = () => {
	goToUrl(`/xdboss/financial/receipt`, route);
};

onMounted(async () => {
	await initQuery();
});
</script>
