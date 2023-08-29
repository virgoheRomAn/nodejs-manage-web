<template>
	<div class="vhm-layout-container">
		<LayoutContainer title="客户入库白名单" isFixed :loading="loading">
			<template #default>
				<ListContent isTableHeader v-model:showFields="table.showFields" :loading="loading" :data="table" :handlerList="{ handler }">
					<template #search>
						<ListHeader
							ref="searchFormRef"
							labelWidth="110px"
							:showFields="form.showFields"
							:rules="form.rules"
							:isExtends="false"
							:isKeepaliveRefresh="false"
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

<script setup lang="ts" name="jrBoss.whiteTask.todo">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { createUrlParams } from '/@/hooks/useRoute';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { queryUserApplyList } from '/@/api/jrboss/customer';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const searchFormRef = ref<RefType>();

const form = reactive({
	pages: { page: 1, size: 20, total: 0 },

	showFields: {
		name: { key: '客户姓名', value: '', isMain: true },
		phoneNum: { key: '手机号码', value: '' },
		idNo: { key: '客户身份证号', value: '' },
		channelSimpleName: { key: '申请渠道', value: '' },
		createTimeStart: { key: '申请时间', value: '', date: true },
		creatorName: { key: '申请人', value: '', isMain: true },
		status: { key: '状态', value: 'PENDING', select: C.jrDict.WhiteTaskStatus, isMain: true }
	},

	data: {},
	rules: {}
});

const table = reactive({
	export: false,
	title: '待办任务列表',
	list: [],

	showFields: {
		id: { key: '任务编号' },
		name: { key: '客户姓名' },
		phoneNum: { key: '手机号码' },
		idNo: { key: '客户身份证号' },
		createTime: { key: '申请时间', timestamp: true },
		channelSimpleName: { key: '申请渠道' },
		creatorName: { key: '申请人' },
		status: { key: '状态', convert: C.jrDict.WhiteTaskStatus },
		handler: {
			key: '操作',
			width: '180px',
			statusFields: 'status',
			buttons: [
				{ text: '去处理', type: 'primary', emit: 'approve', includeStatus: ['PENDING'] },
				{ text: '详情', type: 'primary', emit: 'details', includeStatus: ['APPROVED', 'REJECTED', 'INVALID'] }
			]
		}
	}
});

// 绑定的按钮操作
const handler = async (key: string, data: EmptyObjectType, rows: EmptyObjectType, button: EmptyObjectType) => {
	const query: EmptyObjectType = { editor: key === 'approve' ? '1' : '0', taskId: rows.id };
	router.push({ path: `/jrboss/whitetask/approve`, query });
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

// 查询接口
async function initQuery(data: EmptyObjectType, loading: boolean = true) {
	const rs: any = await queryUserApplyList({ ...data, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data;
		form.pages.total = rs.total;
	}
}

onAjaxInitData(async () => {
	form.data = U.doEmptyObject(U.formatFormData(form.showFields));

	initQuery(form.data, false);
});
</script>
