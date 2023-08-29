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
	</div>
</template>

<script setup lang="ts" name="jrBoss.order.details">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { createObjectByUrlParams, goToUrl } from '/@/hooks/useRoute';
import { RenderFieldsInit } from '/@/hooks/customForm/jrboss/renderFields';
import { InitFormConfig } from '/@/hooks/customForm/jrboss/initConfig';
import { tableHandler, tapClickHandler, queryListByPageHandler, watchFormData } from '/@/hooks/customForm/jrboss/formHandleCall';

// 引入组件
const Borrower = defineAsyncComponent(() => import('/@/hooks/customForm/jrboss/Borrower.vue'));
const Contact = defineAsyncComponent(() => import('/@/hooks/customForm/jrboss/Contact.vue'));
const Collateral = defineAsyncComponent(() => import('/@/hooks/customForm/jrboss/Collateral.vue'));
const CollateralVisit = defineAsyncComponent(() => import('/@/hooks/customForm/jrboss/CollateralVisit.vue'));
const borrowerRef = ref<RefType>();
const contactRef = ref<RefType>();
const collateralRef = ref<RefType>();
const collateralVisitRef = ref<RefType>();

const route = useRoute();
const loading = ref(false);
const editor = ref(false);
const title = ref('');
const orderId = ref('');

const formConfig = ref({});
const params = createObjectByUrlParams({ route });
params.isTongdao = ref(params.productId === 'bjjr_tongdao1');

const renderFields = RenderFieldsInit(editor.value, { ...params, handler, tapClickCall, pageChange });

const ruleFormRef = ref<RefType>();
const formFieldsLayoutRef = ref<RefType>();

const form = reactive({
	showFields: renderFields,
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

// 返回
const back = () => {
	goToUrl(`/jrboss/order/list`, route);
};

onMounted(async () => {
	await initQuery();
});

watch(
	() => route,
	(r) => {
		title.value = `${r.query.productName} 订单详情` as string;
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
