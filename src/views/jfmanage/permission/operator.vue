<template>
	<LayoutContainer title="操作员管理" isFixed :loading="loading">
		<template #default>
			<ListContent v-model:showFields="table.showFields" :data="table" :loading="loading" isTableHeader :handlerList="{ handler }">
				<template #search>
					<ListHeader
						:showFields="form.showFields"
						:rules="form.rules"
						:button="headerButtons"
						:isUseToggle="false"
						isExtends
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

<script setup lang="ts" name="jfManage.permission.operator.index">
import { Action } from 'element-plus';
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { createUrlParams } from '/@/hooks/useRoute';
import { queryUserByPage, resetUserPassword, updateUser } from '/@/api/jfmanage/permission';
import { searchPromissionPoint } from '/@/hooks/usePermissionPoint';

const hasPermission = ref(searchPromissionPoint('jfManage.permission.operator.edit'));

const RESET_PASSWORD = 'Zbj123456';
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const headerButtons = reactive([
	{
		text: '新增用户',
		type: 'success',
		icon: 'ele-FolderAdd',
		isNotRenderShow: !hasPermission.value,
		handler: () => {
			router.push(`/jfmanage/permission/operator/details?editor=1&tagsViewName=message.jfManage.permission.operator.add`);
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
		orgId: { key: '机构标识', value: '', select: [] as EmptyArrayType },
		account: { key: '账号', value: '' },
		name: { key: '姓名', value: '' }
	},

	rules: {}
});

const table = reactive({
	export: false,
	title: '角色列表',
	list: [],

	showFields: {
		createTime: { key: '创建时间', timestamp: true },
		account: { key: '账号' },
		name: { key: '姓名' },
		orgId: { key: '机构标识', convert: [] as EmptyArrayType },
		status: { key: '状态', convert: U.enum2Array(C.jfManageEnum.UserStatus), width: '100px' },
		isLocked: { key: '锁定', convert: C.jfManageDict.UserLocked, width: '100px' },
		handler: {
			key: '操作',
			statusFields: 'status',
			isNotRenderShow: !hasPermission.value,
			buttons: [
				{ text: '编辑', type: 'primary', emit: 'edit', isAlways: true },
				{ text: '重置密码', type: 'warning', emit: 'reset', isAlways: true },
				{ text: '解锁', type: 'success', emit: 'unlocked', aloneStatusField: 'isLocked', aloneStatusValue: 1 },
				{ text: '禁用', type: 'danger', emit: 'status', formData: 'DISABLE', includeStatus: ['ENABLE'] },
				{ text: '启用', type: 'success', emit: 'status', formData: 'ENABLE', includeStatus: ['DISABLE'] }
			]
		}
	}
});

// 绑定的按钮操作
const handler = (key: string, data: EmptyObjectType, rows: EmptyObjectType, button: EmptyObjectType) => {
	switch (key) {
		case 'edit':
			const editor = '1';
			const tagsViewName = 'message.jfManage.permission.operator.edit';
			const query = createUrlParams({
				route,
				isRoute: false,
				opts: {
					id: rows.id,
					name: rows.name,
					account: rows.account,
					orgId: rows.orgId,
					editor,
					tagsViewName
				}
			});

			router.push(`/jfmanage/permission/operator/details?${query}`);
			break;
		// 重置
		case 'reset':
			jBox.confirm(`是否确认为操作员 「${rows.name}」 重置密码?`, '重置操作', {
				callback: async (action: Action) => {
					if (!!action && action !== 'cancel') {
						const rs = await resetUserPassword({ id: rows.id, password: RESET_PASSWORD });
						if (rs.code === 'SUCCESS') {
							jBox.success('重置密码成功!');
						}
					}
				}
			});
			break;

		// 解锁
		case 'unlocked':
			jBox.confirm(`是否确认为操作员 「${rows.name}」 解锁?`, '解锁操作', {
				callback: async (action: Action) => {
					if (!!action && action !== 'cancel') {
						const rs = await updateUser({ id: rows.id, isLocked: 0 });
						if (rs.code === 'SUCCESS') {
							jBox.success('解锁成功!');
							await initQuery();
						}
					}
				}
			});
			break;

		// 禁用启用
		case 'status':
			const { formData } = button;
			const text = formData === 'DISABLE' ? '禁用' : '启用';
			jBox.confirm(`是否${text} 「${rows.name}」 操作员?`, `${text}操作`, {
				callback: async (action: Action) => {
					if (!!action && action !== 'cancel') {
						const rs = await updateUser({ id: rows.id, status: formData });
						if (rs.code === 'SUCCESS') {
							jBox.success(`${text}操作成功!`, initQuery);
						}
					}
				}
			});
			break;
	}
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
	const rs: any = await queryUserByPage({ ...data, pages: form.pages });
	if (rs.code === 'SUCCESS') {
		table.list = rs.data.users;
		form.pages.total = rs.data.total;

		form.showFields.orgId.select = U.formatPickerData(rs.data.orgs, 'name', 'id');
		table.showFields.orgId.convert = U.formatPickerData(rs.data.orgs, 'name', 'id');
	}
}

onMounted(async () => {
	await initQuery();
});
</script>
