<template>
	<div class="vhm-layout-container">
		<LayoutContainer title="催收任务列表" :scrollBarCls="isPageTableFixed ? 'is-table-fixed' : ''" isFixed :loading="loading">
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
							buttonLayout="inline"
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

<script setup lang="ts" name="xdBoss.collection.task">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { usePageSetting } from '/@/stores/modules/page';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { searchPromissionPoint } from '/@/hooks/usePermissionPoint';
import { queryCollectionTasks } from '/@/api/xdboss/collection';

const hasPermission = ref(searchPromissionPoint('jrBoss.order.list'));
const storesPageSetting = usePageSetting();
const isPageTableFixed = computed(() => storesPageSetting.pageTableFixed);

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const searchFormRef = ref<RefType>();
const dialogRef = ref<RefType>();

const form = reactive({
	pages: { page: 1, size: 20, total: 0 },

	showFields: {
		taskName: { key: '任务名称', value: '', select: C.xdDict['CollectionTaskName'], isMain: true },
		productNum: { key: '产品类型', value: '', select: C.xdDict['ProductList'], isMain: true },
		userName: { key: '客户姓名', value: '' },
		idCardNo: { key: '身份证号码', value: '' },
		overdueMax: {
			key: '逾期阶段',
			value: [],
			select: U.formatPickerData(C.xdDict['OverdueLevrls'], 'text', 'value'),
			setAjaxValue: ['minDay', 'maxDay'],
			fieldValue: [{ minDay: { value: '' } }, { maxDay: { value: '' } }],
			isCutting: true
		},
		dates: {
			key: '时间节点',
			value: [],
			setAjaxValue: ['beginDate', 'endDate'],
			fieldValue: [{ beginDate: { value: '' } }, { endDate: { value: '' } }],
			isCutting: true,
			isNotTimestamp: true,
			daterange: true,
			isMain: true
		}
	},

	data: {},
	rules: {}
});

const exportOpts = reactive({ isExport: false, filename: '订单列表', fields: {} });

const table = reactive({
	title: '催收任务列表',
	isSerialNo: true,
	isSelection: false,
	isColumSetting: true,
	list: [],

	showFields: {
		productNum: { key: '产品名称', convert: C.xdDict['ProductList'] },
		userName: { key: '客户姓名', width: '120px' },
		idCardNo: { key: '客户证件号', width: '300px' },
		overdueMax: { key: '最大逾期天数' },
		overdueLevel: { key: '逾期阶段', convertRange: C.xdDict['OverdueLevrls'] },
		name: { key: '任务名称' },
		createTime: { key: '任务创建时间', timestamp: true },
		handler: {
			key: '操作',
			width: '150px',
			buttons: [{ text: '处理', type: 'primary', emit: 'approve' }]
		}
	}
});

// 选择表格多选
const handleSelectionChange = (val: any) => {};

// 绑定的按钮操作
const handler = async (key: string, data: EmptyObjectType, rows: EmptyObjectType, button: EmptyObjectType) => {
	const { id: taskId, idCardNo, origin, urgeCalcHisId, productNum } = rows;

	switch (key) {
		case 'approve':
			const query = { taskId, idCardNo, origin, urgeCalcHisId, productNum };
			router.push({ path: `/xdboss/collection/approve`, query });
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
	const rs: any = await queryCollectionTasks({ ...data, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data;
		form.pages.total = rs.total;
	}
}

onAjaxInitData(async () => {
	await initQuery();
});
</script>
