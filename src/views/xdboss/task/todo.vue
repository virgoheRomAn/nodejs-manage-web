<template>
	<div class="vhm-layout-container">
		<LayoutContainer title="待办任务" isFixed :loading="loading">
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

<script setup lang="ts" name="xdBoss.task.todo">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { createUrlParams } from '/@/hooks/useRoute';
import { queryTodoServiceTasks } from '/@/api/xdboss/task';
import { getProcessInstancesDiagram } from '/@/api/common';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';

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
	title: '待办任务列表',
	list: [],

	showFields: {
		taskDescription: { key: '任务描述' },
		createName: { key: '创建人' },
		createTime: { key: '接收日期', timestamp: true },
		name: { key: '当前节点' },
		handler: {
			key: '操作',
			width: '180px',
			buttons: [
				{ text: '去处理', type: 'primary', emit: 'approve' },
				{ text: '流程图', type: 'success', emit: 'workflow' }
			]
		}
	}
});

// 绑定的按钮操作
const handler = async (key: string, data: EmptyObjectType, rows: EmptyObjectType, button: EmptyObjectType) => {
	switch (key) {
		case 'approve':
			const variables = rows.variables;
			const id = variables.find((x: any) => x.name === 'businessKey').value;

			const query: EmptyObjectType = {
				editor: '1',
				taskId: rows.id,
				taskName: rows.name,
				formKey: rows.formKey,
				processInstanceId: rows.processInstanceId
			};

			// 合通业务债转任务
			if (rows.formKey.indexOf('ycxd_ht_debt_transfer') > -1) {
				query.detailId = id;
				query.navActiveName = '/xdboss/task/todo';

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
	const rs: any = await queryTodoServiceTasks({ ...data, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data;
		form.pages.total = rs.total;
	}
}

onAjaxInitData(async () => {
	initQuery(form.data, false);
});
</script>
