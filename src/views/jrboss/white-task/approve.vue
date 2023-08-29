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
					<FormFieldsLayout :isView="!editor" :editor="editor" :showFields="form.showFields" :formData="form.formData" :rulesData="form.rulesData" />
				</el-form>
			</template>

			<template #footer>
				<el-button @click="back()">返回</el-button>
				<el-button type="primary" @click="submit()" v-if="editor">审批</el-button>
			</template>
		</LayoutContainer>
	</div>
</template>

<script setup lang="ts" name="xdBoss.task.todo.debtTransfer">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { createObjectByUrlParams, goToUrl } from '/@/hooks/useRoute';
import { fileUploadOptions } from '/@/hooks/customForm/useFormUpload';
import { setRenderFormByAjaxData, filterReadonlyFieldForm } from '/@/hooks/customForm/useFormFields';
import { queryListByPageHandler } from '/@/hooks/customForm/xdboss/formHandleCall';
import { queryUserApplyDetail, approvalUserApply } from '/@/api/jrboss/customer';

const route = useRoute();
const loading = ref(false);
const ruleFormRef = ref<RefType>();

const params = createObjectByUrlParams({ route });
const editor = computed(() => params.editor === '1');
const title = computed(() => (editor.value ? '客户入库审批' : '客户入口详情'));

const form = reactive({
	showFields: {
		apply: {
			key: '申请信息',
			render: 'object',
			value: {
				id: { key: '任务编号', value: '', editor: false, isNotrequired: true },
				createTime: { key: '申请时间', value: '', datetime: true, editor: false, isNotrequired: true },
				name: { key: '客户姓名', value: '', editor: false, isNotrequired: true },
				phoneNum: { key: '手机号码', value: '', editor: false, isNotrequired: true },
				idNo: { key: '客户身份证号码', value: '', editor: false, isNotrequired: true },
				creatorName: { key: '申请人', value: '', editor: false, isNotrequired: true },
				channelSimpleName: { key: '申请渠道', value: '', editor: false, isNotrequired: true },
				applyAmount: { key: '申请金额', value: '', editor: false, isNotrequired: true },
				thirdApprovalTime: { key: '浙商审批通过时间', value: '', datetime: true, readonly: !editor.value, isNotrequired: !editor.value }
			}
		},

		attachmentInfo: {
			key: '附件信息',
			render: 'object',
			value: {
				attachments: {
					key: '附件信息',
					value: [],
					isUpload: true,
					isNotrequired: true,
					completeResult: { formatField: { filepath: '%accessKey%' }, replaceField: { accessKey: 'filepath' } },
					...fileUploadOptions({ isFile: true }, { max: 10 })
				}
			}
		},

		formOperationInfo: {
			key: '操作处理',
			render: 'object',
			isNotRenderShow: !editor.value,
			value: {
				result: { key: '审批结果', value: '', column: true, select: C.jrDict['WhiteTaskApprove'] }
			}
		}
	},

	formData: {} as EmptyObjectType,
	rulesData: {} as EmptyObjectType
});

// 查询接口
async function initQuery() {
	// 生成form
	form.formData = U.formatFormData(form.showFields);
	form.rulesData = U.createRuleData(form.showFields);

	const loading = jBox.loading('数据加载中...');

	try {
		const rs = await queryUserApplyDetail({ id: params.taskId }, false);
		if (rs.code === 'SUCCESS') {
			jBox.closeById(loading);
			// 设置渲染数据
			setRenderFormByAjaxData(form, form.formData, form.showFields, rs);
		}
	} catch (error) {
		jBox.closeById(loading);
		throw new Error((error as Error).message);
	}
}

// 提交审批
const submit = async () => {
	const formData = U.doEmptyObject(form.formData);

	await ruleFormRef.value.validate(async (valid: boolean, fields: any) => {
		if (valid) {
			const opts = { id: params.taskId, attachments: formData.attachments, thirdApprovalTime: formData.thirdApprovalTime, result: formData.result };

			const rs = await approvalUserApply(opts);
			if (rs.code === 'SUCCESS') {
				jBox.success('审批成功！');
				back();
			}
		} else {
			if (!!fields) {
				const errMsg = Object.values(fields as EmptyObjectType)[0][0].message;
				jBox.error(errMsg);
			}
		}
	});
};

// 返回
const back = () => {
	const returnUrl = params.returnUrl;

	goToUrl(returnUrl ? returnUrl : `/jrboss/whitetask/record`, route);
};

onMounted(async () => {
	await initQuery();
});
</script>
