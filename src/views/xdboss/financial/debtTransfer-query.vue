<template>
	<div class="vhm-layout-container">
		<LayoutContainer title="批量债转查询" :scrollBarCls="isPageTableFixed ? 'is-table-fixed' : ''" isFixed :loading="loading">
			<template #default>
				<ListContent
					ref="listContentRef"
					isTableHeader
					v-model:showFields="table.showFields"
					:loading="loading"
					:data="table"
					:exportOpts="exportOpts"
					:handlerList="{ handler, handleSelectionChange }"
					@refreshFunction="refreshFunction"
				>
					<template #search>
						<ListHeader
							ref="searchFormRef"
							buttonLayout="inline"
							:showFields="form.showFields"
							:rules="form.rules"
							:isExtends="false"
							:isUseToggle="false"
							:isMain="false"
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

		<!-- 发起债转 -->
		<RepayDebtTransferApply ref="repayDebtTransferApplyRef" @submit="applySubmitForm" />
	</div>
</template>

<script setup lang="ts" name="xdBoss.financial.debtTransfer.query">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { usePageSetting } from '/@/stores/modules/page';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { searchPromissionPoint } from '/@/hooks/usePermissionPoint';
import { queryDebtTransferList, queryDebtTransferItemList } from '/@/api/xdboss/financial';

const hasPermission = ref(searchPromissionPoint('jrBoss.order.list'));
const storesPageSetting = usePageSetting();
const isPageTableFixed = computed(() => storesPageSetting.pageTableFixed);

const RepayDebtTransferApply = defineAsyncComponent(() => import('./src/RepayDebtTransferApply.vue'));
const repayDebtTransferApplyRef = ref<RefType>();
const listContentRef = ref<RefType>();
const searchFormRef = ref<RefType>();

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const exporTabletParams = ref({});

const form = reactive({
	pages: { page: 1, size: 20, total: 0 },

	showFields: {
		id: { key: '批次号', value: '' },
		status: { key: '债转状态', value: '', select: C.xdDict['DebtTransferStatus'] },
		dates: {
			key: '更新日期',
			value: [],
			setAjaxValue: ['beginUpdateTime', 'endUpdateTime'],
			fieldValue: [{ beginUpdateTime: { value: '' } }, { endUpdateTime: { value: '' } }],
			isCutting: true,
			daterange: true,
			isMain: true
		}
	},

	data: {},
	rules: {}
});

const exportOpts = reactive({ isExport: false, filename: '订单列表', fields: {} });

const table = reactive({
	title: '批量债转列表',
	isSerialNo: true,
	isSelection: false,
	isColumSetting: true,
	list: [],

	handleList: [{ text: '发起债转申请', style: 'success', click: () => repayDebtTransferApplyRef.value.openDialog() }],

	showFields: {
		id: { key: '批次号', value: '', width: '200px' },
		amount: { key: '债转金额', value: '', moneyFormat: true },
		principal: { key: '债转本金', value: '', moneyFormat: true },
		interest: { key: '债转利息', value: '', moneyFormat: true },
		debtorNum: { key: '债转户数', value: '' },
		itemNum: { key: '债转笔数', value: '' },
		status: { key: '债转状态', value: '', convert: C.xdDict['DebtTransferStatus'] },
		operatorName: { key: '操作人', value: '' },
		updateTime: { key: '更新日期', value: '', timestamp: true, timeFormat: '{y}-{m}-{d}' },
		handler: {
			key: '操作',
			width: '160px',
			statusFields: 'status',
			buttons: [
				{ text: '详情', type: 'primary', emit: 'details', isAlways: true },
				{ text: '导出', type: 'success', emit: 'exportExcel', includeStatusValue: 'COMPLETED' }
			]
		}
	}
});

// 选择表格多选
const handleSelectionChange = (val: any) => {};

// 绑定的按钮操作
const handler = async (key: string, data: EmptyObjectType, rows: EmptyObjectType, button: EmptyObjectType) => {
	switch (key) {
		case 'details':
			const query1: EmptyObjectType = {
				editor: '0',
				detailId: rows.id,
				formKey: 'ycxd_ht_debt_transfer_order_detail',
				returnUrl: route.fullPath
			};
			router.push({ path: `/xdboss/financial/debtTransfer/query/details`, query: query1 });
			break;

		case 'exportExcel':
			const exportFields = {
				debtTransferId: { key: '批次号' },
				receiptContractNum: { key: '合同编号' },
				productNum: { key: '产品名称', convert: C.xdDict.DebtTransferProduct },
				debtorName: { key: '用户姓名' },
				loanTerm: { key: '期数' },
				rate: { key: '利率' },
				loanAmount: { key: '借款金额', moneyFormat: true },
				amount: { key: '债转总额', moneyFormat: true },
				principal: { key: '债转本金', moneyFormat: true },
				interest: { key: '债转利息', moneyFormat: true },
				accruedInterest: { key: '应计利息', moneyFormat: true },
				loanDate: { key: '放款日期', timestamp: true, timeFormat: 'date' },
				endDate: { key: '到期日期', timestamp: true, timeFormat: 'date' },
				date: { key: '债转日期', timestamp: true, timeFormat: 'date' },
				status: { key: '债转状态', convert: C.xdDict.DebtTransferStatus }
			};

			exporTabletParams.value = { debtTransferId: rows.id };
			listContentRef.value.exportDataList(exportFields, [], exportUserDetailTable, '债转明细表');
			break;
	}
};

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

// 导出客户明细表
async function exportUserDetailTable() {
	return await queryDebtTransferItemList({ ...exporTabletParams.value, pages: { page: 1, size: 5000 } });
}

// 查询接口
async function initQuery(data?: EmptyObjectType, loading: boolean = true) {
	const rs: any = await queryDebtTransferList({ ...data, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data;
		form.pages.total = rs.total;
	}
}

onAjaxInitData(() => {
	initQuery(form.data);
});

// 发起债转申请
async function applySubmitForm(data: EmptyObjectType) {
	router.push({ path: `/xdboss/financial/debtTransfer/apply`, query: { productCode: data.productCode } });
}
</script>
