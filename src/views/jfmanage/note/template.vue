<template>
	<div class="vhm-layout-container">
		<LayoutContainer title="短信模板" :scrollBarCls="isPageTableFixed ? 'is-table-fixed' : ''" isFixed :loading="loading">
			<template #default>
				<ListContent
					isTableHeader
					v-model:showFields="table.showFields"
					:loading="loading"
					:data="table"
					:isTooltips="false"
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

<script setup lang="ts" name="jfManage.note.template">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { parataxis } from '/@/plugins/request';
import { usePageSetting } from '/@/stores/modules/page';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { searchPromissionPoint } from '/@/hooks/usePermissionPoint';
import { querySmsTemplate } from '/@/api/jfmanage/note';

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
		name: { key: '模板名称', value: '' },
		status: { key: '状态', value: '', select: C.jfManageDict.NoteTempleteStatus }
	},

	data: {},
	rules: {}
});

const table = reactive({
	title: '短信模板列表',
	isSerialNo: true,
	isSelection: false,
	isColumSetting: true,
	list: [],

	showFields: {
		name: { key: '模板名称', width: '300px' },
		content: { key: '模板内容' },
		title: { key: '短信标签', width: '150px' },
		enterpriseName: { key: '模板所属公司', width: '150px' },
		status: { key: '模板状态', width: '120px', convert: C.jfManageDict.NoteTempleteStatus, tag: true }
	}
});

// 选择表格多选
const handleSelectionChange = (val: any) => {};

// 绑定的按钮操作
const handler = async (key: string, data: EmptyObjectType, rows: EmptyObjectType, button: EmptyObjectType) => {};

// 绑定的按钮操作
async function buttonHandler(emit: string, data: EmptyObjectType) {}

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
	const rs: any = await querySmsTemplate({ ...data, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data;
		form.pages.total = rs.total;
	}
}

onMounted(async () => {
	await initQuery();
});
</script>
