<template>
	<LayoutDialog
		ref="dialogRef"
		isHeaderClose
		isFixed
		:fixed="{ width: '500px', height: 'auto' }"
		:isChange="isChange"
		@submit="submit"
		@change="submit"
	>
		<template #header>{{ !isChange ? '新增业务人员' : '编辑业务人员' }}</template>

		<template #render v-if="isRender">
			<el-form
				ref="ruleFormRef"
				class="form-box form-box--long form-box-validate"
				:validate-on-rule-change="false"
				:model="form.formData"
				:rules="form.rulesData"
				:inline="false"
				label-width="120px"
			>
				<FormFieldsLayout
					editor
					:isView="false"
					:formSetting="{ cardContCls: 'pt10' }"
					:renderLevel="1"
					:showFields="form.showFields"
					:formData="form.formData"
					:rulesData="form.rulesData"
				/>
			</el-form>
		</template>
	</LayoutDialog>
</template>

<script setup lang="ts" name="jrBossBusinessStaffDialog">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { setRenderFormByAjaxData } from '/@/hooks/customForm/useFormFields';
import { queryUserByPage } from '/@/api/common';
import { savejrBusinessStaff, updatejrBusinessStaff } from '/@/api/jrboss/business';

const emit = defineEmits(['submit', 'update:form']);

const isRender = ref(false);
const dialogRef = ref();
const ruleFormRef = ref();
const isChange = ref(false);
const formData = ref<EmptyObjectType>({});
const form = reactive({
	showFields: {
		jrOperatorId: { key: '姓名', value: '', select: [], isNotRenderShow: isChange.value, column: true },
		name: { key: '姓名', value: '', isNotRenderShow: !isChange.value, column: true, readonly: true, isNotrequired: true },
		phoneNum: {
			key: '手机号',
			value: '',
			column: true,
			maxlength: 11,
			rules: [{ pattern: U.verifyExp.mobile, message: '手机号格式错误', trigger: 'blur' }]
		},
		cityCode: { key: '所属区域', value: '', select: C.jrDict.BusinessAreaCity, column: true }
	} as EmptyObjectType,
	formData: {} as EmptyObjectType,
	rulesData: {} as EmptyObjectType
});

// 打开弹窗
const openDialog = async (type: string, rows: EmptyObjectType) => {
	isChange.value = type === 'change';
	form.showFields.jrOperatorId.isNotRenderShow = isChange.value;
	form.showFields.name.isNotRenderShow = !isChange.value;
	form.formData = U.formatFormData(form.showFields);
	form.rulesData = U.createRuleData(form.showFields);

	if (isChange.value) {
		formData.value = rows;
		setRenderFormByAjaxData(form, form.formData, form.showFields, { data: rows });
		isRender.value = true;
		dialogRef.value.open();
	} else {
		const rs = await queryUserByPage({ pages: { page: 1, size: 10000 } });
		if (rs.code === 'SUCCESS') {
			form.showFields.jrOperatorId.select = U.formatPickerData(rs.data.users, 'name', 'id');

			isRender.value = true;
			dialogRef.value.open();
			ruleFormRef.value?.clearValidate();
		}
	}
};

// 关闭弹窗
const closeDialog = () => {
	isRender.value = false;
	dialogRef.value.close();
};

onMounted(() => {});

// 绑定提交
const submit = async () => {
	await ruleFormRef.value.validate(async (valid: boolean, fields: any) => {
		if (valid) {
			const data = U.clone(form.formData);

			if (isChange.value) {
				data['id'] = formData.value['id'];
				data['city'] = U.getArrayValueById(data['cityCode'], C.jrDict.BusinessAreaCity);
			}

			let rs: ResponesResult = await savejrBusinessStaff(data);

			if (rs.code === 'SUCCESS') {
				jBox.success(!isChange.value ? '新增业务人员成功！' : '修改业务人员成功！');
				closeDialog();
				emit('submit');
			}
		} else {
			if (!!fields) {
				const errMsg = Object.values(fields as EmptyObjectType)[0][0].message;
				jBox.error(errMsg);
			}
		}
	});
};

// 暴露变量
defineExpose({ openDialog, closeDialog });
</script>
