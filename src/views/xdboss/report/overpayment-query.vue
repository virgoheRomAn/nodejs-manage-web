<template>
	<div class="vhm-layout-container">
		<LayoutContainer title="溢缴款明细查询" :scrollBarCls="isPageTableFixed ? 'is-table-fixed' : ''" isFixed :loading="loading">
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
	</div>
</template>

<script setup lang="ts" name="xdBoss.report.overpayment">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { usePageSetting } from '/@/stores/modules/page';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { searchPromissionPoint } from '/@/hooks/usePermissionPoint';
import { queryOverpaymentReport } from '/@/api/xdboss/report';

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
		customerName: { key: '客户名称', value: '' },
		dates: {
			key: '更新时间',
			value: [],
			setAjaxValue: ['startTime', 'endTime'],
			fieldValue: [{ startTime: { value: '' } }, { endTime: { value: '' } }],
			isCutting: true,
			daterange: true
		}
	},

	data: {},
	rules: {}
});

// 导出设置
const exportOpts = reactive({
	isExport: true,
	filename: '溢缴款明细表',
	fields: {},
	fn: exportUserDetailTable
});

const table = reactive({
	title: '溢缴款明细列表',
	isSerialNo: true,
	isSelection: false,
	isColumSetting: true,
	list: [],

	// handleList: [
	// 	{
	// 		text: '导出',
	// 		style: 'success',
	// 		filename: '溢缴款明细表',
	// 		fn: exportUserDetailTable
	// 	}
	// ],

	showFields: {
		customerName: { key: '客户名称' },
		remainAmt: { key: '溢缴款余额', moneyFormat: true },
		balanceAmt: { key: '溢缴款收支金额', moneyFormat: true },
		repayTime: { key: '更新日期', timestamp: true }
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

// 导出客户明细表
async function exportUserDetailTable() {
	return await queryOverpaymentReport({ ...form.data, pages: { page: 1, size: 10000 } });
}

// 查询接口
async function initQuery(data?: EmptyObjectType, loading: boolean = true) {
	const rs: any = await queryOverpaymentReport({ ...data, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data;
		form.pages.total = rs.total;
	}
}
</script>
