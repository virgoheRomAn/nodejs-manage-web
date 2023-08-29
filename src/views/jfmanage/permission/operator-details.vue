<template>
	<LayoutContainer :title="$t(title)" isFixed :loading="loading">
		<template #default>
			<el-form
				class="form-box form-box--big form-box-validate"
				ref="ruleFormRef"
				scroll-to-error
				:validate-on-rule-change="false"
				:model="form.formData"
				:rules="form.rulesData"
				:inline="false"
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

<script setup lang="ts" name="jfManage.permission.operator.details">
import { FormInstance } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { createObjectByUrlParams, goToUrl } from '/@/hooks/useRoute';
import { parataxis } from '/@/plugins/request';
import { mittBus } from '/@/plugins/settings';
import { jBox } from '/@/plugins/jBox';
import { queryOrganizationList, queryRoleList, queryUserRole, createUser, updateUser } from '/@/api/jfmanage/permission';
import { json } from 'stream/consumers';

const { t } = useI18n();
const route = useRoute();
const loading = ref(false);
const editor = ref(false);
const id = ref('');
const title = ref('');
const ruleFormRef = ref<FormInstance>();
const formFieldsLayoutRef = ref<RefType>();
const form = reactive({
	showFields: {
		operator: {
			key: '用户设置',
			render: 'object',
			value: {
				account: { key: '账号', value: '', column: true, disabled: !!id.value, isNotrequired: !id.value },
				name: { key: '姓名', value: '', column: true },
				password: { key: '密码', value: '', column: true, isNotRenderShow: !id.value },
				orgId: { key: '组织标识', value: '', select: [] as EmptyArrayType, column: true, disabled: !!id.value, isNotrequired: !id.value }
			}
		},
		role: {
			key: '角色设置',
			render: 'object',
			value: {
				roleIds: {
					key: '',
					indeterminate: true,
					indeterminateArray: [] as EmptyArrayType,
					checkboxGroupArray: [] as EmptyArrayType,
					value: [] as EmptyArrayType,
					isNotrequired: true
				}
			}
		}
	},

	formData: {} as EmptyObjectType,
	rulesData: {}
});

watch(
	() => route,
	(r) => {
		title.value = r.query?.tagsViewName as string;
		editor.value = r.query?.editor === '1' ?? false;
		id.value = (r.query?.id as string) ?? '';

		const render = U.getObjectItemByKey({ value: form.showFields }, 'operator');
		render.value.account.disabled = !!id.value;
		render.value.account.isNotrequired = !!id.value;
		render.value.password.isNotRenderShow = !!id.value;
		render.value.orgId.disabled = !!id.value;
		render.value.orgId.isNotrequired = !!id.value;

		!!editor.value && (form.rulesData = U.createRuleData(form.showFields));
	},
	{ immediate: true, deep: true }
);

// 查询接口
async function initQuery(data?: EmptyObjectType) {
	parataxis([
		{
			fun: await queryOrganizationList({}, false),
			callback: (rs: ResponesResult) => {
				if (rs.code === 'SUCCESS') {
					form.showFields.operator.value.orgId.select = U.formatPickerData(rs.data, 'name', 'id');
				}
			}
		},
		{
			fun: await queryRoleList({}, false),
			callback: (rs: ResponesResult) => {
				if (rs.code === 'SUCCESS') {
					const indeterminateArrayString = (rs.data as EmptyArrayType).map((x) =>
						JSON.stringify({
							checkboxGroupArray: U.formatPickerData(
								(rs.data as EmptyArrayType).filter((d) => d.systemGroup === x.systemGroup),
								'roleName',
								'id'
							),
							checked: false,
							status: false,
							code: x.systemGroup,
							text: U.getArrayValueById(x.systemGroup, C.jfManageDict.SystemGroupType)
						})
					);
					const indeterminateArray: EmptyArrayType = [...new Set(indeterminateArrayString)];

					form.showFields.role.value.roleIds.checkboxGroupArray = U.formatPickerData(rs.data, 'roleName', 'id');
					form.showFields.role.value.roleIds.indeterminateArray = indeterminateArray.map((x) => ({ ...JSON.parse(x) }));
				}
			}
		},
		!!id.value
			? {
					fun: await queryUserRole({ userId: id.value }, false),
					callback: (rs: ResponesResult) => {
						if (rs.code === 'SUCCESS') {
							form.showFields.role.value.roleIds.value = (rs.data as EmptyArrayType).map((x) => x.id);
						}
					}
			  }
			: {}
	]).then((rs) => {
		form.formData = U.formatFormData(form.showFields, { deep: true, cutting: false });

		ruleFormRef.value!.resetFields();

		const { account, name, orgId } = createObjectByUrlParams({ route });
		form.formData.account = account || '';
		form.formData.name = name || '';
		form.formData.orgId = orgId || '';
	});
}

// 提交
const submit = async () => {
	const formEl = ruleFormRef.value;
	const data = U.doEmptyObject(form.formData);

	await formEl!.validate(async (valid, fields) => {
		if (valid) {
			let rs: ResponesResult;

			if (!id.value) {
				rs = await createUser(data);
			} else {
				data['id'] = id.value;
				rs = await updateUser(data);
			}

			if (rs.code === 'SUCCESS') {
				jBox.success(!id.value ? '新增操作员成功！' : '修改操作员成功！', back);
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
	goToUrl(`/jfmanage/permission/operator`, route);
};

onMounted(async () => {
	await initQuery();
});
</script>
