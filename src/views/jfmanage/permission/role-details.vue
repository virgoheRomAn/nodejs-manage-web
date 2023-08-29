<template>
	<LayoutContainer :title="$t(title)" isFixed :loading="loading">
		<template #default>
			<el-form
				class="form-box form-box--big form-box-validate"
				ref="ruleFormRef"
				:validate-on-rule-change="false"
				:model="form.formData"
				:rules="form.rulesData"
				:inline="false"
				scroll-to-error
				label-width="130px"
			>
				<FormFieldsLayout
					ref="formFieldsLayoutRef"
					:renderLevel="2"
					:isView="!editor"
					:editor="editor"
					:showFields="form.showFields"
					:formData="form.formData"
					:rulesData="form.rulesData"
				/>
			</el-form>
		</template>

		<template #footer>
			<el-button @click="back()">返回</el-button>

			<template v-if="editor">
				<el-button type="primary" @click="submit()">{{ !id ? `新增` : `修改` }}</el-button>
			</template>
		</template>
	</LayoutContainer>
</template>

<script setup lang="ts" name="jfmanagePermissionRoleDetails">
import { FormInstance } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { createObjectByUrlParams, goToUrl } from '/@/hooks/useRoute';
import { parataxis } from '/@/plugins/request';
import { mittBus } from '/@/plugins/settings';
import { jBox } from '/@/plugins/jBox';
import { queryPermission, insertRole, updateRole, queryBindPermissionByRoleId } from '/@/api/jfmanage/permission';

const { t } = useI18n();
const route = useRoute();
const loading = ref(false);
const editor = ref(false);
const id = ref('');
const title = ref('');
const tree = ref<Array<any>>([]);
const ruleFormRef = ref<FormInstance>();
const formFieldsLayoutRef = ref<RefType>();
const form = reactive({
	showFields: {
		role: {
			key: '角色设置',
			render: 'object',
			value: {
				roleCode: { key: '角色编码', value: '', column: true },
				roleName: { key: '角色名称', value: '', column: true },
				systemGroup: { key: '系统组标识', value: '', select: C.jfManageDict.SystemGroupType, isNumberValueRule: true, column: true }
			}
		},
		tree: {
			key: '菜单设置',
			render: 'object',
			value: {
				permissionIds: {
					key: '权限树',
					value: [],
					source: [] as Array<any>,
					data: [] as Array<any>,
					tree: true,
					prorps: { children: 'children', label: 'permissionName' },
					options: {
						expanded: ['01', '02', '03'],
						checked: [] as string[]
					}
				}
			}
		}
	},

	formData: {} as EmptyObjectType,
	rulesData: {} as EmptyObjectType
});

watch(
	() => route,
	(r) => {
		title.value = r.query?.tagsViewName as string;
		editor.value = r.query?.editor === '1' ?? false;
		id.value = (r.query?.id as string) ?? '';
	},
	{ immediate: true, deep: true }
);

// 查询接口
async function initQuery(data?: EmptyObjectType) {
	parataxis([
		{
			fun: await queryPermission({}, false),
			callback: (rs: ResponesResult) => {
				if (rs.code === 'SUCCESS') {
					form.showFields.tree.value.permissionIds.data = rs.data.tree;
					form.showFields.tree.value.permissionIds.source = rs.data.permission;
				}
			}
		},
		!!id.value
			? {
					fun: await queryBindPermissionByRoleId({ id: id.value }, false),
					callback: (rs: ResponesResult) => {
						if (rs.code === 'SUCCESS') {
							const treeCheckKeys = rs.data.filter((x) => x.parentId !== '-1').map((x) => x.id);
							form.showFields.tree.value.permissionIds.options.expanded = treeCheckKeys;
							form.showFields.tree.value.permissionIds.options.checked = treeCheckKeys;
						}
					}
			  }
			: {}
	]).then((rs) => {
		form.formData = U.formatFormData(form.showFields, { cutting: false, submit: false });
		!!editor.value && (form.rulesData = U.createRuleData(form.showFields));

		ruleFormRef.value!.resetFields();

		const { roleCode, roleName, systemGroup } = createObjectByUrlParams({ route });
		form.formData.roleCode = roleCode || '';
		form.formData.roleName = roleName || '';
		form.formData.systemGroup = systemGroup ? Number(systemGroup) : '';
	});
}

// 提交
const submit = async () => {
	const formEl = ruleFormRef.value;
	mittBus.emit('getTreeCheckKeys');
	// const treeRef = formFieldsLayoutRef.value.$refs.formFieldsLayoutItemRef.at(-1)['formFieldsRenderRef']['treeRef']['permissionIds'];
	// form.formData['permissionIds'] = treeRef!.getCheckedKeys(true);
	// console.log(form.formData['permissionIds']);

	await formEl!.validate(async (valid, fields) => {
		if (valid) {
			let rs: ResponesResult;

			if (!id.value) {
				rs = await insertRole(form.formData);
			} else {
				form.formData['id'] = id.value;
				rs = await updateRole(form.formData);
			}

			if (rs.code === 'SUCCESS') {
				jBox.success(!id.value ? '新增权限成功！' : '修改权限成功！', back);
			}
		} else {
			if (!!fields) {
				const errMsg = Object.values(fields as EmptyObjectType)[0][0].message;
				jBox.error(errMsg);
			}
		}
	});
};

// 返回
const back = () => {
	goToUrl(`/jfmanage/permission/role`, route);
};

onMounted(async () => {
	await initQuery();
});
</script>
