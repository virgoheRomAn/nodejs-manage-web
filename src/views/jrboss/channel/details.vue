<template>
	<div class="vhm-layout-container">
		<LayoutContainer :title="isUpdate ? params.name : '新增渠道'" isFixed :loading="loading">
			<template #header>
				<el-radio-group class="mt10" v-model="nav.current" @change="changeNav">
					<template v-for="(item, index) in nav.list" :key="index">
						<el-radio-button :label="item.code" :disabled="!isUpdate && item.code !== 'baseInfo'">{{ item.text }}</el-radio-button>
					</template>
				</el-radio-group>
			</template>

			<template #default>
				<el-form
					ref="ruleFormRef"
					class="form-box form-box--large form-box--block"
					:class="{ 'form-box-validate': editor, 'form-box-view': !editor }"
					:validate-on-rule-change="false"
					:model="form.formData"
					:rules="form.rulesData"
					:inline="false"
					label-width="180px"
				>
					<FormFieldsLayout
						ref="formFieldsLayoutRef"
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
				<template v-if="nav.current !== 'managerInfo'">
					<el-button type="primary" @click="submit()" v-if="!isUpdate">提交</el-button>
					<el-button type="primary" @click="submit()" v-else>{{ nav.current === 'companyInfo' ? `修改业务信息` : `修改渠道信息` }}</el-button>
				</template>
			</template>
		</LayoutContainer>
	</div>
</template>

<script setup lang="ts" name="jrBoss.channel.details">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { parataxis } from '/@/plugins/request';
import { createObjectByUrlParams, goToUrl } from '/@/hooks/useRoute';
import { setRenderFormByAjaxData } from '/@/hooks/customForm/useFormFields';
import { InitFormConfig } from '/@/hooks/customForm/jrboss/initConfig';
import { queryListByPageHandler } from '/@/hooks/customForm/jrboss/formHandleCall';
import { RenderChannelFields } from './src/renderFields';
import { queryJrProduct } from '/@/api/common';
import {
	queryChannelDetails,
	queryJRProductConfig,
	queryChannelProducts,
	saveChannelProducts,
	updateJrChannel,
	createJrChannel,
	queryPageJrOperator
} from '/@/api/jrboss/channel';

const route = useRoute();
const loading = ref(false);
const editor = ref(true);
const formConfig = ref({});
const params = createObjectByUrlParams({ route });
const renderFields = RenderChannelFields(editor.value, { ...params, handler, pageChange });
const isUpdate = ref<boolean>(!!params.id);
const nav = reactive({
	current: 'baseInfo',
	list: [
		{ code: 'baseInfo', text: '基础信息', formData: {} },
		{ code: 'companyInfo', text: '业务信息', formData: { productIds: [] } },
		{ code: 'managerInfo', text: '管理员信息', formData: {} }
	]
});
const resultData = reactive<{ productList: any[]; productConfig: EmptyObjectType; channelDetials: EmptyObjectType }>({
	productList: [],
	productConfig: {},
	channelDetials: {}
});

const ruleFormRef = ref<RefType>();
const formFieldsLayoutRef = ref<RefType>();

const form = reactive({
	showFields: renderFields,
	formData: {} as EmptyObjectType,
	rulesData: {} as EmptyObjectType
});

// 查询接口
async function initQuery(data?: EmptyObjectType) {
	form.formData = U.formatFormData(form.showFields);
	form.rulesData = U.createRuleData(form.showFields);

	parataxis([
		{
			fun: queryJrProduct({}, false),
			callback: async (rs: ResponesResult) => {
				if (rs.code === 'SUCCESS') {
					const product: any[] = (resultData.productList = rs.data);
					const { productIds, productConfig } = form.showFields.companyInfo.value as any;
					productIds.checkboxGroupArray = U.formatPickerData(product, 'name', 'id');

					// 并发执行 获取渠道绑定产品和产品配置
					parataxis([
						{
							fun: queryJRProductConfig({}, false),
							callback: async (proConfigRs: ResponesResult) => {
								if (proConfigRs.code === 'SUCCESS') {
									resultData.productConfig = proConfigRs.data;

									product.forEach((item) => {
										productConfig.value[item.id] = {
											key: item.name,
											isRuleDeep: true,
											isNotRenderShow: false,
											value: {}
										};

										proConfigRs.data.forEach((x: any) => {
											if (item.id === x.productId) {
												productConfig.value[item.id].value[x.configKey] = {
													key: x.configName,
													value: '',
													isNotrequired: !x.required,
													placeholder: x.configKey === 'annualInterestRate' ? `0-24之间，以英文格式";"隔开` : ``
												};
											}
										});

										form.formData['productConfig'][item.id] = {};
									});

									// 重新生成规则
									form.rulesData = U.createRuleData(form.showFields);
								}
							}
						},
						{
							fun: params.id ? queryChannelProducts({ channelId: params.id }, false) : null,
							callback: async (channelProRs: ResponesResult) => {
								if (channelProRs.code === 'SUCCESS') {
									channelProRs.data.channelProducts.forEach((item: any) => {
										product.forEach((d: any) => {
											if (item.productId === d.id && item.status === 'ON') {
												form.formData['productIds'].push(item.productId);
											}
										});

										const configItems: any[] = item.configItems;
										configItems.forEach((x) => {
											form.formData['productConfig'][item.productId][x.configKey] = x.configValue;
											form.formData['productConfig'][item.productId][`${x.configKey}_key`] = x.configName;
										});
									});
								}
							}
						}
					]);
				}
			}
		},
		{
			fun: isUpdate.value ? queryChannelDetails({ id: params.id }, false) : null,
			callback: (rs: ResponesResult) => {
				if (rs.code === 'SUCCESS') {
					resultData.channelDetials = rs.data;
					setRenderFormByAjaxData(form, form.formData, form.showFields, rs);
				}
			}
		},
		{
			fun: queryPageJrOperator({ getGroups: true, operatorGroupIds: ['5'] }, false),
			callback: (rs: ResponesResult) => {
				if (rs.code === 'SUCCESS') {
					const managerList = U.getObjectItemByKey({ value: form.showFields }, 'manager');
					form.formData['manager'] = rs.data;
					managerList.pages.total = rs.total;
				}
			}
		}
	]);
}

// 历史审批记录分页查询
function pageChange(val: EmptyObjectType, current: EmptyObjectType, formKey: string) {
	queryListByPageHandler(formKey, form, val, current, {});
}

/**
 * @description 共借人、联系人、抵押物等表格操作项
 */
function handler(key: any, data: any, rows: any, button: EmptyObjectType, scope: any, item: any): void {}

// 切换菜单
async function changeNav(value: string) {
	nav.current = value;

	for (let key in form.showFields) {
		form.showFields[key].isNotRenderShow = key !== value;
	}

	form.rulesData = U.createRuleData(form.showFields);
}

// 提交
const submit = async () => {
	console.log(form);
	console.log(form.formData);
	await ruleFormRef.value.validate(async (valid: boolean, fields: any) => {
		if (valid) {
			switch (nav.current) {
				case 'baseInfo':
					let res: any = {};

					if (isUpdate.value) {
						res = await updateJrChannel({ ...form.formData, id: params.id });
					} else {
						res = await createJrChannel({ ...form.formData });
					}

					if (res.code === 'SUCCESS') {
						if (!isUpdate.value) {
							params.id = res.data.id;
							isUpdate.value = true;
						}

						jBox.success(isUpdate.value ? '修改渠道基本信息成功' : '新增渠道基本信息成功');
						changeNav('companyInfo');
					}

					break;
				case 'companyInfo':
					const { productIds, productConfig } = form.formData as any;
					const proInfo = { channelId: params.id, channelProducts: [] as any[] };

					resultData.productList.forEach((item: any) => {
						proInfo.channelProducts.push({
							productId: item.id,
							status: productIds.includes(item.id) ? 'ON' : 'OFF',
							configItems: []
						});
					});

					for (let key in productConfig) {
						let item = productConfig[key];
						proInfo.channelProducts.forEach((x) => {
							if (x.productId === key) {
								for (let k in item) {
									if (k.indexOf('_key') < 0) {
										x.configItems.push({
											configKey: k,
											configName: item[`${k}_key`],
											configValue: item[k]
										});
									}
								}
							}
						});
					}

					const rs = await saveChannelProducts(proInfo);
					if (rs.code === 'SUCCESS') {
						jBox.success('产品配置信息保存成功！');
						changeNav('managerInfo');
					}
					break;
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
	goToUrl(`/jrboss/channel/list`, route);
};

onMounted(async () => {
	await initQuery();

	// changeNav('managerInfo');
});
</script>
