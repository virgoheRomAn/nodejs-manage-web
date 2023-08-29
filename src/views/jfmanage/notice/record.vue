<template>
	<div class="vhm-layout-container">
		<LayoutContainer title="公告列表" :scrollBarCls="isPageTableFixed ? 'is-table-fixed' : ''" isFixed :loading="loading">
			<template #default>
				<ListContent
					isTableHeader
					v-model:showFields="table.showFields"
					:loading="loading"
					:data="table"
					:isTooltips="false"
					:handlerList="{ handler }"
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

		<NoticeLayoutDialog ref="noticeLayoutDialogRef" @submit="initQuery" />
	</div>
</template>

<script setup lang="ts" name="jfManage.notice.record">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { parataxis } from '/@/plugins/request';
import { usePageSetting } from '/@/stores/modules/page';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { searchPromissionPoint } from '/@/hooks/usePermissionPoint';
import { queryAnnouncementList } from '/@/api/jfmanage/notice';

// 引入组件
const NoticeLayoutDialog = defineAsyncComponent(() => import('./src/NoticeLayoutDialog.vue'));
const noticeLayoutDialogRef = ref<RefType>();

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
		title: { key: '公告标题', value: '' },
		creatorName: { key: '创建人', value: '' },
		dates: {
			key: '创建时间',
			value: [],
			setAjaxValue: ['createTimeStart', 'createTimeEnd'],
			fieldValue: [{ createTimeStart: { value: '' } }, { createTimeEnd: { value: '' } }],
			isNotTimestamp: true,
			isCutting: true,
			daterange: true
		}
	},

	data: {},
	rules: {}
});

const table = reactive({
	title: '公告列表',
	isSerialNo: true,
	isSelection: false,
	isColumSetting: true,
	list: [],

	handleList: [{ text: '新增公告', style: 'primary', emit: 'add' }],

	showFields: {
		title: { key: '公告标题' },
		content: { key: '公告内容', width: '600px', isHtml: true },
		creatorName: { key: '创建人', width: '100px' },
		startTime: { key: '生效时间', timestamp: true, timeFormat: 'date' },
		endTime: { key: '失效时间', timestamp: true, timeFormat: 'date' },
		createTime: { key: '创建时间', timestamp: true },
		handler: {
			key: '操作',
			width: '150px',
			buttons: [{ text: '编辑', type: 'primary', emit: 'edit' }]
		}
	}
});

// 选择表格多选
const handleSelectionChange = (val: any) => {};

// 绑定的按钮操作
const handler = async (key: string, data: EmptyObjectType, rows: EmptyObjectType, button: EmptyObjectType) => {
	if (key === 'edit') {
		noticeLayoutDialogRef.value.openDialog(key, rows);
	}
};

// 绑定的按钮操作
async function buttonHandler(emit: string, data: EmptyObjectType) {
	if (emit === 'add') {
		noticeLayoutDialogRef.value.openDialog(emit);
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
	const rs: any = await queryAnnouncementList({ ...data, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data;
		form.pages.total = rs.total;
	}
}

onMounted(async () => {
	await initQuery();
});
</script>
