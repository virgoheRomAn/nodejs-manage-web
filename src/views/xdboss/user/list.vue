<template>
	<div class="vhm-layout-container">
		<LayoutContainer title="客户列表" :scrollBarCls="isPageTableFixed ? 'is-table-fixed' : ''" isFixed :loading="loading">
			<template #default>
				<ListContent
					isTableHeader
					v-model:showFields="table.showFields"
					:loading="loading"
					:data="table"
					:handlerList="{ handler, handleSelectionChange }"
					@refreshFunction="refreshFunction"
				>
					<template #search>
						<ListHeader
							ref="searchFormRef"
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

<script setup lang="ts" name="xdBoss.user.record">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { usePageSetting } from '/@/stores/modules/page';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { searchPromissionPoint } from '/@/hooks/usePermissionPoint';
import { queryUserList } from '/@/api/xdboss/usercenter';

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
		realName: { key: '姓名', value: '' },
		mobile: { key: '手机号', value: '' },
		idCardNo: { key: '身份证号', value: '' }
	},

	data: {},
	rules: {}
});

const table = reactive({
	title: '客户列表',
	isSerialNo: true,
	isSelection: false,
	isColumSetting: true,
	list: [],

	showFields: {
		realName: { key: '姓名' },
		mobile: { key: '手机号', AES: true },
		idCardNo: { key: '身份证号', AES: true },
		handler: {
			key: '操作',
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
			const query = { userId: rows.userId };
			router.push({ path: `/xdboss/user/details`, query });
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
	const rs: any = await queryUserList({ ...data, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data;
		form.pages.total = rs.total;
	}
}

onMounted(() => {
	initQuery();
});
</script>
