<template>
	<div class="vhm-layout-container">
		<LayoutContainer title="关账查询" :scrollBarCls="isPageTableFixed ? 'is-table-fixed' : ''" isFixed :loading="loading">
			<template #default>
				<ListContent
					isTableHeader
					v-model:showFields="table.showFields"
					:loading="loading"
					:data="table"
					@buttonHandler="buttonHandler"
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

<script setup lang="ts" name="jfManage.system.accounting.close">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { parataxis } from '/@/plugins/request';
import { usePageSetting } from '/@/stores/modules/page';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { searchPromissionPoint } from '/@/hooks/usePermissionPoint';
import { addCloseAccount, queryCloseAccount } from '/@/api/jfmanage/system';

const hasPermission = ref(searchPromissionPoint('jrBoss.order.list'));
const storesPageSetting = usePageSetting();
const isPageTableFixed = computed(() => storesPageSetting.pageTableFixed);

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const searchFormRef = ref<RefType>();
const reconciliationTypes = ref<Array<any>>([]);

const form = reactive({
	pages: { page: 1, size: 20, total: 0 },

	showFields: {
		operatorName: { key: '操作人', value: '' },
		closeDate: { key: '关账日期', value: '', date: true }
	},

	data: {},
	rules: {}
});

const table = reactive({
	title: '关账查询列表',
	isSerialNo: true,
	isSelection: false,
	isColumSetting: true,
	list: [],

	handleList: [{ text: '关账', style: 'danger', emit: 'close' }],

	showFields: {
		closeDate: { key: '关账日期' },
		closeMonth: { key: '关账月份', value: '' },
		operatorName: { key: '操作人' },
		createTime: { key: '操作时间', timestamp: true }
	}
});

// 选择表格多选
const handleSelectionChange = (val: any) => {};

// 绑定的按钮操作
async function buttonHandler(emit: string, data: EmptyObjectType) {
	switch (emit) {
		case 'close':
			const date = U.getFormatDateByTime(new Date(), 'date');

			jBox.confirm(`确认将 ${date} 作为上月关账日？`, '温馨提示', {
				callback: async (action: any) => {
					if (!!action && action !== 'cancel') {
						const rs = await addCloseAccount();
						if (rs.code === 'SUCCESS') {
							jBox.success('关账成功！');

							await initQuery();
						}
					}
				}
			});
			break;
	}
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

// 查询接口
async function initQuery(data?: EmptyObjectType, loading: boolean = true) {
	const rs: any = await queryCloseAccount({ ...data, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data;
		form.pages.total = rs.total;
	}
}

onMounted(async () => {
	await initQuery();
});
</script>
