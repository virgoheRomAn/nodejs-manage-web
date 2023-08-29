<template>
	<LayoutDialog ref="dialogRef" isHeaderClose editor model="footerPaging">
		<template #header>排除记录</template>

		<template #render v-if="isRender">
			<ListContent isTableHeader v-model:showFields="table.showFields" :data="table" :showTableLock="false" @refreshFunction="refreshFunction">
				<template #search>
					<ListHeader
						buttonLayout="inline"
						:showFields="form.showFields"
						:rules="form.rules"
						:isExtends="false"
						:isUseToggle="false"
						isContentInner
						@submit="handleSubmit"
					/>
				</template>
			</ListContent>
		</template>

		<template #footerPaging>
			<ListFooter :pages="form.pages" @change="handlePaginationChange" />
		</template>
	</LayoutDialog>
</template>

<script setup lang="ts" name="ReconciliationExclude">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { queryReconciliationFailureList } from '/@/api/jfmanage/system';

const emit = defineEmits(['submit', 'update:form']);

const isRender = ref(false);
const dialogRef = ref();
const ruleFormRef = ref();
const form = reactive({
	pages: { page: 1, size: 20, total: 0 },

	showFields: {
		party: { key: '对账系统', value: '' },
		serialNo: { key: '流水号', value: '' },
		dates: {
			key: '对账范围',
			value: [],
			setAjaxValue: ['startOperationTime', 'endOperationTime'],
			fieldValue: [{ startOperationTime: { value: '' } }, { endOperationTime: { value: '' } }],
			isNotTimestamp: true,
			isCutting: true,
			daterange: true
		}
	},

	data: {},
	rules: {}
});

const table = reactive({
	title: '排除记录列表',
	isSerialNo: true,
	isSelection: false,
	isColumSetting: true,
	list: [],

	showFields: {
		operatorName: { key: '操作人' },
		operationTime: { key: '操作日期', timestamp: true, timeFormat: 'date' },
		partyA: { key: '对账系统' },
		idA: { key: '流水号' },
		amountA: { key: '流水金额', moneyFormat: true },
		partyB: { key: '对账系统' },
		idB: { key: '流水号' },
		amountB: { key: '流水金额', moneyFormat: true },
		name: { key: '备注' }
	}
});

// 条件筛选
function handleSubmit(data: any) {
	form.pages.page = 1;
	form.data = data;
	nextTick(async () => {
		await initQuery(data);
	});
}

// 分页查询
function handlePaginationChange(val: any) {
	form.pages = val;
	nextTick(async () => {
		await initQuery(U.formatFormData(form.data));
	});
}

// 刷新方法
const refreshFunction = async () => {
	return await initQuery({ ...form.data, pages: form.pages });
};

// 查询接口
async function initQuery(data?: EmptyObjectType, loading: boolean = true) {
	data!.status = 'EXCLUDED';

	const rs: any = await queryReconciliationFailureList({ ...data, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data;
		form.pages.total = rs.total;
	}
}

// 打开弹窗
const openDialog = async () => {
	await initQuery({});

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
