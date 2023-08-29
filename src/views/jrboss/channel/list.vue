<template>
	<div class="vhm-layout-container">
		<LayoutContainer title="渠道列表" :scrollBarCls="isPageTableFixed ? 'is-table-fixed' : ''" isFixed :loading="loading">
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
							labelWidth="120px"
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

<script setup lang="ts" name="jrBoss.channel.list">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { parataxis } from '/@/plugins/request';
import { usePageSetting } from '/@/stores/modules/page';
import { createUrlParams } from '/@/hooks/useRoute';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { searchPromissionPoint } from '/@/hooks/usePermissionPoint';
import { queryChannelList, updateJrChannel } from '/@/api/jrboss/channel';

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
		name: { key: '营业执照名称', value: '' },
		status: { key: '渠道状态', value: '', select: U.enum2Array(C.jrEnum.ChannelStatus) }
	},

	data: {},
	rules: {}
});

const exportOpts = reactive({ isExport: false, filename: '订单列表', fields: {} });

const table = reactive({
	title: '渠道列表',
	isSerialNo: true,
	isSelection: false,
	isColumSetting: true,
	list: [],

	handleList: [
		{
			text: '新增渠道',
			icon: 'ele-EditPen',
			style: 'success',
			click: () => router.push({ path: '/jrboss/channel/details', query: { tagsViewName: 'message.jrBoss.channel.add' } })
		}
	],

	showFields: {
		createTime: { key: '创建时间', timestamp: true },
		id: { key: '渠道ID' },
		name: { key: '营业执照名称' },
		status: { key: '渠道状态', convert: U.enum2Array(C.jrEnum.ChannelStatus) },
		handler: {
			key: '操作',
			width: '250px',
			statusFields: 'status',
			buttons: [
				{ text: '禁用', type: 'danger', emit: 'updateJrChannel', data: { updateStatus: 'DISABLE' }, includeStatus: ['ENABLE'] },
				{ text: '启用', type: 'success', emit: 'updateJrChannel', data: { updateStatus: 'ENABLE' }, includeStatus: ['DISABLE'] },
				{ text: '编辑', type: 'primary', emit: 'editJrChannel', includeStatus: ['ENABLE', 'DISABLE'] }
			]
		}
	}
});

// 选择表格多选
const handleSelectionChange = (val: any) => {};

// 绑定的按钮操作
const handler = async (key: string, data: EmptyObjectType, rows: EmptyObjectType, button: EmptyObjectType) => {
	switch (key) {
		case 'editJrChannel':
			router.push({ path: '/jrboss/channel/details', query: { id: rows.id, name: rows.name } });
			break;
		case 'updateJrChannel':
			const status = button.data.updateStatus;
			const statusText = U.getArrayValueById(status, U.enum2Array(C.jrEnum.ChannelStatus));

			jBox.confirm(`是否 【${statusText}】 【${rows.name}】`, '修改状态', {
				callback: async (action: any) => {
					if (!!action && action !== 'cancel') {
						const rs = await updateJrChannel({ id: rows.id, status });

						if (rs.code === 'SUCCESS') {
							jBox.success('修改状态成功！');
							await initQuery();
						}
					}
				}
			});

			break;
	}
};

// 绑定的按钮操作
async function buttonHandler(emit: string, data: EmptyObjectType) {
	switch (emit) {
		case 'debtTransfer':
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
	const rs: any = await queryChannelList({ ...data, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data;
		form.pages.total = rs.total;
	}
}

onAjaxInitData(async () => {
	await initQuery();
});
</script>
