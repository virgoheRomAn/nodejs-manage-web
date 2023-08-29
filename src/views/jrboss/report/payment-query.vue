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
import { queryRepaymentReport } from '/@/api/jrboss/report';

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
		username: { key: '客户名称', value: '', isMain: true },
		loanNo: { key: '借据编号', value: '', isMain: true },
		productId: { key: '产品名称', value: '', select: C.jrDict['ReportProductList'] },
		channelSimpleName: { key: '来源渠道', value: '' },
		dates: {
			key: '还款时间',
			value: [],
			setAjaxValue: ['startTime', 'endTime'],
			fieldValue: [{ startTime: { value: '' } }, { endTime: { value: '' } }],
			isCutting: true,
			daterange: true,
			validation: true,
			isMain: true,
			days: 365,
			errorTips: '还款时间跨度不能超过 1年'
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

	showFields: {
		loanNo: { key: '借据编号', value: '', width: '250px' },
		repaySn: { key: '还款流水', value: '', width: '250px' },
		repayTime: { key: '还款时间', value: '', timestamp: true },
		username: { key: '客户名称', value: '' },
		productName: { key: '产品名称', value: '' },
		repaidAmt: { key: '入账金额', value: '', moneyFormat: true },
		repaidPrincipal: { key: '实还本金', value: '', moneyFormat: true },
		repaidInterest: { key: '实还利息', value: '', moneyFormat: true },
		repaidPenalty: { key: '实还罚息', value: '', moneyFormat: true },
		repaidFee: { key: '实还费用', value: '', moneyFormat: true },
		repaidServiceFee: { key: '实还服务费', value: '', moneyFormat: true },
		channelSimpleName: { key: '来源渠道', value: '' }
	}
});

// 选择表格多选
const handleSelectionChange = (val: any) => {};

// 绑定的按钮操作
const handler = async (key: string, data: EmptyObjectType, rows: EmptyObjectType, button: EmptyObjectType) => {};

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

// 导出
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
