<template>
	<div class="vhm-layout-container">
		<LayoutContainer title="菜单管理" isFixed :loading="loading">
			<template #headerButton>
				<el-button type="primary" v-if="hasPermission" @click="menuDialogRef.openDialog('add')">新增菜单</el-button>
			</template>

			<template #default>
				<ListContent
					v-model:showFields="table.showFields"
					:loading="loading"
					:data="table"
					:handlerList="{ handler }"
					:isBorder="false"
					:isPageTableFixed="false"
					:expandRowKeys="expandRowKeys"
					isTableHeader
					rowKey="id"
				/>
			</template>
		</LayoutContainer>

		<MenuDialog ref="menuDialogRef" :menuTree="table.list" @submit="submit"></MenuDialog>
	</div>
</template>

<script setup lang="ts" name="jfmanagePermissionMenu">
import type { RouteRecordRaw } from 'vue-router';
import { FormInstance } from 'element-plus';
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { useRoutesList } from '/@/stores/modules/routesList';
import { createRoutesTree } from '/@/router/helper/routesTree';
import { queryPermission, insertPermission, updatePermission } from '/@/api/jfmanage/permission';
import { searchPromissionPoint } from '/@/hooks/usePermissionPoint';

// 引入组件
const MenuDialog = defineAsyncComponent(() => import('./src/menuDialog.vue'));

const hasPermission = ref(searchPromissionPoint('jfManage.permission.menu.edit'));

// 定义变量内容
const route = useRoute();
const router = useRouter();
const stores = useRoutesList();
const { routesList } = storeToRefs(stores);
const loading = ref(false);
const menuDialogRef = ref();
const expandRowKeys = ref<any[]>(['01', '02', '03']);

const table = reactive({
	export: false,
	isSerialNo: true,
	title: '菜单列表',
	list: [] as Array<any>,

	showFields: {
		id: { key: '权限Id', hasIcon: true, width: '200px' },
		orderNumber: { key: '顺序', width: '80px' },
		permissionCode: { key: '权限Code' },
		permissionName: { key: '权限名称', width: '150px' },
		permissionType: { key: '权限类型', width: '120px' },
		path: { key: '路由路径' },
		template: { key: '模板路径', width: '300px' },
		handler: {
			key: '操作',
			width: '180px',
			buttons: [
				{ text: '详情', type: 'primary', isNotRenderShow: false, emit: 'details' },
				{ text: '添加', type: 'success', isNotRenderShow: !hasPermission.value, emit: 'addChild' },
				{ text: '修改', type: 'warning', isNotRenderShow: !hasPermission.value, emit: 'edit' }
			]
		}
	}
});

// 绑定的按钮操作
const handler = (key: string, data: any, rows: any) => {
	switch (key) {
		case 'details':
			menuDialogRef.value.openDialog('details', rows);
			break;
		case 'addChild':
			menuDialogRef.value.openDialog('addChild', rows);
			break;
		case 'edit':
			menuDialogRef.value.openDialog('edit', rows);
			break;
	}
};

// 查询接口
async function initQuery() {
	const rs: any = await queryPermission();
	if (rs.code === 'SUCCESS') {
		table.list = rs.data.tree;

		// 设置展开的数据行
		const permission = rs.data.permission.map((x: any) => x.id).filter((x: any) => x.length < 4);
		expandRowKeys.value = permission;
	}
}

// 弹窗提交
const submit = async (formEl: FormInstance | undefined, isChange: boolean, data: EmptyObjectType, rule: EmptyObjectType) => {
	if (!formEl) return;
	const form = U.clone(data);
	const urls = (form.urls as Array<any>).map((x) => x.url);
	form.urls = urls.length > 0 ? JSON.stringify(urls) : '';
	form.parentId = form.parentId?.at(-1);
	form['routes'] && form['routes'].forEach((x: any, i: number) => (x.orderNumber = i + 1));

	await formEl.validate(async (valid, fields) => {
		if (valid) {
			let rs: ResponesResult;

			if (!isChange) {
				rs = await insertPermission(form);
			} else {
				rs = await updatePermission(form);
			}

			if (rs.code === 'SUCCESS') {
				menuDialogRef.value.closeDialog();
				jBox.success(!isChange ? '新增权限成功！' : '修改权限成功！', initQuery);
			}
		} else {
			if (!!fields) {
				const errMsg = Object.values(fields as EmptyObjectType)[0][0].message;
				jBox.error(errMsg);
			}
		}
	});
};

onMounted(async () => {
	await initQuery();
});
</script>
