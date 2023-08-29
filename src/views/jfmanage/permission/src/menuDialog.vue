<template>
	<LayoutDialog ref="dialogRef" isFixed isHeaderClose :editor="editor" :isChange="isChange" @submit="submit" @change="change">
		<template #header>{{ title }}</template>

		<template #render v-if="isRender">
			<el-form
				ref="ruleFormRef"
				class="form-box is-no-margin-right"
				:class="{ 'form-box-validate': editor, 'form-box-view': !editor }"
				:validate-on-rule-change="false"
				:model="form.formData"
				:rules="form.rulesData"
				:inline="false"
				label-width="120px"
			>
				<FormFieldsLayout
					:renderLevel="2"
					:formSetting="{ cardContCls: 'flex-between' }"
					:isView="!editor"
					:editor="editor"
					:showFields="form.showFields"
					:formData="form.formData"
					:rulesData="form.rulesData"
					@cascaderChange="cascaderChange"
				/>
			</el-form>
		</template>
	</LayoutDialog>
</template>

<script setup lang="ts" name="jfManagePermissionMenuDialog">
import { FormInstance } from 'element-plus';
import { settings } from '/@/plugins/settings';
import { U } from '/@/utils';
import { C } from '/@/dicts';

const props = defineProps({
	menuTree: { type: Array as PropType<Array<any>>, default: () => [] }
});

const emit = defineEmits(['submit']);

const isRender = ref(false);
const title = ref('');
const editor = ref(true);
const isChange = ref(false);
const dialogRef = ref();
const tree = ref<Array<any>>([]);
const ruleFormRef = ref<FormInstance>();
const currentRemoteInfo = ref<EmptyObjectType>({});
const form = reactive({
	showFields: {
		permission: {
			key: '权限设置',
			render: 'object',
			value: {
				id: { key: '权限ID', value: '' },
				permissionType: {
					key: '权限类型',
					value: '',
					disabled: false,
					select: U.enum2Array(C.jfManageEnum.PermissionType),
					change: permissionTypeChange
				},
				parentId: {
					key: '上级菜单',
					value: [],
					cascader: { separator: '/', data: [] as Array<any> },
					cascaderProps: { checkStrictly: true, value: 'id', label: 'name' },
					full: true
				},
				permissionCode: { key: '权限code', value: '', full: true },
				icon: { key: '权限图标', value: '', iconSelect: true, full: true },
				systemId: { key: '系统标识', value: '', select: U.enum2Array(C.jfManageEnum.SystemType) },
				permissionName: { key: '权限名', value: '' },
				orderNumber: { key: '权限排序', value: 10, inputNumber: true },
				urls: {
					key: '权限拦截',
					isHiddenLine: true,
					formatField: { url: { key: '权限拦截', value: '' } },
					addHandle: { text: '新增', callback: addAuthUrls },
					delHandle: { text: '删除', callback: delAuthUrls },
					value: [],
					full: true
				}
			}
		},
		routes: {
			key: '前端路由设置',
			render: 'array',
			name: '第 %no% 个路由',
			isRuleNotDeep: true,
			handleList: [{ text: '添加路由', isIcon: true, callback: addPermissionRoutes }],
			itemHandleList: [{ text: '删除路由', isIcon: true, callback: delPermissionRoutes }],
			width: '100px',
			isNotRenderShow: false,
			formatField: {
				code: { key: '路由code', value: '', full: true },
				path: { key: '路由路径', value: '', full: true },
				template: {
					key: '路由模板',
					value: '',
					full: true,
					remoteFilter: true,
					remoteSelect: [],
					remoteMethod: userRemoteMethod,
					focus: userRemoteFocus
				},
				name: { key: '路由名称', value: '', column: true },
				keepAlive: {
					key: '页面缓存',
					value: 1,
					radioGroup: true,
					radios: [
						{ key: '是', value: 1 },
						{ key: '否', value: 0 }
					]
				},
				hidden: {
					key: '是否隐藏',
					value: 0,
					radioGroup: true,
					radios: [
						{ key: '是', value: 1 },
						{ key: '否', value: 0 }
					]
				}
			},
			value: []
		}
	},

	formData: {},
	rulesData: {}
});

// 打开弹窗
const openDialog = (type: string, row?: any) => {
	nextTick(() => {
		setViewLayout();
		addAuthUrls(false);
		addPermissionRoutes(false);

		form.showFields.routes.isNotRenderShow = false;

		if (type === 'edit' || type === 'details') {
			const data = U.clone(row);
			const { type } = data;
			title.value = type === 'details' ? '菜单详情' : '修改菜单';
			form.showFields.routes.isNotRenderShow = type === 'POINT';
			data.urls = JSON.parse(data.urls);
			data.urls = (data.urls as Array<any>).map((x) => ({ url: x }));
			data.parentId = data.parentId === '-1' ? ['-1'] : U.queryParentIdArrayById(data.id, tree.value).parentIds;

			// 如果路由保存失败，返回的数据为空
			// 手动构建一条路由空数据
			if (data.routes.length === 0 && type === 'MENU') {
				const routes = U.formatFormData({ routes: form.showFields.routes.formatField }, { cutting: false, submit: false });
				data.routes = [routes];
			}

			form.formData = data;
			U.setAjaxFormatData(form.showFields, data);
		} else if (type === 'add') {
			title.value = '新增菜单';
			const data = U.clone(form.formData);
			U.emptyDataDeep(data, true);
			U.emptyDataDeep(form.formData, true);
			U.setAjaxFormatData(form.showFields, data);
		} else if (type === 'addChild') {
			title.value = '新增子集菜单';
			const data = U.clone(row);
			const parentId = U.queryParentIdArrayById(data.id, tree.value).parentIds;
			parentId.push(data.id);
			form.formData['parentId'] = parentId;
		}

		editor.value = type !== 'details';
		isChange.value = type === 'edit';
		form.showFields.permission.value.permissionType.disabled = type === 'edit';
		isRender.value = true;
	});

	ruleFormRef.value?.clearValidate();
	dialogRef.value.open();
};

// 关闭弹窗
const closeDialog = () => {
	isRender.value = false;
	dialogRef.value.close();
};

// 选择权限类型
function permissionTypeChange(value: any, item: any, data: any, formKey: any, formData: any) {
	form.showFields.routes.isNotRenderShow = value === 'POINT';
}

// 级联选择
const cascaderChange = (code: Array<any>, text: Array<any>, key: string, item: EmptyObjectType) => {};

// 远程搜索模板
function userRemoteFocus(event: Event, item: EmptyObjectType, data: EmptyObjectType, form: EmptyObjectType, formKey: string) {
	currentRemoteInfo.value = { item, data, form, formKey, select: U.clone(item.remoteSelect) };
}

// 远程搜索模板 - 匹配结果
function userRemoteMethod(query: string) {
	if (query !== '') {
		currentRemoteInfo.value.item.remoteSelect = currentRemoteInfo.value.select.filter(
			(item: any) => item.text.toLowerCase().indexOf(query.toLowerCase()) > -1
		);

		if (currentRemoteInfo.value.item.remoteSelect.length === 0) {
			currentRemoteInfo.value.form[currentRemoteInfo.value.formKey] = query;
		}
	} else {
		currentRemoteInfo.value.item.remoteSelect = currentRemoteInfo.value.select;
	}
}

// 添加多个权限拦截
function addAuthUrls(isNotEmpty: boolean = true) {
	const urlsField = U.getObjectItemByKey({ value: form.showFields }, 'urls');
	const { formatField, value } = urlsField;
	const finallyField = U.clone(formatField);
	const finallyFieldForm = U.formatFormData(finallyField, { cutting: true, submit: false });
	!isNotEmpty && U.emptyArray(value);
	!isNotEmpty && U.emptyArray(form.formData['urls']);
	value.push(finallyField);
	form.formData['urls'].push(finallyFieldForm);
}

// 删除多个权限拦截
function delAuthUrls(button: EmptyObjectType, item: EmptyObjectType, index: number, render: EmptyObjectType, data: EmptyObjectType) {
	render.splice(index, 1);
	form.formData['urls'].splice(index, 1);
}

// 设置路由模板
const setViewLayout = () => {
	const routesField = U.getObjectItemByKey({ value: form.showFields }, 'routes');
	const { formatField } = routesField;
	formatField['template'].remoteSelect = settings.createViewLayoutList();
};

// 添加多个路由
function addPermissionRoutes(isNotEmpty: boolean = true) {
	const routesField = U.getObjectItemByKey({ value: form.showFields }, 'routes');
	const { formatField, value } = routesField;
	const finallyField = U.clone(formatField);
	const finallyFieldForm = U.formatFormData(finallyField, { cutting: true, submit: false });
	!isNotEmpty && U.emptyArray(value);
	!isNotEmpty && U.emptyArray(form.formData['routes']);
	value.push(finallyField);
	form.formData['routes'].push(finallyFieldForm);
}

// 删除多个路由
function delPermissionRoutes(button: EmptyObjectType, item: EmptyObjectType, index: number, data: EmptyObjectType) {
	item.value.splice(index, 1);
	form.formData['routes'].splice(index, 1);
}

watch(
	() => props.menuTree,
	(val: Array<any>) => {
		tree.value = U.clone(val);
		tree.value.unshift({ id: '-1', name: '顶级菜单' });

		const parentIdField = U.getObjectItemByKey({ value: form.showFields }, 'parentId');
		parentIdField.cascader.data = tree.value;
	},
	{ immediate: true, deep: true }
);

onMounted(() => {
	form.formData = U.formatFormData(form.showFields, { cutting: false, submit: false });
	form.rulesData = U.createRuleData(form.showFields);
});

// 绑定提交
const submit = () => {
	emit('submit', ruleFormRef.value, isChange.value, form.formData, form.rulesData);
};

// 修改
const change = () => {
	emit('submit', ruleFormRef.value, isChange.value, form.formData, form.rulesData);
};

// 暴露变量
defineExpose({ openDialog, closeDialog });
</script>
