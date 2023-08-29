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

<script setup lang="ts" name="xdBoss.receipt.details">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { createObjectByUrlParams, goToUrl } from '/@/hooks/useRoute';
import { setRenderFormByAjaxData } from '/@/hooks/customForm/useFormFields';
import { queryListByPageHandler } from '/@/hooks/customForm/xdboss/formHandleCall';
import { RenderReceiptDetailFields, getTableMergeSpanArray } from './src/receipt';
import { queryReceiptDetail } from '/@/api/xdboss/financial';

const route = useRoute();
const loading = ref(false);
const editor = ref(false);
const title = ref('借据详情');
const receiptNum = ref('');
const productNum = ref('');

const formConfig = ref({});
const params = createObjectByUrlParams({ route });
const renderFields = RenderReceiptDetailFields(editor.value, { ...params, pageChange, rapayRecordMergeMethod });

const ruleFormRef = ref<RefType>();
const formFieldsLayoutRef = ref<RefType>();
const repayRecordTableMerge = ref<any[]>([]);

const form = reactive({
	showFields: renderFields,
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

	try {
		const repayRecord = U.getObjectItemByKey({ value: form.showFields }, 'repayRecord');
		const rs = await queryReceiptDetail({
			getReceiptRepayPlan: true,
			receiptNum: receiptNum.value,
			productNum: productNum.value,
			repayRecordPages: repayRecord.pages
		});

		if (rs.code === 'SUCCESS') {
			// 计算还款记录的合并单元格
			repayRecordTableMerge.value = getTableMergeSpanArray('repayRecord', rs.data.repayRecord);

			// 设置渲染数据
			const ajaxData = { data: { ...rs.data.receiptInfo, ...rs.data.collectInfo, ...rs.data, ...rs } };
			setRenderFormByAjaxData(form, form.formData, form.showFields, ajaxData);
		}
	} catch (error) {
		throw new Error((error as Error).message);
	}
}

// 返回
const back = () => {
	const returnUrl = params.returnUrl;

	goToUrl(returnUrl ? returnUrl : `/xdboss/financial/receipt`, route);
};

onMounted(async () => {
	await initQuery();
});

// 还款记录明细查询合并单元格
function rapayRecordMergeMethod({ row, column, rowIndex, columnIndex }: any) {
	// [0,0] 表示这一行不显示，[1,1]表示这一行正常显示, [2,1]表示行的合并数
	if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4) {
		const _row = repayRecordTableMerge.value[rowIndex];
		const _col = _row > 0 ? 1 : 0;

		return {
			rowspan: _row,
			colspan: _col
		};
	}
}

// 分页查询
async function pageChange(val: EmptyObjectType, current: EmptyObjectType, formKey: string) {
	const rs = await queryListByPageHandler(formKey, form, val, current, { receiptNum: receiptNum.value });

	// 计算还款记录的合并单元格
	if (formKey === 'repayRecord') {
		repayRecordTableMerge.value = getTableMergeSpanArray(formKey, rs.data);
	}
}
</script>
