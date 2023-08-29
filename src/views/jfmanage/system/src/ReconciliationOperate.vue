<template>
	<LayoutDialog ref="dialogRef" isHeaderClose editor isFixed :fixed="{ width: '1000px', height: '60%' }" model="waring">
		<template #header>操作记录</template>

		<template #render v-if="isRender">
			<ListContent
				isTableHeader
				v-model:showFields="table.showFields"
				:data="table"
				:showTableLock="false"
				:isTooltips="false"
				@refreshFunction="refreshFunction"
			/>
		</template>
	</LayoutDialog>
</template>

<script setup lang="ts" name="ReconciliationOperate">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { queryReconciliationOperateRecord } from '/@/api/jfmanage/system';

const emit = defineEmits(['submit', 'update:form']);

const isRender = ref(false);
const dialogRef = ref();
const ruleFormRef = ref();
const form = reactive({
	pages: { page: 1, size: 20, total: 0 },
	data: {}
});

const table = reactive({
	title: '操作记录列表',
	isSerialNo: true,
	isSelection: false,
	isColumSetting: true,
	list: [],

	showFields: {
		operatorName: { key: '操作人', width: '100px' },
		createTime: { key: '操作日期', timestamp: true, timeFormat: 'date', width: '120px' },
		record: { key: '操作记录' },
		remark: { key: '备注' }
	}
});

// 刷新方法
const refreshFunction = async () => {
	return await initQuery({ ...form.data, pages: form.pages });
};

// 查询接口
async function initQuery(data?: EmptyObjectType, loading: boolean = true) {
	const rs: any = await queryReconciliationOperateRecord({ ...data, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data;
		form.pages.total = rs.total;
	}
}

// 打开弹窗
const openDialog = async (rows: EmptyObjectType) => {
	form.data = { reconciliationId: rows.id };
	await initQuery(form.data);

	isRender.value = true;
	dialogRef.value.open();
};

// 关闭弹窗
const closeDialog = () => {
	isRender.value = false;
	dialogRef.value.close();
};

// 暴露变量
defineExpose({ openDialog, closeDialog });
</script>
