<template>
	<div class="vhm-layout-container">
		<LayoutContainer title="对账查询" :scrollBarCls="isPageTableFixed ? 'is-table-fixed' : ''" isFixed :loading="loading">
			<template #default>
				<ListContent
					isTableHeader
					v-model:showFields="table.showFields"
					:loading="loading"
					:data="table"
					:handlerList="{ handler, handleSelectionChange }"
					@buttonHandler="buttonHandler"
					@refreshFunction="refreshFunction"
				>
					<template #search>
						<ListHeader
							ref="searchFormRef"
							buttonLayout="block"
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

			<template #footer>
				<ListFooter :pages="form.pages" @change="handlePaginationChange" />
			</template>
		</LayoutContainer>

		<!-- 对账详情 -->
		<ReconciliationDetails ref="reconciliationDetailsRef" />
		<!-- 排除记录 -->
		<ReconciliationExclude ref="reconciliationExcludeRef" />
		<!-- 操作记录 -->
		<ReconciliationOperate ref="reconciliationOperateRef" />
		<!-- 失败原因 -->
		<ReconciliationFailureCause ref="reconciliationFailureCauseRef" />
		<!-- 发起人工对账 -->
		<ReconciliationManualProcess ref="reconciliationManualProcessRef" @submit="initQuery" />
	</div>
</template>

<script setup lang="ts" name="jfManage.system.reconciliation">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { parataxis } from '/@/plugins/request';
import { usePageSetting } from '/@/stores/modules/page';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { searchPromissionPoint } from '/@/hooks/usePermissionPoint';
import { queryReconciliationTypes, queryReconciliationList, reconciliationRetry } from '/@/api/jfmanage/system';

const ReconciliationDetails = defineAsyncComponent(() => import('./src/ReconciliationDetails.vue'));
const ReconciliationExclude = defineAsyncComponent(() => import('./src/ReconciliationExclude.vue'));
const ReconciliationOperate = defineAsyncComponent(() => import('./src/ReconciliationOperate.vue'));
const ReconciliationFailureCause = defineAsyncComponent(() => import('./src/ReconciliationFailureCause.vue'));
const ReconciliationManualProcess = defineAsyncComponent(() => import('./src/ReconciliationManualProcess.vue'));
const reconciliationDetailsRef = ref<RefType>();
const reconciliationExcludeRef = ref<RefType>();
const reconciliationOperateRef = ref<RefType>();
const reconciliationFailureCauseRef = ref<RefType>();
const reconciliationManualProcessRef = ref<RefType>();

const hasPermission = ref(searchPromissionPoint('jrBoss.order.list'));
const storesPageSetting = usePageSetting();
const isPageTableFixed = computed(() => storesPageSetting.pageTableFixed);

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const searchFormRef = ref<RefType>();
const reconciliationTypes = ref<Array<any>>([]);

const form = reactive({
	pages: { page: 1, size: 20, total: 0 },

	showFields: {
		code: { key: '对账类型', value: '', select: [] as Array<any> },
		type: { key: '放回款类型', value: '', select: C.jfManageDict.AccountingType },
		dates: {
			key: '对账范围',
			value: [],
			setAjaxValue: ['startDate', 'endDate'],
			fieldValue: [{ startDate: { value: '' } }, { endDate: { value: '' } }],
			isNotTimestamp: true,
			isCutting: true,
			daterange: true
		},
		daterange: {
			key: '操作日期',
			value: [],
			setAjaxValue: ['startOperationTime', 'endOperationTime'],
			fieldValue: [{ startOperationTime: { value: '' } }, { endOperationTime: { value: '' } }],
			isCutting: true,
			daterange: true
		}
	},

	data: {},
	rules: {}
});

const table = reactive({
	title: '对账查询列表',
	isSerialNo: true,
	isSelection: false,
	isColumSetting: true,
	list: [],

	handleList: [
		{ text: '排除记录', style: 'warning', emit: 'excluded' },
		{ text: '人工对账', style: 'primary', emit: 'manual' }
	],

	showFields: {
		type: { key: '放回款类型', convert: C.jfManageDict.AccountingType },
		name: { key: '对账类型' },
		date: { key: '对账范围', timerange: true, timeFormat: 'date', rangeField: ['date', 'date2'], rangeSplit: '至' },
		operatorName: { key: '操作人' },
		operationTime: { key: '操作日期', timestamp: true, timeFormat: 'date' },
		status: { key: '对账结果', convert: C.jfManageDict.AccountingStatus },
		handler: {
			key: '操作',
			width: '250px',
			statusFields: 'status',
			buttons: [
				{ text: '失败原因', type: 'danger', emit: 'cause', includeStatus: ['FAILURE'] },
				{ text: '操作记录', type: 'primary', emit: 'record', includeStatus: ['FAILURE'] },
				{ text: '重新对账', type: 'warning', emit: 'again', includeStatus: ['FAILURE'] },
				{ text: '详情', type: 'primary', emit: 'details', includeStatus: ['SUCCESS'] }
			]
		}
	}
});

// 选择表格多选
const handleSelectionChange = (val: any) => {};

// 绑定的按钮操作
const handler = async (key: string, data: EmptyObjectType, rows: EmptyObjectType, button: EmptyObjectType) => {
	switch (key) {
		case 'cause':
			reconciliationFailureCauseRef.value.openDialog(rows);
			break;
		case 'record':
			reconciliationOperateRef.value.openDialog(rows);
			break;
		case 'again':
			const startOperatorType = rows.startOperatorType;
			if (startOperatorType === 'MANUAL') {
				reconciliationManualProcessRef.value.openDialog({ reconciliationTypes: reconciliationTypes.value, isRetry: true, ...rows });
			} else {
				jBox.confirm(`是否确认重新对账？`, '温馨提示', {
					callback: async (action: any) => {
						if (!!action && action !== 'cancel') {
							const rs = await reconciliationRetry({ id: rows.id });
							if (rs.code === 'SUCCESS') {
								jBox.success('重新对账成功！');
							}
						}
					}
				});
			}
			break;
		case 'details':
			reconciliationDetailsRef.value.openDialog(rows);
			break;
	}
};

// 绑定的按钮操作
async function buttonHandler(emit: string, data: EmptyObjectType) {
	switch (emit) {
		case 'manual':
			reconciliationManualProcessRef.value.openDialog({ reconciliationTypes: reconciliationTypes.value });
			break;
		case 'excluded':
			reconciliationExcludeRef.value.openDialog();
			break;
	}
}

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
	const rs: any = await queryReconciliationList({ ...data, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data;
		form.pages.total = rs.total;
	}
}

onMounted(async () => {
	parataxis([
		{
			fun: queryReconciliationTypes({}, false),
			callback: (rs: ResponesResult) => {
				if (rs.code === 'SUCCESS') {
					reconciliationTypes.value = U.formatPickerData(rs.data, 'name', 'code') as Array<any>;
					form.showFields.code.select = reconciliationTypes.value;
				}
			}
		},
		{
			fun: initQuery({}, false),
			callback: () => {}
		}
	]);
});
</script>
