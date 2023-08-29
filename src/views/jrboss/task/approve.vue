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
				<el-button type="primary" @click="submit()">审批</el-button>
			</template>
		</LayoutContainer>

		<!-- 共借人 -->
		<Borrower
			ref="borrowerRef"
			configKey="orderBorrowers"
			v-model:form="form.formData"
			:routeParams="params"
			:formConfig="form.subFormConfig"
			:productConfig="form.productConfig"
		/>

		<!-- 联系人 -->
		<Contact
			ref="contactRef"
			configKey="orderContacts"
			v-model:form="form.formData"
			:routeParams="params"
			:formConfig="form.subFormConfig"
			:productConfig="form.productConfig"
		/>

		<!-- 联系人 -->
		<Collateral
			ref="collateralRef"
			configKey="orderCollaterals"
			v-model:form="form.formData"
			:routeParams="params"
			:formConfig="form.subFormConfig"
			:productConfig="form.productConfig"
		/>

		<!-- 下户回访 -->
		<CollateralVisit
			ref="collateralVisitRef"
			configKey="orderCollateralVisits"
			v-model:form="form.formData"
			:routeParams="params"
			:formConfig="form.subFormConfig"
			:productConfig="form.productConfig"
		/>

		<!-- 确认放款信息 -->
		<ConfirmLayout ref="confirmLayoutRef" v-model:form="form.formData" :routeParams="params" @submit="approveUpdateFormData" />
	</div>
</template>

<script setup lang="ts" name="jrBoss.task.todo.approve">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { createObjectByUrlParams, goToUrl } from '/@/hooks/useRoute';
import { filterReadonlyFieldForm } from '/@/hooks/customForm/useFormFields';
import { RenderFieldsInit } from '/@/hooks/customForm/jrboss/renderFields';
import { InitFormConfig } from '/@/hooks/customForm/jrboss/initConfig';
import { tableHandler, tapClickHandler, queryListByPageHandler, watchFormData } from '/@/hooks/customForm/jrboss/formHandleCall';
import { approveTask } from '/@/api/jrboss/task';

// 引入组件
const Borrower = defineAsyncComponent(() => import('/@/hooks/customForm/jrboss/Borrower.vue'));
const Contact = defineAsyncComponent(() => import('/@/hooks/customForm/jrboss/Contact.vue'));
const Collateral = defineAsyncComponent(() => import('/@/hooks/customForm/jrboss/Collateral.vue'));
const CollateralVisit = defineAsyncComponent(() => import('/@/hooks/customForm/jrboss/CollateralVisit.vue'));
const ConfirmLayout = defineAsyncComponent(() => import('./src/ConfirmLayout.vue'));
const borrowerRef = ref<RefType>();
const contactRef = ref<RefType>();
const collateralRef = ref<RefType>();
const collateralVisitRef = ref<RefType>();
const confirmLayoutRef = ref<RefType>();

const route = useRoute();
const loading = ref(false);
const editor = ref(false);
const title = ref('');
const orderId = ref('');

const params = createObjectByUrlParams({ route });
params.isTongdao = ref(params.productId === 'bjjr_tongdao1');

const renderFields = RenderFieldsInit(editor.value, { ...params, handler, tapClickCall, pageChange });

const ruleFormRef = ref<RefType>();
const formFieldsLayoutRef = ref<RefType>();

const form = reactive({
	showFields: renderFields,
	formConfig: {} as EmptyObjectType,
	productConfig: {} as EmptyObjectType,
	subFormConfig: {} as EmptyObjectType,
	formData: {} as EmptyObjectType,
	rulesData: {} as EmptyObjectType
});

// 查询接口
async function initQuery(data?: EmptyObjectType) {
	const historicalApprovalRecord = form.showFields.historicalApprovalRecord.value.historicalApprovalRecord;
	InitFormConfig(
		'task',
		form,
		{ ...params },
		{ approvalPages: historicalApprovalRecord.pages, isTongdao: params.isTongdao, productId: params.productId }
	);
}

// 点击链接方法
function tapClickCall(event: any, cRender: EmptyObjectType, pRender: EmptyObjectType, key: string, data: EmptyObjectType) {
	tapClickHandler(key, data, form, collateralRef.value);
}

// 历史审批记录分页查询
function pageChange(val: EmptyObjectType, current: EmptyObjectType, formKey: string) {
	queryListByPageHandler(formKey, form, val, current, { orderId: orderId.value });
}

/**
 * @description 共借人、联系人、抵押物等表格操作项
 */
function handler(key: any, data: any, rows: any, button: EmptyObjectType, scope: any, item: any): void {
	const refs = {
		orderBorrowers: borrowerRef.value,
		orderContacts: contactRef.value,
		orderCollaterals: collateralRef.value,
		orderCollateralVisits: collateralVisitRef.value
	};

	// 新增按钮
	if (U.isObject(key)) {
		tableHandler(key.emit, {}, 0, { ref: key.ref }, form, refs);
	} else {
		tableHandler(key, rows, scope.$index, item, form, refs);
	}
}

// 提交审批
const submit = async () => {
	const formData = filterReadonlyFieldForm(form, params);

	// 没有审批操作 默认是创建订单
	const step = form.formConfig.outcomes[formData.form_outcome];
	if (!step) {
		jBox.error('请先选择审批结果!');
		return;
	}

	// 如果有弹窗
	if (!!step.confirmPopup) {
		confirmLayoutRef.value.openDialog(formData, step);
		return;
	}

	// 表单需要验证
	if (step.verification) {
		await ruleFormRef.value.validate(async (valid: boolean, fields: any) => {
			if (valid) {
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

		const rs = await approveTask({ form, workflow, step });
		if (rs.code === 'SUCCESS') {
			jBox.success('审批成功！');
			back();
		}
	} catch (error) {
		if (isConfirm) {
			confirmLayoutRef.value.closeDialog();
		}
	}
}

// 返回
const back = () => {
	goToUrl(`/jrboss/task/todo`, route);
};

onMounted(async () => {
	await initQuery();
});

watch(
	() => route,
	(r) => {
		title.value = `${r.query.productName} 任务审批` as string;
		editor.value = r.query.editor === '1' ?? false;
		orderId.value = (r.query.orderId as string) ?? '';
	},
	{ immediate: true, deep: true }
);

watch(
	() => form.formData,
	(formData) => {
		watchFormData(form.showFields, formData, params);
	},
	{ immediate: true, deep: true }
);
</script>
