<template>
	<LayoutDialog
		ref="dialogRef"
		:fixed="{ width: '500px', height: 'auto' }"
		:isHeaderClose="false"
		isFixed
		wrapperCls="element-fixed"
		@submit="submit"
	>
		<template #header>修改密码</template>

		<template #render>
			<el-form
				class="form-box form-box--big form-box-validate"
				ref="ruleFormRef"
				:model="form.formData"
				:rules="form.rulesData"
				size="default"
				:inline="false"
				label-width="110px"
			>
				<FormFieldsLayout
					:renderLevel="1"
					:formSetting="{ cardBodyCss: { padding: '20px 15px 10px' } }"
					:showFields="form.showFields"
					:formData="form.formData"
					:rulesData="form.rulesData"
					editor
				/>
			</el-form>
		</template>
	</LayoutDialog>
</template>

<script setup lang="ts" name="changePassword">
import { FormInstance } from 'element-plus';
import { checkSpaceText } from '/@/plugins/verify';
import { U } from '/@/utils';
import { C } from '/@/dicts';
import { jBox } from '/@/plugins/jBox';
import { storage, session } from '/@/plugins/storage';
import { updatePassword, userLogout } from '/@/api/login';

const emit = defineEmits(['submit']);

// 确认密码
const validateAgainPassword = (rule: any, value: any, callback: any): void => {
	if (value === '') {
		callback(new Error('请再次输入新密码'));
	} else if (value !== (form.formData as EmptyObjectType).newPassword) {
		callback(new Error('两次输入密码不一致'));
	} else {
		callback();
	}
};

const dialogRef = ref();
const ruleFormRef = ref<FormInstance>();
const form = reactive({
	showFields: {
		oldPassword: { key: '旧密码', value: '' },
		newPassword: { key: '新密码', value: '', isPassword: true, isShowPassword: false },
		newPasswordConfirm: { key: '确认新密码', value: '', isPassword: true, isShowPassword: false }
	},

	formData: {},

	rulesData: {
		oldPassword: [{ required: true, trigger: 'blur', message: '旧密码不能为空' }],
		newPassword: [
			{ required: true, trigger: 'change', message: '新密码不能为空' },
			{ required: true, validator: checkSpaceText, trigger: 'change' },
			{ pattern: U.verifyExp.password, message: '请使用大小写字母+数字组合，长度8-17个字符' }
		],
		newPasswordConfirm: { required: true, trigger: 'change', validator: validateAgainPassword }
	}
});

// 打开弹窗
const openDialog = (type: string, row?: any) => {
	ruleFormRef.value?.resetFields();
	dialogRef.value.open();
};

// 关闭弹窗
const closeDialog = () => {
	dialogRef.value.close();
};

// 绑定提交
const submit = async () => {
	if (!ruleFormRef.value) return;

	await ruleFormRef.value.validate(async (valid, fields) => {
		if (valid) {
			// 修改密码
			const rs = await updatePassword({ oldPassword: form.formData['oldPassword'], newPassword: form.formData['newPassword'] });
			if (rs.code === 'SUCCESS') {
				const r = await userLogout({}, false, true);
				if (r.code === 'SUCCESS') {
					storage.clear();
					session.clear();
					jBox.success('密码修改成功！');
					closeDialog();

					setTimeout(() => {
						window.location.href = '/login';
					}, 500);
				}
			}
		} else {
			if (!!fields) {
				const errMsg = Object.values(fields as EmptyObjectType)[0][0].message;
				jBox.error(errMsg);
			}
		}
	});
};

onMounted(() => {
	form.formData = U.formatFormData(form.showFields, { cutting: false, submit: false });
});

// 暴露变量
defineExpose({ openDialog, closeDialog });
</script>
