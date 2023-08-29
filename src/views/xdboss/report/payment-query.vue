<template>
	<div class="vhm-layout-container">
		<LayoutContainer title="回款明细查询" :scrollBarCls="isPageTableFixed ? 'is-table-fixed' : ''" isFixed :loading="loading">
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
							isUseToggle
							isMain
							isContentInner
							@submit="handleSubmit"
						/>
					</template>

					<template #statistic="{ statistic }">
						<label>已收本金合计：{{ U.moneyFormat(statistic.repaidPrincipalSum) }} 元</label>
						<label>已收利息合计：{{ U.moneyFormat(statistic.repaidInterestSum) }} 元</label>
						<label>已收罚息合计：{{ U.moneyFormat(statistic.repaidPenaltySum) }} 元</label>
						<label>已收费用合计：{{ U.moneyFormat(statistic.repaidFeeSum) }} 元</label>
						<label>已收总额合计：{{ U.moneyFormat(statistic.repaidAmtSum) }} 元</label>
					</template>
				</ListContent>
			</template>

			<template #footer>
				<ListFooter :pages="form.pages" @change="handlePaginationChange" />
			</template>
		</LayoutContainer>
	</div>
</template>

<script setup lang="ts" name="xdBoss.report.payment">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { usePageSetting } from '/@/stores/modules/page';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { searchPromissionPoint } from '/@/hooks/usePermissionPoint';
import { queryRepaymentReport } from '/@/api/xdboss/report';

const hasPermission = ref(searchPromissionPoint('jrBoss.order.list'));
const storesPageSetting = usePageSetting();
const isPageTableFixed = computed(() => storesPageSetting.pageTableFixed);

const listContentRef = ref<RefType>();
const searchFormRef = ref<RefType>();

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const exporTabletParams = ref({});

const form = reactive({
	pages: { page: 1, size: 20, total: 0 },

	showFields: {
		productNum: {
			key: '产品名称',
			value: '',
			cls: 'long',
			cascaderProps: { tags: true, tagTooltip: true, emitPath: false, multiple: true, label: 'text', value: 'code' },
			cascader: { ref: 'productNum', separator: '-', data: C.xdDict.ProductCascaderList },
			filterable: false,
			isMain: true
		},
		receiptNum: { key: '借据编号', value: '', isMain: true },
		customerName: { key: '客户名称', value: '' },
		sourceChannel: { key: '保证金渠道', value: '' },
		repayChannel: { key: '代扣渠道', value: '', select: C.filterDictsByProId('repayChannel', '') },
		repaidAmt: { key: '已收金额合计', value: '' },
		dates: {
			key: '还款时间',
			value: [],
			setAjaxValue: ['startTime', 'endTime'],
			fieldValue: [{ startTime: { value: '' } }, { endTime: { value: '' } }],
			isCutting: true,
			daterange: true,
			isMain: true
		}
	},

	data: {},
	rules: {}
});

// 导出设置
const exportOpts = reactive({
	isExport: true,
	filename: '回款明细表',
	fields: {},
	fn: exportUserDetailTable
});

const table = reactive({
	title: '回款明细列表',
	isSerialNo: true,
	isSelection: false,
	isColumSetting: true,
	statistic: {} as EmptyObjectType,
	list: [],

	// handleList: [
	// 	{
	// 		text: '导出',
	// 		style: 'success',
	// 		filename: '回款明细表',
	// 		fn: exportUserDetailTable
	// 	}
	// ],

	showFields: {
		productName: { key: '产品名称', width: '180px' },
		customerName: { key: '客户姓名', width: '100px' },
		receiptNum: { key: '借据编号', link: true, width: '250px' },
		rate: { key: '借款利率', width: '100px' },
		loanTerm: { key: '放款期数', width: '100px' },
		loanAmount: { key: '借款金额', moneyFormat: true, width: '150px' },
		repaidPrincipal: { key: '已收本金', moneyFormat: true, width: '150px' },
		repaidInterest: { key: '已收利息', moneyFormat: true, width: '150px' },
		repaidPenalty: { key: '已收罚息', moneyFormat: true, width: '150px' },
		repaidFee: { key: '已收费用', moneyFormat: true, width: '150px' },
		repaidAmt: { key: '已收总额', moneyFormat: true, width: '150px' },
		repayChannel: { key: '代扣渠道', convert: C.filterDictsByProId('repayChannel', '') },
		sourceChannel: { key: '保证金渠道' },
		repayTime: { key: '还款时间', timestamp: true, width: '200px' }
	}
});

// 选择表格多选
const handleSelectionChange = (val: any) => {};

// 绑定的按钮操作
const handler = async (key: string, data: EmptyObjectType, rows: EmptyObjectType, button: EmptyObjectType) => {
	switch (key) {
		case 'details':
			const query = { receiptNum: rows.receiptNum, productNum: rows.productNum, returnUrl: route.fullPath };
			router.push({ path: `/xdboss/report/payment-query-details`, query });
			break;
	}
};

// 条件筛选
function handleSubmit(data: any, isToggle: boolean) {
	form.pages.page = 1;
	form.data = data;
	nextTick(async () => {
		isToggle && (await initQuery(data));
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
	const rs = await queryRepaymentReport({ ...form.data, pages: { page: 1, size: 10000 } });
	if (rs.code === 'SUCCESS') {
		rs.data = rs.data.resultList;
	}

	return rs;
}

// 查询接口
async function initQuery(data?: EmptyObjectType, loading: boolean = true) {
	const rs: any = await queryRepaymentReport({ ...data, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data.resultList;
		table.statistic = rs.data.resultSums || {};
		form.pages.total = rs.total;
	}
}
</script>
