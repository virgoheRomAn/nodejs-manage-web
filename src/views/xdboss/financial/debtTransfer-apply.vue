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

		<!-- 确认信息 -->
		<ConfirmLayout ref="confirmLayoutRef" v-model:form="form.formData" :routeParams="params" @submit="approveUpdateFormData" />
	</div>
</template>

<script setup lang="ts" name="xdBoss.receipt.details">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { createObjectByUrlParams, goToUrl } from '/@/hooks/useRoute';
import { fileUploadOptions } from '/@/hooks/customForm/useFormUpload';
import { debtTransferTdCreate } from '/@/api/xdboss/financial';

const ConfirmLayout = defineAsyncComponent(() => import('../task/src/ConfirmLayout.vue'));
const confirmLayoutRef = ref<RefType>();
const ruleFormRef = ref<RefType>();

const loading = ref(false);
const editor = ref(true);
const title = ref('发起债转申请');

const route = useRoute();
const params = createObjectByUrlParams({ route });

const settleRepayTrialRs = ref<EmptyObjectType>({});
const form = reactive({
	showFields: {
		debtTransferInfo: {
			key: '债转信息',
			render: 'object',
			value: {
				date: { key: '债转日期', value: '', datetime: true, column: true },
				attachment_60: {
					key: '债转协议',
					isUpload: true,
					column: true,
					value: [],
					...fileUploadOptions({ isOnlyPDF: true, isTips: true }, { max: 1 })
				},
				attachment_61: {
					key: '债转清单',
					isUpload: true,
					column: true,
					value: [],
					...fileUploadOptions({ isOnlyExcel: true, isTips: true }, { max: 1 })
				}
			}
		}
	},
	formData: {} as EmptyObjectType,
	rulesData: {} as EmptyObjectType
});

// 查询接口
async function initQuery(data?: EmptyObjectType) {}

onMounted(async () => {
	// 生成form
	form.formData = U.formatFormData(form.showFields);

	// 规则
	form.rulesData = U.createRuleData(form.showFields);
});

// 登账提交
const submit = async () => {
	await ruleFormRef.value.validate(async (valid: boolean, fields: any) => {
		if (valid) {
			confirmLayoutRef.value.openDialog(form.formData, {});
		} else {
			if (!!fields) {
				const errMsg = Object.values(fields as EmptyObjectType)[0][0].message;
				jBox.error(errMsg);
			}
		}
	});
};

/**
 * @description 提交表单
 * @param {Object} form 提交表单信息
 * @param {Object} step 提交步骤信息
 * @param {Boolean} isConfirm 是否是确认弹窗提交
 */
async function approveUpdateFormData(form: EmptyObjectType, step: EmptyObjectType, isConfirm: boolean = false) {
	const rs = await debtTransferTdCreate(form);
	if (rs.code === 'SUCCESS') {
		jBox.success('申请成功！');
		back();
	}
}

// 返回
const back = () => {
	goToUrl(`/xdboss/financial/debtTransfer/query`, route);
};
</script>
