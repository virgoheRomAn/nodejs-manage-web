<template>
	<div class="vhm-layout-container">
		<LayoutContainer title="批量发送" :scrollBarCls="isPageTableFixed ? 'is-table-fixed' : ''" isFixed :loading="loading">
			<template #default>
				<el-form
					class="form-box form-box--big form-box-validate"
					ref="ruleFormRef"
					scroll-to-error
					:validate-on-rule-change="false"
					:model="form.formData"
					:rules="form.rulesData"
					:inline="false"
					label-width="130px"
				>
					<FormFieldsLayout
						ref="formFieldsLayoutRef"
						:renderLevel="1"
						:isView="!editor"
						:editor="editor"
						:formSetting="{ cardContCls: 'pt10 plr20' }"
						:showFields="form.showFields"
						:formData="form.formData"
						:rulesData="form.rulesData"
						@cascaderChange="cascaderChange"
					/>
				</el-form>
			</template>

			<template #footer>
				<el-button type="primary" @click="send()">发送</el-button>
			</template>
		</LayoutContainer>
	</div>
</template>

<script setup lang="ts" name="jfManage.note.send">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { parataxis } from '/@/plugins/request';
import { usePageSetting } from '/@/stores/modules/page';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { fileUploadOptions } from '/@/hooks/customForm/useFormUpload';
import { searchPromissionPoint } from '/@/hooks/usePermissionPoint';
import { queryTitleTemplateSmsTemplate, sendBatchSms } from '/@/api/jfmanage/note';

const hasPermission = ref(searchPromissionPoint('jrBoss.order.list'));
const storesPageSetting = usePageSetting();
const isPageTableFixed = computed(() => storesPageSetting.pageTableFixed);

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const editor = ref(true);
const ruleFormRef = ref<RefType>();
const formFieldsLayoutRef = ref<RefType>();

const form = reactive({
	showFields: {
		fileKey: {
			key: '发送模板文件',
			value: [],
			block: true,
			isUpload: true,
			...fileUploadOptions(
				{ isOnlyExcel: true, valueType: 'string', tips: '注：excel第一列为手机号，后续几列根据模板参数依次录入' },
				{ max: 1, isGlobalTips: true }
			)
		},
		templateCode: {
			key: '模块名称',
			value: '',
			cls: 'long',
			cascaderProps: { emitPath: false, multiple: false, label: 'name', value: 'code' },
			cascader: { ref: 'templateCode', extraField: 'content', separator: '/', data: [] as any[] },
			filterable: false,
			block: true
		},
		textarea: { key: '模板内容', value: '', textarea: true, isNotAjax: true, disabled: true, block: true }
	},

	formData: {} as EmptyObjectType,
	rulesData: {}
});

// 级联选择
const cascaderChange = (code: Array<any>, text: Array<any>, key: string, item: EmptyObjectType) => {
	form.formData['textarea'] = item.extraFieldValue;
};

// 查询接口
async function initQuery() {
	const rs: any = await queryTitleTemplateSmsTemplate();
	if (rs.code === 'SUCCESS') {
		const data: any[] = rs.data || [];

		form.showFields.templateCode.cascader.data = data.map((item, index) => {
			return { code: `parent_${index + 1}`, name: item.title, children: item.templateList };
		});
	}
}

onMounted(async () => {
	form.formData = U.formatFormData(form.showFields);
	form.rulesData = U.createRuleData(form.showFields);

	await initQuery();
});

// 发送短信
async function send() {
	await ruleFormRef.value.validate(async (valid: boolean, fields: any) => {
		if (valid) {
			const rs = await sendBatchSms(form.formData);

			if (rs.code === 'SUCCESS') {
				jBox.warn(`批次号：${rs.data}`, '发送成功', {
					callback: () => {
						ruleFormRef.value.resetFields;
					}
				});
			}
		} else {
			if (!!fields) {
				const errMsg = Object.values(fields as EmptyObjectType)[0][0].message;
				jBox.error(errMsg);
			}
		}
	});
}
</script>
