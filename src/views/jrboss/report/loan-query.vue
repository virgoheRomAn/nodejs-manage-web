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
				</ListContent>
			</template>

			<template #footer>
				<ListFooter :pages="form.pages" @change="handlePaginationChange" />
			</template>
		</LayoutContainer>
	</div>
</template>

<script setup lang="ts" name="jrBoss.report.loans">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { usePageSetting } from '/@/stores/modules/page';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { searchPromissionPoint } from '/@/hooks/usePermissionPoint';
import { queryLoanReport } from '/@/api/jrboss/report';

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
		repayStatus: { key: '借据状态', value: '', select: C.jrDict['IouRepayingStatus'] },
		channelSimpleName: { key: '来源渠道', value: '' },
		overdueLevels: {
			key: '催收状态',
			value: '',
			select: C.jrDict['OverdueLevrls'],
			config: { multiple: true, 'collapse-tags': true }
		},
		dates: {
			key: '放款时间',
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
	fn: exportUserDetailTable
});

const table = reactive({
	title: '放款明细列表',
	isSerialNo: true,
	isSelection: false,
	isColumSetting: true,
	statistic: {} as EmptyObjectType,
	list: [],

	showFields: {
		loanNo: { key: '借据编号', value: '', width: '280px', fixed: 'left' },
		loanDate: { key: '放款日期', value: '', width: '180px', timestamp: true },
		username: { key: '客户名称', value: '', width: '100px' },
		productName: { key: '产品名称', value: '', width: '100px' },
		loanAmount: { key: '放款金额', value: '', width: '150px', moneyFormat: true },
		rate: { key: '利率', value: '', width: '90px' },
		loanTerm: { key: '借款总期数', value: '', width: '100px' },
		totalRepaidAmt: { key: '实还总金额', value: '', width: '150px', moneyFormat: true },
		repaidPrincipal: { key: '实还本金', value: '', moneyFormat: true },
		repaidInterest: { key: '实还利息', value: '', moneyFormat: true },
		repaidPenalty: { key: '实还罚息', value: '', moneyFormat: true },
		repaidFee: { key: '实还费用', value: '', moneyFormat: true },
		repaidServiceFee: { key: '实还服务费', value: '', width: '120px', moneyFormat: true },
		remainRepayAmt: { key: '贷款余额', value: '', width: '150px', moneyFormat: true },
		repayingStatus: { key: '借据状态', value: '', convert: C.jrDict['IouRepayingStatus'] },
		overdueLevel: { key: '催收状态', value: '' },
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
	return await queryLoanReport({ ...form.data, pages: { page: 1, size: 10000 } });
}

// 查询接口
async function initQuery(data?: EmptyObjectType, loading: boolean = true) {
	const rs: any = await queryLoanReport({ ...data, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data;
		form.pages.total = rs.total;
	}
}
</script>
