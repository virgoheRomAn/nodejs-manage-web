<template>
	<LayoutContainer title="待办任务" isFixed :loading="loading">
		<template #header>
			<el-radio-group class="mt10" v-model="activeName" @change="changeProduct">
				<template v-for="(item, index) in productList" :key="index">
					<el-radio-button :label="item.code">{{ item.text }}</el-radio-button>
				</template>
			</el-radio-group>
		</template>

		<template #default>
			<ListContent isTableHeader v-model:showFields="table.showFields" :loading="loading" :data="table" :handlerList="{ handler }">
				<template #search>
					<ListHeader
						ref="searchFormRef"
						:showFields="form.showFields"
						:rules="form.rules"
						:isExtends="false"
						:isKeepaliveRefresh="false"
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
</template>

<script setup lang="ts" name="jrBoss.task.todo">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { createUrlParams } from '/@/hooks/useRoute';
import { queryJrProduct } from '/@/api/common';
import { queryTodoTaskList } from '/@/api/jrboss/task';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const activeName = ref('');
const productList = ref<Array<any>>([]);

const form = reactive({
	pages: {
		page: 1,
		size: 20,
		total: 0
	},

	showFields: {
		orderId: { key: '订单号码', value: '', isMain: true },
		channelName: { key: '渠道名称', value: '', isMain: true },
		userName: { key: '用户姓名', value: '', isMain: true },
		userPhone: { key: '手机号码', value: '', maxlength: 11 },
		userIdNo: { key: '身份证号', value: '' }
	},

	data: {},
	rules: {}
});

const table = reactive({
	export: false,
	title: '待办任务列表',
	list: [],

	showFields: {
		orderId: { key: '订单号', width: '190px' },
		channelName: { key: '渠道名称' },
		productName: { key: '产品类型' },
		userName: { key: '用户姓名', width: '160px' },
		userIdNo: { key: '身份证号', width: '220px' },
		userPhone: { key: '用户手机号', width: '150px' },
		orderStatus: { key: '订单状态', convert: C.jrDict['OrderStatus'] },
		createTime: { key: '创建时间', width: '200px', timestamp: true },
		handler: {
			key: '操作',
			width: '150px',
			buttons: [{ text: '去处理', type: 'primary', emit: 'approve' }]
		}
	}
});

// 绑定的按钮操作
const handler = (key: string, data: EmptyObjectType, rows: EmptyObjectType, button: EmptyObjectType) => {
	if (!rows.completeTask) {
		jBox.error('该任务不能在PC端处理，请在移动端处理！');
		return false;
	}

	switch (key) {
		case 'approve':
			const editor = '1';
			const tagsViewName = 'message.jrBoss.task.approve';
			const processKey = productList.value.find((x) => x.code === rows.productId).processKey;

			const query = createUrlParams({
				isRoute: false,
				opts: {
					taskId: rows.id,
					taskName: rows.name,
					orderId: rows.orderId,
					productId: rows.productId,
					productName: rows.productName,
					formKey: rows.formKey,
					processInstanceId: rows.processInstanceId,
					processKey,
					editor,
					tagsViewName
				}
			});

			router.push(`/jrboss/task/todo/approve?${query}`);
			break;
	}
};

// 切换产品
function changeProduct(value: string) {
	form.pages.page = 1;
	nextTick(async () => {
		await initQuery(U.formatFormData(form.data), activeName.value);
	});
}

// 条件筛选
function handleSubmit(data: any) {
	form.pages.page = 1;
	form.data = data;
	nextTick(async () => {
		await initQuery(data, activeName.value);
	});
}

// 分页查询
function handlePaginationChange(val: any) {
	form.pages = val;
	nextTick(async () => {
		await initQuery(U.formatFormData(form.data), activeName.value);
	});
}

// 查询接口
async function initQuery(data: EmptyObjectType, processDefinitionKey: string, loading: boolean = true) {
	const rs: any = await queryTodoTaskList({ ...data, ...{ processDefinitionKey }, pages: form.pages }, loading);
	if (rs.code === 'SUCCESS') {
		table.list = rs.data;
		form.pages.total = rs.total;
	}
}

onAjaxInitData(async () => {
	if (!activeName.value) {
		const rs = await queryJrProduct({});
		if (rs.code === 'SUCCESS') {
			productList.value = U.formatPickerData(rs.data, 'name', 'id') as Array<any>;
			activeName.value = productList.value[0].code;

			initQuery({}, activeName.value);
		}
	} else {
		initQuery(form.data, activeName.value);
	}
});
</script>
