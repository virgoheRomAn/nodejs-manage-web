<template>
	<div class="vhm-layout-container">
		<LayoutContainer title="历史短信查询" :scrollBarCls="isPageTableFixed ? 'is-table-fixed' : ''" isFixed :loading="loading">
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
	</div>
</template>

<script setup lang="ts" name="jfManage.note.history">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { parataxis } from '/@/plugins/request';
import { usePageSetting } from '/@/stores/modules/page';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { searchPromissionPoint } from '/@/hooks/usePermissionPoint';
import { queryHistorySms } from '/@/api/jfmanage/note';

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
		mainRecordId: { key: '批次号', value: '', isMain: true },
		mobile: { key: '手机号', value: '', isMain: true },
		channelSmsState: { key: '发送状态', value: '', select: C.jfManageDict.NoteSendStatus, isMain: true },
		sendType: { key: '发送方式', value: '', select: C.jfManageDict.NoteSendType },
		commitStatus: { key: '提交状态', value: '', select: C.jfManageDict.NoteBatchSendStatus },
		smsContent: { key: '短信内容', value: '' },
		dates: {
			key: '发送时间',
			value: [],
			setAjaxValue: ['commitStartTime', 'commitEndTime'],
			fieldValue: [{ startLoanDate: { value: '' } }, { commitEndTime: { value: '' } }],
			isCutting: true,
			daterange: true
		}
	},

	data: {},
	rules: {}
});

const table = reactive({
	title: '历史短信查询列表',
	isSerialNo: true,
	isSelection: false,
	isColumSetting: true,
	list: [],

	showFields: {
		channelName: { key: '平台方' },
		mainRecordId: { key: '批次号' },
		mobile: { key: '手机号', width: '120px' },
		smsMessage: { key: '短信内容', width: '500px' },
		sendType: { key: '发送方式', width: '100px', convert: C.jfManageDict.NoteSendType, tag: true },
		sendStatus: { key: '提交状态', width: '100px', convert: C.jfManageDict.NoteBatchSendStatus, tag: true },
		channelSmsState: { key: '发送状态', width: '100px', convert: C.jfManageDict.NoteSendStatus, tag: true },
		createTime: { key: '发送时间', width: '200px', timestamp: true },
		channelSmsDesc: { key: '失败原因' }
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
	const rs: any = await queryHistorySms({ ...data, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data;
		form.pages.total = rs.total;
	}
}

onMounted(async () => {
	await initQuery();
});
</script>
