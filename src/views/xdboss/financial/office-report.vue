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
		</LayoutContainer>
	</div>
</template>

<script setup lang="ts" name="xdBoss.office.report">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { createObjectByUrlParams, goToUrl } from '/@/hooks/useRoute';
import { setRenderFormByAjaxData } from '/@/hooks/customForm/useFormFields';
import { queryListByPageHandler } from '/@/hooks/customForm/xdboss/formHandleCall';
import { financeOfficeReport } from '/@/api/xdboss/financial';

const route = useRoute();
const loading = ref(false);
const editor = ref(true);
const title = ref('金融办上报');

const formConfig = ref({});
const params = createObjectByUrlParams({ route });

const ruleFormRef = ref<RefType>();
const formFieldsLayoutRef = ref<RefType>();
const repayRecordTableMerge = ref<any[]>([]);

const form = reactive({
	showFields: {
		handle: {
			key: '执行数据',
			render: 'object',
			value: {
				pullDate: { key: '上报月份', value: '', datetime: true, dateType: 'month', format: 'YYYY-MM', valueFormat: 'YYYY-MM' },
				tyFKDataPull: {
					key: '第一步',
					isButton: true,
					text: '拉取放款数据',
					status: '',
					isNotrequired: true,
					isNotAjax: true,
					column: true,
					handle: executeTask
				},
				tyHTDataPull: {
					key: '第二步',
					isButton: true,
					text: '拉取合同数据',
					status: '',
					isNotrequired: true,
					isNotAjax: true,
					column: true,
					handle: executeTask
				},
				tyWQDataPull: {
					key: '第三步',
					isButton: true,
					text: '拉取网签数据',
					status: '',
					isNotrequired: true,
					isNotAjax: true,
					column: true,
					handle: executeTask
				},
				tyHKDataPull: {
					key: '第四步',
					isButton: true,
					text: '拉取还款数据',
					status: '',
					isNotrequired: true,
					isNotAjax: true,
					column: true,
					handle: executeTask
				},
				tyHKJHDataPull: {
					key: '第五步',
					isButton: true,
					text: '还款计划数据',
					status: '',
					isNotrequired: true,
					isNotAjax: true,
					column: true,
					handle: executeTask
				}
			}
		}
	},
	formData: {} as EmptyObjectType,
	rulesData: {} as EmptyObjectType
});

// 查询接口
async function initQuery(data?: EmptyObjectType) {
	// 生成form
	form.formData = U.formatFormData(form.showFields);
	// 生成规则集
	form.rulesData = U.createRuleData(form.showFields);
}

// 拉取数据
async function executeTask(key: string, item: EmptyObjectType) {
	console.log(item);
	await ruleFormRef.value.validate(async (valid: boolean, fields: any) => {
		if (valid) {
			try {
				const rs = await financeOfficeReport({ key, ...U.doEmptyObject(form.formData) });
				if (rs.code === 'SUCCESS') {
					item.status = 'success';
				}
			} catch (error) {
				item.status = 'error';
				jBox.error('拉取数据异常!');
			}
		} else {
			if (!!fields) {
				const errMsg = Object.values(fields as EmptyObjectType)[0][0].message;
				jBox.error(errMsg);
			}
		}
	});
}

// 返回
const back = () => {
	goToUrl(`/xdboss/financial/receipt`, route);
};

onMounted(async () => {
	await initQuery();
});
</script>
