<template>
	<div class="vhm-layout-container">
		<LayoutContainer title="在贷明细查询" :scrollBarCls="isPageTableFixed ? 'is-table-fixed' : ''" isFixed :loading="loading">
			<template #default>
				<ListContent
					ref="listContentRef"
					isTableHeader
					isTableInnerOverflow
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
						<label>借款金额合计：{{ U.moneyFormat(statistic.loanAmountSum) }} 元</label>
						<label>已收本金合计：{{ U.moneyFormat(statistic.repayedPrincipalSum) }} 元</label>
						<label>已收利息合计：{{ U.moneyFormat(statistic.repayedInterestSum) }} 元</label>
						<label>已收罚息合计：{{ U.moneyFormat(statistic.repayedOverduePenaltySum) }} 元</label>
						<label>已收费用合计：{{ U.moneyFormat(statistic.repayedFeeSum) }} 元</label>
						<label>已收总额合计：{{ U.moneyFormat(statistic.repayedTotalSum) }} 元</label>
						<label>借款余额合计：{{ U.moneyFormat(statistic.balanceSum) }} 元</label>
					</template>
				</ListContent>
			</template>

			<template #footer>
				<ListFooter :pages="form.pages" @change="handlePaginationChange" />
			</template>
		</LayoutContainer>
	</div>
</template>

<script setup lang="ts" name="xdBoss.report.onloan">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { usePageSetting } from '/@/stores/modules/page';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { searchPromissionPoint } from '/@/hooks/usePermissionPoint';
import { queryOnloanProgressReport } from '/@/api/xdboss/report';

const hasPermission = ref(searchPromissionPoint('xdBoss.report.onloan.edit'));
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
		belongDate: {
			key: '更新日期',
			value: '',
			datetime: true,
			isMain: true,
			disabledDate(time: Date) {
				return time.getTime() > Date.now();
			}
		},
		productNum: {
			key: '产品名称',
			value: '',
			cls: 'long',
			cascaderProps: { tags: true, tagTooltip: true, emitPath: false, multiple: true, label: 'text', value: 'code' },
			cascader: { ref: 'productNum', separator: '-', data: C.xdDict.ProductCascaderList },
			filterable: false,
			isMain: true
		},
		receiptNum: { key: '借据编号', value: '' },
		customerName: { key: '客户姓名', value: '' },
		loanTerm: { key: '放款期数', value: '' },
		rate: { key: '借款利率', value: '' },
		channelName: { key: '保证金渠道', value: '' },
		mlevel: { key: '逾期状态', value: '', select: C.xdDict.OverdueLevrls },
		dates: {
			key: '放款日期',
			value: [],
			setAjaxValue: ['loanDateStart', 'loanDateEnd'],
			fieldValue: [{ loanDateStart: { value: '' } }, { loanDateEnd: { value: '' } }],
			isCutting: true,
			daterange: true,
			isMain: true
		}
	},

	data: {},
	rules: {
		belongDate: [{ required: true, message: '请选择更新日期！' }]
	}
});

// 导出设置
const exportOpts = reactive({
	isExport: hasPermission.value,
	filename: '在贷明细报表',
	fields: {},
	extra: { beforeValidateFn: exreportBeforeValidateFn },
	fn: exportUserDetailTable
});

const table = reactive({
	title: '在贷明细列表',
	isSerialNo: true,
	isSelection: false,
	isColumSetting: true,
	statistic: {} as EmptyObjectType,
	list: [],

	showFields: {
		productName: { key: '产品名称', width: '180px' },
		customerName: { key: '客户姓名', width: '100px' },
		receiptNum: { key: '借据编号', link: true, emit: 'details', width: '250px' },
		rate: { key: '借款利率', width: '100px' },
		loanTerm: { key: '放款期数', width: '100px' },
		loanDate: { key: '放款时间', timestamp: true, width: '200px' },
		loanAmount: { key: '借款金额', moneyFormat: true, width: '150px' },
		repayedPrincipal: { key: '已收本金', moneyFormat: true, width: '150px' },
		repayedInterest: { key: '已收利息', moneyFormat: true, width: '150px' },
		repayedOverduePenalty: { key: '已收罚息', moneyFormat: true, width: '150px' },
		repayedFee: { key: '已收费用', moneyFormat: true, width: '150px' },
		repayedTotal: { key: '已收总额', moneyFormat: true, width: '150px' },
		balance: { key: '借款余额', moneyFormat: true, width: '150px' },
		mlevel: { key: '逾期状态', convert: C.xdDict['OverdueLevrls'], width: '100px' },
		channelName: { key: '保证金渠道', width: '150px' },
		belongDate: { key: '更新时间', timestamp: true, width: '200px' }
	}
});

// 选择表格多选
const handleSelectionChange = (val: any) => {};

// 绑定的按钮操作
const handler = async (key: string, data: EmptyObjectType, rows: EmptyObjectType, button: EmptyObjectType) => {
	switch (key) {
		case 'details':
			const query = { receiptNum: rows.receiptNum, productNum: rows.productNum, returnUrl: route.fullPath };
			router.push({ path: `/xdboss/report/loan-progress-details`, query });
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
	return await searchFormRef.value.handleFormSubmit(true);
};

// 导出之前验证函数
async function exreportBeforeValidateFn() {
	return searchFormRef.value.handleFormSubmit(false);
}

// 导出客户明细表
async function exportUserDetailTable() {
	const rs = await queryOnloanProgressReport({ ...form.data, pages: { page: 1, size: 10000 } });
	if (rs.code === 'SUCCESS') {
		rs.data = rs.data.resultList;
	}

	return rs;
}

// 查询接口
async function initQuery(data?: EmptyObjectType, loading: boolean = true) {
	const rs: any = await queryOnloanProgressReport({ ...data, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data.resultList;
		table.statistic = rs.data.resultSums || {};
		form.pages.total = rs.total;
	}
}
</script>
