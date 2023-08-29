<template>
	<div class="vhm-layout-container">
		<LayoutContainer title="业务岗人员管理" :scrollBarCls="isPageTableFixed ? 'is-table-fixed' : ''" isFixed :loading="loading">
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

		<!-- 人员管理 -->
		<StaffDialog ref="staffDialogRef" @submit="initQuery" />
	</div>
</template>

<script setup lang="ts" name="jrBoss.business.record">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { usePageSetting } from '/@/stores/modules/page';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { searchPromissionPoint } from '/@/hooks/usePermissionPoint';
import { queryjrBusinessStaffList, updatejrBusinessStaff } from '/@/api/jrboss/business';

const StaffDialog = defineAsyncComponent(() => import('./src/StaffDialog.vue'));
const staffDialogRef = ref<RefType>();

const hasPermission = ref(searchPromissionPoint('jrBoss.order.list'));
const storesPageSetting = usePageSetting();
const isPageTableFixed = computed(() => storesPageSetting.pageTableFixed);

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const searchFormRef = ref<RefType>();

const form = reactive({
	pages: { page: 1, size: 20, total: 0 },

	showFields: {
		name: { key: '姓名', value: '' },
		phoneNum: { key: '手机号', value: '' },
		cityCode: { key: '所属区域', value: '', select: C.jrDict['BusinessAreaCity'] }
	},

	data: {},
	rules: {}
});

const exportOpts = reactive({ isExport: false, filename: '订单列表', fields: {} });

const table = reactive({
	title: '业务岗人员列表',
	isSerialNo: true,
	isSelection: false,
	isColumSetting: true,
	list: [],

	handleList: [{ text: '新增业务人员', style: 'success', click: () => staffDialogRef.value.openDialog('add') }],

	showFields: {
		fullName: { key: '姓名' },
		phoneNum: { key: '手机号' },
		cityCode: { key: '所属区域', convert: C.jrDict['BusinessAreaCity'] },
		status: { key: '状态', convert: C['ChooseNumberStatus'] },
		handler: {
			key: '操作',
			width: '250px',
			statusFields: 'status',
			buttons: [
				{ text: '启用', type: 'success', emit: 'update', data: { updateStatus: 1 }, includeStatus: [0] },
				{ text: '禁用', type: 'danger', emit: 'update', data: { updateStatus: 0 }, includeStatus: [1] },
				{ text: '编辑', type: 'primary', emit: 'change', includeStatus: [1] }
			]
		}
	}
});

// 选择表格多选
const handleSelectionChange = (val: any) => {};

// 绑定的按钮操作
const handler = async (key: string, data: EmptyObjectType, rows: EmptyObjectType, button: EmptyObjectType) => {
	switch (key) {
		case 'update':
			const status = button.data.updateStatus;
			const statusText = U.getArrayValueById(status, C.ChooseNumberStatus);

			jBox.confirm(`是否 【${statusText}】 【${rows.name}】`, '修改状态', {
				callback: async (action: any) => {
					if (!!action && action !== 'cancel') {
						const rs = await updatejrBusinessStaff({ id: rows.id, status });

						if (rs.code === 'SUCCESS') {
							jBox.success('修改状态成功！');
							await initQuery();
						}
					}
				}
			});

			break;

		case 'change':
			staffDialogRef.value.openDialog(key, rows);
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
	const rs: any = await queryjrBusinessStaffList({ ...data, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data;
		form.pages.total = rs.total;
	}
}

onMounted(async () => {
	await initQuery();
});
</script>
