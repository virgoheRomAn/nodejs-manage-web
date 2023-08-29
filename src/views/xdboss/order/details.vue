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

		<!-- 联系人 -->
		<Contact ref="contactRef" configKey="orderContactInfos" v-model:form="form.formData" :routeParams="params" />
	</div>
</template>

<script setup lang="ts" name="xdBoss.order.details">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { createObjectByUrlParams, goToUrl } from '/@/hooks/useRoute';
import { RenderFieldsInit } from '/@/hooks/customForm/xdboss/renderFields';
import { setFormRenderByData } from '/@/hooks/customForm/xdboss/initConfig';
import { tableHandler } from '/@/hooks/customForm/xdboss/formHandleCall';
import { queryOrderDetails } from '/@/api/xdboss/order';

// 引入组件
const Contact = defineAsyncComponent(() => import('/@/hooks/customForm/xdboss/Contact.vue'));
const contactRef = ref<RefType>();

const route = useRoute();
const loading = ref(false);
const editor = ref(false);
const title = ref('');
const orderId = ref('');

const formConfig = ref({});
const params = createObjectByUrlParams({ route });
const getSceneInfo = ref(['P-ECYX-001', 'P-IN-01', 'P-QY-01'].includes(params.productId));
const renderFields = RenderFieldsInit(editor.value, { ...params, ...{ getSceneInfo: getSceneInfo.value }, handler });

const ruleFormRef = ref<RefType>();
const formFieldsLayoutRef = ref<RefType>();

const form = reactive({
	showFields: renderFields,
	formData: {} as EmptyObjectType,
	rulesData: {} as EmptyObjectType
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

// 查询接口
async function initQuery(data?: EmptyObjectType) {
	// 设置渲染表单
	setFormRenderByData(form, params, { getSceneInfo: getSceneInfo.value });
}

/**
 * @description 联系人等表格操作项
 */
function handler(key: any, data: any, rows: any, button: EmptyObjectType, scope: any, item: any): void {
	const refs = { orderContactInfos: contactRef.value };
	tableHandler(key, rows, scope.$index, item, form, refs);
}

// 返回
const back = () => {
	goToUrl(`/xdboss/order/list`, route);
};

onMounted(async () => {
	await initQuery();
});
</script>
