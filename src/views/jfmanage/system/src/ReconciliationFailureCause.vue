<template>
	<LayoutDialog ref="dialogRef" isHeaderClose editor isFixed :fixed="{ width: '1000px', height: '75%' }" model="custom">
		<template #header>失败原因</template>

		<template #render v-if="isRender">
			<ListContent
				isTableHeader
				v-model:showFields="table.showFields"
				:data="table"
				:showTableLock="false"
				:isTooltips="false"
				:handlerList="{ handleSelectionChange }"
				@refreshFunction="refreshFunction"
			/>

			<el-form
				ref="ruleFormRef"
				class="form-box form-box--long form-box-view"
				:validate-on-rule-change="false"
				:model="form.formData"
				:rules="form.rulesData"
				:inline="false"
				label-width="120px"
			>
				<FormFieldsLayout
					:isView="false"
					editor
					:formSetting="{ cardContCls: 'plr20' }"
					:showFields="form.showFields"
					:formData="form.formData"
					:rulesData="form.rulesData"
				/>
			</el-form>
		</template>

		<template #customButtom>
			<el-button type="primary" @click="handle('PROCESSED')">处理</el-button>
			<el-button type="primary" @click="handle('EXCLUDED')">排除</el-button>
		</template>
	</LayoutDialog>
</template>

<script setup lang="ts" name="ReconciliationFailureCause">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { fileUploadOptions } from '/@/hooks/customForm/useFormUpload';
import { setRenderFormByAjaxData } from '/@/hooks/customForm/useFormFields';
import { queryReconciliationFailureList, failureItemProcess } from '/@/api/jfmanage/system';

const emit = defineEmits(['submit', 'update:form']);

const isRender = ref(false);
const dialogRef = ref();
const ruleFormRef = ref();
const formData = ref<EmptyObjectType>({});
const causeTableCurrent = reactive<EmptyObjectType>({
	id: '',
	currentRows: [] as any[]
});

const form = reactive({
	showFields: {
		base: {
			key: '处理信息',
			render: 'object',
			value: {
				fileA: {
					key: '',
					defaultKey: '对账文件',
					value: [],
					setKeyField: 'partyA',
					isUpload: true,
					block: true,
					editor: false,
					...fileUploadOptions({ isFile: true, valueType: 'string' }, { max: 1 })
				},
				fileB: {
					key: '',
					defaultKey: '对账文件',
					value: [],
					setKeyField: 'partyB',
					isUpload: true,
					block: true,
					editor: false,
					...fileUploadOptions({ isFile: true, valueType: 'string' }, { max: 1 })
				},
				remark: { key: '备注', value: '', textarea: true, editor: true, isNotSetData: true, block: true }
			}
		}
	} as EmptyObjectType,

	formData: {} as EmptyObjectType,
	rulesData: {} as EmptyObjectType
});

const table = reactive({
	title: '失败原因列表',
	isSerialNo: true,
	isSelection: true,
	isColumSetting: true,
	selectableFn: (rows: EmptyObjectType) => rows.status === 'UNPROCESSED',
	list: [],

	showFields: {
		failureMessage: { key: '失败原因' },
		status: { key: '状态', convert: C.jfManageDict.AccountingFailureStatus, width: '100px' }
	}
});

// 刷新方法
const refreshFunction = async () => {
	return await initQuery({ ...formData.value });
};

// 查询接口
async function initQuery(data?: EmptyObjectType, loading: boolean = true) {
	const rs: any = await queryReconciliationFailureList({ ...data }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data;
	}
}

// 选择表格多选
const handleSelectionChange = (val: Array<any>) => {
	causeTableCurrent.currentRows = val;
};

// 处理和排除
async function handle(type: string) {
	const { id, currentRows } = causeTableCurrent;
	const failureItemIds = currentRows.map((x: any) => x.id);

	if (failureItemIds.length === 0) {
		jBox.error('请选择需要处理的失败数据！');
		return false;
	}

	const rs = await failureItemProcess({ id, failureItemIds, status: type, remark: form.formData.remark });
	if (rs.code === 'SUCCESS') {
		jBox.success('处理成功！');

		// 请求列表
		await initQuery(formData.value);
	}
}

// 打开弹窗
const openDialog = async (rows: EmptyObjectType) => {
	causeTableCurrent.id = rows.id;
	formData.value = { reconciliationId: rows.id };

	// 请求列表
	await initQuery(formData.value);

	// 设置数据
	setRenderFormByAjaxData(form, form.formData, form.showFields, { data: rows });

	isRender.value = true;
	dialogRef.value.open();
};

// 关闭弹窗
const closeDialog = () => {
	isRender.value = false;
	dialogRef.value.close();
};

onMounted(() => {
	form.formData = U.formatFormData(form.showFields);
});

// 暴露变量
defineExpose({ openDialog, closeDialog });
</script>
