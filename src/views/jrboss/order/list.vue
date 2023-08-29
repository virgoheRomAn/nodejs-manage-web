<template>
	<div class="vhm-layout-container">
		<LayoutContainer title="订单列表" :scrollBarCls="isPageTableFixed ? 'is-table-fixed' : ''" isFixed :loading="loading">
			<template #default>
				<ListContent
					isTableHeader
					v-model:showFields="table.showFields"
					:loading="loading"
					:data="table"
					:exportOpts="exportOpts"
					:handlerList="{ handler, handleSelectionChange }"
					@buttonHandler="buttonHandler"
					@refreshFunction="refreshFunction"
				>
					<template #search>
						<ListHeader
							ref="searchFormRef"
							:showFields="form.showFields"
							:rules="form.rules"
							:isExtends="false"
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

		<!-- 流程图 -->
		<LayoutPreview ref="previewRef" :preview="preview" />

		<!-- 债权确认单 -->
		<DebtTransfer ref="debtTransferRef" :data="debtTransferData" />
	</div>
</template>

<script setup lang="ts" name="jrBoss.order.list">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { parataxis } from '/@/plugins/request';
import { usePageSetting } from '/@/stores/modules/page';
import { createUrlParams } from '/@/hooks/useRoute';
import { searchPromissionPoint } from '/@/hooks/usePermissionPoint';
import { queryJRorderList, queryUserDetail, queryClaimConfirmation } from '/@/api/jrboss/order';
import { queryJrChannel, queryJrProduct, getProcessInstancesDiagram } from '/@/api/common';

const DebtTransfer = defineAsyncComponent(() => import('./src/DebtTransfer.vue'));
const hasPermission = ref(searchPromissionPoint('jrBoss.order.list'));
const storesPageSetting = usePageSetting();
const isPageTableFixed = computed(() => storesPageSetting.pageTableFixed);

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const searchFormRef = ref<RefType>();
const debtTransferRef = ref<RefType>();
const debtTransferData = reactive({ debtTransferNo: '', debtList: [] as any[] });
const previewRef = ref<RefType>();
const preview = reactive({ srcList: [] as Array<any>, src: '' });

const form = reactive({
	pages: {
		page: 1,
		size: 20,
		total: 0
	},

	showFields: {
		userName: { key: '用户姓名', value: '' },
		userPhone: { key: '用户手机号', value: '' },
		id: { key: '订单号', value: '', isMain: true },
		productId: { key: '产品类型', value: '', select: [] as Array<any>, isMain: true, change: proChange },
		channelId: { key: '渠道名称', value: '', select: [] as Array<any>, isMain: true },
		status: { key: '订单状态', value: '', select: C.jrDict['OrderStatus'] },
		dates: {
			key: '放款时间',
			value: [],
			setAjaxValue: ['beginLoanTime', 'endLoanTime'],
			fieldValue: [{ beginLoanTime: { value: '' } }, { endLoanTime: { value: '' } }],
			isCutting: true,
			daterange: true
		}
	},

	data: {},
	rules: {}
});

const exportOpts = reactive({ isExport: false, filename: '订单列表', fields: {} });

const table = reactive({
	title: '订单列表',
	isSerialNo: true,
	isSelection: false,
	isColumSetting: true,
	list: [],

	handleList: [
		{
			text: '导出客户明细表',
			filename: '客户明细表',
			style: 'success',
			fn: exportUserDetailTable,
			exportFields: {
				channelName: { key: '渠道名称' },
				jrOrderId: { key: '金融订单ID' },
				loanContractNo: { key: '借款合同编号' },
				userName: { key: '姓名' },
				userIdNo: { key: '身份证号' },
				userPhone: { key: '手机号' },
				bankCardNo: { key: '银行卡号' },
				applyPeriod: { key: '申请期限' },
				applyRate: { key: '申请利率' },
				loanAmount: { key: '放款金额' },
				loanStartTime: { key: '借款起始日' },
				loanEndTime: { key: '借款到期日' },
				loanTime: { key: '放款日期' }
			},
			isNotRenderShow: true
		},
		{
			text: '导出债权确认单',
			style: 'success',
			emit: 'debtTransfer',
			isNotRenderShow: true
		}
	],

	showFields: {
		id: { key: '订单号', link: true, width: '190px' },
		channelName: { key: '渠道名称' },
		productName: { key: '产品类型' },
		userName: { key: '用户姓名' },
		userPhone: { key: '用户手机号' },
		status: { key: '订单状态', convert: C.jrDict['OrderStatus'] },
		applyAmount: { key: '申请金额', moneyFormat: true },
		approvalAmount: { key: '审批金额', moneyFormat: true },
		loanAmount: { key: '放款金额', moneyFormat: true },
		applyTime: { key: '申请时间', timestamp: true },
		realLoanTime: { key: '放款时间', timestamp: true },
		handler: {
			key: '操作',
			width: '200px',
			isNotExport: true,
			statusFields: 'processStatus',
			buttons: [
				{ text: '详情', type: 'primary', emit: 'details', isAlways: true },
				{ text: '流程节点', type: 'primary', emit: 'workflow', includeStatus: ['started'] }
				// { text: '线下还款', type: 'primary', emit: 'repayment', objectStatusField: { productId: 'bjjr_dianzi', status: 'LOANED', vasOrderStatus: 0 } }
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
			const editor = '0';
			const tagsViewName = 'message.jrBoss.order.details';
			const bossOrderFormKey = form.showFields.productId.select.find((x) => x.code === rows.productId).bossOrderFormKey;

			const query = createUrlParams({
				isRoute: false,
				opts: {
					orderId: rows.id,
					productId: rows.productId,
					productName: rows.productName,
					formKey: bossOrderFormKey,
					editor,
					tagsViewName
				}
			});

			router.push(`/jrboss/order/details?${query}`);
			break;
		case 'repayment':
			const params = { orderId: rows.id, productId: rows.productId, productName: rows.productName };
			router.push({ name: 'jrBoss.order.repayment', query: params });
			break;

		case 'workflow':
			const rs = await getProcessInstancesDiagram({ businessKey: rows.id });

			if (rs.code === 'SUCCESS') {
				U.emptyArray(preview.srcList);
				preview.src = rs.data;
				preview.srcList.push(rs.data);
				previewRef.value.open();
			}
			break;
	}
};

// 绑定的按钮操作
async function buttonHandler(emit: string, data: EmptyObjectType) {
	switch (emit) {
		case 'debtTransfer':
			if (!!searchFormRef.value && !searchFormRef.value.formData['channelId']) {
				jBox.error('请先选择渠道~');
				return;
			}

			const rs = await queryClaimConfirmation(U.doEmptyObject(searchFormRef.value.formData));
			if (rs.code === 'SUCCESS') {
				debtTransferData.debtTransferNo = rs.data.debtTransferNo;
				debtTransferData.debtList = rs.data.dataList;

				nextTick(() => {
					debtTransferRef.value.print();
				});
			}
			break;
	}
}

// 产品选择[通道业务 有导出按钮]
function proChange(val: any, item: EmptyObjectType) {
	table.handleList.map((x) => (x.isNotRenderShow = val !== 'bjjr_tongdao1'));
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

// 导出客户明细表
async function exportUserDetailTable() {
	return await queryUserDetail({ ...form.data, pages: { page: 1, size: 1000 } });
}

// 查询接口
async function initQuery(data?: EmptyObjectType, loading: boolean = true) {
	const rs: any = await queryJRorderList({ ...data, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data;
		form.pages.total = rs.total;
	}
}

onMounted(async () => {
	parataxis([
		{
			fun: queryJrProduct({ pages: { page: 1, size: 20000 } }, false),
			callback: (rs: ResponesResult) => {
				if (rs.code === 'SUCCESS') {
					form.showFields.productId.select = U.formatPickerData(rs.data, 'name', 'id') as Array<any>;
				}
			}
		},
		{
			fun: queryJrChannel({ pages: { page: 1, size: 20000 } }, false),
			callback: (rs: ResponesResult) => {
				if (rs.code === 'SUCCESS') {
					form.showFields.channelId.select = U.formatPickerData(rs.data, 'name', 'id') as Array<any>;
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
