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
	</div>
</template>

<script setup lang="ts" name="xdBoss.order.list">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { usePageSetting } from '/@/stores/modules/page';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { searchPromissionPoint } from '/@/hooks/usePermissionPoint';
import { queryOrderList } from '/@/api/xdboss/order';

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
		orderNo: { key: '订单编号', value: '', isMain: true },
		userName: { key: '姓名', value: '', isMain: true },
		mobile: { key: '手机号', value: '' },
		idCardNo: { key: '身份证号', value: '' },
		productNum: { key: '产品名称', value: '', select: C.xdDict.ProductList as Array<any>, isMain: true },
		orderStatus: { key: '订单状态', value: '', select: C.xdDict.OrderStatus as Array<any>, isMain: true },
		dates: {
			key: '创建时间',
			value: [],
			setAjaxValue: ['beginTime', 'endTime'],
			fieldValue: [{ beginTime: { value: '' } }, { endTime: { value: '' } }],
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

	showFields: {
		orderNo: { key: '订单编号', link: true, width: '250px' },
		applyName: { key: '客户姓名', width: '150px' },
		mobile: { key: '手机号', AES: true, width: '150px' },
		idNo: { key: '身份证号', AES: true, width: '200px' },
		productName: { key: '产品名称' },
		orderStatus: { key: '订单状态', convert: C.xdDict.OrderStatus, width: '100px' },
		createTime: { key: '创建时间', timestamp: true },
		handler: {
			key: '操作',
			width: '100px',
			buttons: [{ text: '详情', type: 'primary', emit: 'details' }]
		}
	}
});

// 选择表格多选
const handleSelectionChange = (val: any) => {};

// 绑定的按钮操作
const handler = async (key: string, data: EmptyObjectType, rows: EmptyObjectType, button: EmptyObjectType) => {
	switch (key) {
		case 'details':
			const query = {
				orderId: rows.orderNo,
				jrUserId: rows.userId,
				zbjUserId: rows.zbjUserId,
				productId: rows.productNo,
				productName: rows.productName
			};
			router.push({ path: `/xdboss/order/details`, query });
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
	const rs: any = await queryOrderList({ ...data, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data;
		form.pages.total = rs.total;
	}
}

onMounted(() => {
	initQuery();
});
</script>
