<template>
	<div class="vhm-layout-container">
		<LayoutContainer title="借据查询" :scrollBarCls="isPageTableFixed ? 'is-table-fixed' : ''" isFixed :loading="loading">
			<template #default>
				<ListContent
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
							:showFields="form.showFields"
							:rules="form.rules"
							:isExtends="false"
							buttonLayout="block"
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

		<!-- 特殊交易批量申请 -->
		<LayoutDialog ref="dialogRef" isHeaderClose isFixed :fixed="{ width: '450px', height: 'auto' }">
			<template #header>特殊交易批量申请</template>

			<template #render>
				<el-form inline label-width="110px">
					<el-card shadow="never">
						<el-form-item label="申请类型：">
							<el-radio v-model="form.specialradio" label="1">核销申请</el-radio>
							<el-radio v-model="form.specialradio" label="2" disabled>债转申请</el-radio>
						</el-form-item>
					</el-card>
				</el-form>
			</template>
		</LayoutDialog>
	</div>
</template>

<script setup lang="ts" name="xdBoss.financial.receipt">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { usePageSetting } from '/@/stores/modules/page';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { searchPromissionPoint } from '/@/hooks/usePermissionPoint';
import { queryLoanReceipts } from '/@/api/xdboss/financial';

const hasPermission = ref(searchPromissionPoint('jrBoss.order.list'));
const storesPageSetting = usePageSetting();
const isPageTableFixed = computed(() => storesPageSetting.pageTableFixed);

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const searchFormRef = ref<RefType>();
const dialogRef = ref<RefType>();

const form = reactive({
	specialradio: '1',

	pages: { page: 1, size: 20, total: 0 },

	showFields: {
		productNum: { key: '产品类型', value: '', select: C.xdDict['ProductList'], isMain: true },
		receiptNum: { key: '借据编号', value: '', isMain: true },
		debtorName: { key: '用户姓名', value: '', isMain: true },
		idCardNo: { key: '身份证号码', value: '' },
		customerMobile: { key: '用户手机号', value: '' },
		repayingStatus: { key: '借据状态', value: '', select: C.xdDict['IouRepayingStatus'] },
		overdueStatus: { key: '逾期状态', value: '', select: C.xdDict['IouOverdesStatus'] },
		dates: {
			key: '放款时间',
			value: [],
			setAjaxValue: ['startLoanDate', 'endLoanDate'],
			fieldValue: [{ startLoanDate: { value: '' } }, { endLoanDate: { value: '' } }],
			isCutting: true,
			daterange: true
		}
	},

	data: {},
	rules: { productNum: { required: true, message: '请选择产品类型' } }
});

const exportOpts = reactive({ isExport: false, filename: '订单列表', fields: {} });

const table = reactive({
	title: '借据列表',
	isSerialNo: true,
	isSelection: false,
	isColumSetting: true,
	list: [],

	handleList: [{ text: '特殊交易批量申请', style: 'success', isNotRenderShow: true, click: () => dialogRef.value.open() }],

	showFields: {
		receiptNum: { key: '借据编号', width: '250px', link: true },
		productNum: { key: '贷款产品', width: '160px', convert: C.xdDict['ProductList'] },
		debtorName: { key: '用户姓名', width: '110px' },
		customerMobile: { key: '用户手机号' },
		debtorIdNo: { key: '身份证', width: '200px' },
		repayingStatus: { key: '借据状态', convert: C.xdDict['IouRepayingStatus'], width: '110px' },
		overdueStatus: { key: '逾期状态', convert: C.xdDict['IouOverdesStatus'], width: '110px' },
		loanDate: { key: '放款时间', timestamp: true },
		handler: {
			key: '操作',
			width: '180px',
			statusFields: 'repayingStatus',
			buttons: [
				{ text: '借据详情', type: 'primary', emit: 'details', includeStatus: [1, 2] },
				{ text: '还款申请', type: 'success', emit: 'offline', excludeStatus: [2] },
				{ text: '线下减免申请', type: 'primary', emit: 'derate', isNoneShow: true }
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
			const query1 = { receiptNum: rows.receiptNum, productNum: rows.productNum };
			router.push({ path: `/xdboss/financial/receiptDetails`, query: query1 });
			break;

		case 'derate':
			const query2 = { receiptId: rows.id, receiptNum: rows.receiptNum, busOrderNo: rows.busOrderNo, formKey: 'buddha_derate_form1' };
			router.push({ path: `/xdboss/financial/receiptDerate`, query: query2 });
			break;

		case 'offline':
			const query3 = { receiptNum: rows.receiptNum, productNum: rows.productNum, receiptId: rows.id };
			router.push({ path: `/xdboss/financial/receiptOffline`, query: query3 });
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

// 查询接口
async function initQuery(data?: EmptyObjectType, loading: boolean = true) {
	const rs: any = await queryLoanReceipts({ ...data, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data;
		form.pages.total = rs.total;
	}
}
</script>
