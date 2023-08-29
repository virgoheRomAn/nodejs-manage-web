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

<script setup lang="ts" name="xdBoss.user.details">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { createObjectByUrlParams, goToUrl } from '/@/hooks/useRoute';
import { setRenderFormByAjaxData } from '/@/hooks/customForm/useFormFields';
import { tableHandler } from '/@/hooks/customForm/xdboss/formHandleCall';
import { RenderUserFields } from './src/renderFields';
import { queryUserInfo } from '/@/api/xdboss/usercenter';

// 引入组件
const Contact = defineAsyncComponent(() => import('/@/hooks/customForm/xdboss/Contact.vue'));
const contactRef = ref<RefType>();

const route = useRoute();
const loading = ref(false);
const editor = ref(false);
const title = ref('客户详情');

const formConfig = ref({});
const params = createObjectByUrlParams({ route });
const renderFields = RenderUserFields(editor.value, { ...params, handler });

const ruleFormRef = ref<RefType>();
const formFieldsLayoutRef = ref<RefType>();

const form = reactive({
	showFields: renderFields,
	formData: {} as EmptyObjectType,
	rulesData: {} as EmptyObjectType
});

// 查询接口
async function initQuery(data?: EmptyObjectType) {
	// 生成form
	form.formData = U.formatFormData(form.showFields);

	// 请求数据
	const rs = await queryUserInfo({ userId: params.userId, productNo: 'SELF_ID', categories: [1, 2] });
	if (rs.code === 'SUCCESS') {
		// 设置渲染数据
		setRenderFormByAjaxData(form, form.formData, form.showFields, rs);
	}
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
	goToUrl(`/xdboss/user/list`, route);
};

onMounted(async () => {
	await initQuery();
});
</script>
