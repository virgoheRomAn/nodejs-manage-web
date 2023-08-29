<template>
	<LayoutContainer title="角色管理" isFixed :loading="loading">
		<template #default>
			<ListContent v-model:showFields="table.showFields" :data="table" :loading="loading" :handlerList="{ handler }">
				<template #search>
					<ListHeader
						:showFields="form.showFields"
						:rules="form.rules"
						:button="headerButtons"
						:isUseToggle="false"
						isExtends
						isContentInner
						@cancel="cancelForm"
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

<script setup lang="ts" name="jfManage.permission.role.index">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { createUrlParams } from '/@/hooks/useRoute';
import { searchPromissionPoint } from '/@/hooks/usePermissionPoint';
import { queryRoleByPage } from '/@/api/jfmanage/permission';

const hasPermission = ref(searchPromissionPoint('jfManage.permission.role.edit'));

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const headerButtons = reactive([
	{
		text: '新增角色',
		type: 'success',
		icon: 'ele-FolderAdd',
		isNotRenderShow: !hasPermission.value,
		handler: () => {
			router.push(`/jfmanage/permission/role/details?editor=1&tagsViewName=message.jfManage.permission.role.add`);
		}
	}
]);

const form = reactive({
	pages: {
		page: 1,
		size: 20,
		total: 0
	},

	showFields: {
		systemGroup: { key: '系统组标识', value: '', select: C.jfManageDict.SystemGroupType },
		roleCode: { key: '角色编码', value: '' },
		roleName: { key: '角色名称', value: '' }
	},

	rules: {}
});

const table = reactive({
	export: false,
	title: '角色列表',
	list: [],

	showFields: {
		roleCode: { key: '角色编码' },
		roleName: { key: '角色名称' },
		systemGroup: { key: '系统组标识', convert: C.jfManageDict.SystemGroupType, isTransValueToStr: true },
		createTime: { key: '创建时间', timestamp: true },
		handler: {
			key: '操作',
			width: '100px',
			buttons: [{ text: '编辑', type: 'primary', emit: 'edit' }]
		}
	}
});

// 绑定的按钮操作
const handler = (key: string, data: any, rows: any) => {
	let editor = '0';
	let tagsViewName = 'message.jfManage.permission.role.details';

	switch (key) {
		case 'details':
			editor = '0';
			tagsViewName = 'message.jfManage.permission.role.details';
			break;
		case 'edit':
			editor = '1';
			tagsViewName = 'message.jfManage.permission.role.edit';
			break;
	}

	const query = createUrlParams({
		route,
		isRoute: false,
		opts: {
			id: rows.id,
			roleCode: rows.roleCode,
			roleName: rows.roleName,
			systemGroup: rows.systemGroup,
			editor,
			tagsViewName
		}
	});

	router.push(`/jfmanage/permission/role/details?${query}`);
};

// 取消筛选
function cancelForm() {}

// 条件筛选
function handleSubmit(data: any) {
	form.pages.page = 1;
	nextTick(async () => {
		await initQuery(data);
	});
}

// 分页查询
function handlePaginationChange(val: any) {
	form.pages = val;
	nextTick(async () => {
		await initQuery(U.formatFormData(form.showFields));
	});
}

// 查询接口
async function initQuery(data?: EmptyObjectType) {
	const rs: any = await queryRoleByPage({ ...data, pages: form.pages });
	if (rs.code === 'SUCCESS') {
		table.list = rs.data;
		form.pages.total = rs.total;
	}
}

onMounted(async () => {
	await initQuery();
});
</script>
