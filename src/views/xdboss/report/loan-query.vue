<template>
	<div class="vhm-layout-container">
		<LayoutContainer title="放款明细查询" :scrollBarCls="isPageTableFixed ? 'is-table-fixed' : ''" isFixed :loading="loading">
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
						<label>借款金额合计：{{ U.moneyFormat(statistic.loanAmountSum) }} 元</label>
					</template>
				</ListContent>
			</template>

			<template #footer>
				<ListFooter :pages="form.pages" @change="handlePaginationChange" />
			</template>
		</LayoutContainer>
	</div>
</template>

<script setup lang="ts" name="xdBoss.report.loans">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { usePageSetting } from '/@/stores/modules/page';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { searchPromissionPoint } from '/@/hooks/usePermissionPoint';
import { queryLoansReport } from '/@/api/xdboss/report';

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
		loanTerm: { key: '放款期数', value: '' },
		rate: { key: '借款利率', value: '' },
		sourceChannel: { key: '保证金渠道', value: '' },
		repayStatus: { key: '借据状态', value: '', select: C.xdDict.IouRepayingStatus },
		loanAmount: { key: '借款金额', value: '' },
		dates: {
			key: '放款日期',
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
	filename: '放款明细表',
	fields: {},
	extra: { beforeValidateFn: exreportBeforeValidateFn },
	fn: exportUserDetailTable
});

const table = reactive({
	title: '放款明细列表',
	isSerialNo: true,
	isSelection: false,
	isColumSetting: true,
	statistic: {} as EmptyObjectType,
	list: [],

	// handleList: [
	// 	{
	// 		text: '导出',
	// 		style: 'success',
	// 		filename: '放款明细表',
	// 		extra: { beforeValidateFn: exreportBeforeValidateFn },
	// 		fn: exportUserDetailTable
	// 	}
	// ],

	showFields: {
		productName: { key: '产品名称' },
		customerName: { key: '客户姓名' },
		receiptNum: { key: '借据编号', link: true, emit: 'details', width: '280px' },
		rate: { key: '借款利率', suffix: '%' },
		loanTerm: { key: '放款期数' },
		loanDate: { key: '放款时间', width: '160px' },
		loanAmount: { key: '借款金额', moneyFormat: true },
		repayingStatus: { key: '借据状态', convert: C.xdDict.IouRepayingStatus },
		sourceChannel: { key: '保证金渠道' }
	}
});

// 选择表格多选
const handleSelectionChange = (val: any) => {};

// 绑定的按钮操作
const handler = async (key: string, data: EmptyObjectType, rows: EmptyObjectType, button: EmptyObjectType) => {
	switch (key) {
		case 'details':
			const query = { receiptNum: rows.receiptNum, productNum: rows.productNum, returnUrl: route.fullPath };
			router.push({ path: `/xdboss/report/loan-query-details`, query });
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

// 导出之前验证函数
async function exreportBeforeValidateFn() {
	const formData = searchFormRef.value.formData;
	const date = formData.dates;
	const diff = 100 * 24 * 60 * 60 * 1000;
	const start = formData['startTime'];
	const end = formData['endTime'];

	if (!start && !end) {
		jBox.error(`请选择放款时间`);
		return false;
	}

	if (end - start > diff) {
		jBox.error(`时间跨度需要 ≤100天`);
		return false;
	}

	form.data = U.doEmptyObject(U.clone(formData));
}

// 导出客户明细表
async function exportUserDetailTable() {
	const rs = await queryLoansReport({ ...form.data, pages: { page: 1, size: 10000 } });
	if (rs.code === 'SUCCESS') {
		rs.data = rs.data.resultList;
	}

	return rs;
}

// 查询接口
async function initQuery(data?: EmptyObjectType, loading: boolean = true) {
	const rs: any = await queryLoansReport({ ...data, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data.resultList;
		table.statistic = rs.data.resultSums || {};
		form.pages.total = rs.total;
	}
}
</script>
