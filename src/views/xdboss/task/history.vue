<template>
	<div class="vhm-layout-container">
		<LayoutContainer title="办结任务" isFixed :loading="loading">
			<template #default>
				<ListContent isTableHeader v-model:showFields="table.showFields" :loading="loading" :data="table" :handlerList="{ handler }">
					<template #search>
						<ListHeader
							ref="searchFormRef"
							:showFields="form.showFields"
							:rules="form.rules"
							:isExtends="false"
							:isKeepaliveRefresh="false"
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

		<!-- 流程图 -->
		<LayoutPreview ref="previewRef" :preview="preview" />
	</div>
</template>

<script setup lang="ts" name="xdBoss.task.history">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { createUrlParams } from '/@/hooks/useRoute';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { getProcessInstancesDiagram } from '/@/api/common';
import { queryFinishedTasks } from '/@/api/xdboss/task';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const activeName = ref('');
const productList = ref<Array<any>>([]);
const previewRef = ref<RefType>();
const preview = reactive({ srcList: [] as Array<any>, src: '' });

const form = reactive({
	pages: {
		page: 1,
		size: 20,
		total: 0
	},

	showFields: {
		taskDescription: { key: '任务描述', value: '' }
	},

	data: {},
	rules: {}
});

const table = reactive({
	export: false,
	title: '办结任务列表',
	list: [],

	showFields: {
		taskDescription: { key: '任务描述' },
		createName: { key: '创建人' },
		taskFinishedTime: { key: '接收日期', timestamp: true },
		handler: {
			key: '操作',
			width: '180px',
			statusFields: 'endTime',
			buttons: [
				{ text: '详情', type: 'primary', emit: 'details', isAlways: true },
				{ text: '流程图', type: 'success', emit: 'workflow', aloneStatusField: 'endTime', aloneStatusValue: null }
			]
		}
	}
});

// 绑定的按钮操作
const handler = async (key: string, data: EmptyObjectType, rows: EmptyObjectType, button: EmptyObjectType) => {
	switch (key) {
		case 'details':
			const query: EmptyObjectType = {
				editor: '0',
				taskId: rows.id,
				taskName: rows.name,
				processInstanceId: rows.processInstanceId
			};

			// 合通业务债转任务
			if (rows.processDefinitionKey.indexOf('ycxd_ht_debt_transfer') > -1 && rows.businessKey) {
				query.detailId = rows.businessKey;
				query.formKey = 'ycxd_ht_debt_transfer_complete_detail';
				query.navActiveName = '/xdboss/task/history';

				router.push({ path: `/xdboss/task/debtTransfer`, query });
			}
			break;

		case 'workflow':
			const rs = await getProcessInstancesDiagram({ processInstanceId: rows.processInstanceId });

			if (rs.code === 'SUCCESS') {
				U.emptyArray(preview.srcList);
				preview.src = rs.data;
				preview.srcList.push(rs.data);
				previewRef.value.open();
			}
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

// 查询接口
async function initQuery(data: EmptyObjectType, loading: boolean = true) {
	const rs: any = await queryFinishedTasks({ ...data, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data;
		form.pages.total = rs.total;
	}
}

onAjaxInitData(async () => {
	initQuery(form.data, false);
});
</script>
