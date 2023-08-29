<template>
	<div class="vhm-layout-container">
		<LayoutContainer title="敏感词过滤" :scrollBarCls="isPageTableFixed ? 'is-table-fixed' : ''" isFixed :loading="loading">
			<template #default>
				<el-form
					class="form-box form-box--big form-box--full form-box-validate"
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
						:formSetting="{ cardCls: 'is-full-height-box is-card-oveflow' }"
						:showFields="form.showFields"
						:formData="form.formData"
						:rulesData="form.rulesData"
					/>
				</el-form>
			</template>

			<template #footer>
				<el-button type="primary" @click="toFilter()">开始筛选</el-button>
				<el-button plain @click="clearContent()">清空文本</el-button>
			</template>
		</LayoutContainer>

		<!-- 敏感词过滤列表 -->
		<SensitiveWorld ref="sensitiveWorldRef" />
	</div>
</template>

<script setup lang="ts" name="jfManage.system.sensitive">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { parataxis } from '/@/plugins/request';
import { usePageSetting } from '/@/stores/modules/page';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { searchPromissionPoint } from '/@/hooks/usePermissionPoint';
import { sensitiveWordFilter } from '/@/api/jfmanage/system';

const SensitiveWorld = defineAsyncComponent(() => import('./src/SensitiveWorld.vue'));
const sensitiveWorldRef = ref<RefType>();

const hasPermission = ref(searchPromissionPoint('jrBoss.order.list'));
const storesPageSetting = usePageSetting();
const isPageTableFixed = computed(() => storesPageSetting.pageTableFixed);

const route = useRoute();
const loading = ref(false);
const editor = ref(true);
const ruleFormRef = ref<RefType>();
const formFieldsLayoutRef = ref<RefType>();
const resultData = ref<EmptyObjectType>({});

const form = reactive({
	showFields: {
		operator: {
			key: '过滤内容',
			render: 'object',
			handleList: [{ text: '查看已筛选关键字', callback: checkKeywords }],
			value: {
				content: { key: '', value: '', placeholder: '过滤内容', textarea: true, cls: 'full-height', maxlength: 10000 }
			}
		}
	},

	formData: {} as EmptyObjectType,
	rulesData: {}
});

onMounted(async () => {
	form.formData = U.formatFormData(form.showFields);
	form.rulesData = U.createRuleData(form.showFields);
});

// 查看已筛选关键字
function checkKeywords() {
	sensitiveWorldRef.value.openDialog(resultData.value);
}

/**
 * @description 筛选敏感字接口
 */
async function toFilter() {
	await ruleFormRef.value.validate(async (valid: boolean, fields: any) => {
		if (valid) {
			const rs = await sensitiveWordFilter(form.formData);

			if (rs.code === 'SUCCESS') {
				resultData.value = rs.data;
				sensitiveWorldRef.value.openDialog(rs.data);
			}
		} else {
			if (!!fields) {
				const errMsg = Object.values(fields as EmptyObjectType)[0][0].message;
				jBox.error(errMsg);
			}
		}
	});
}

/**
 * @description 清空文本
 */
function clearContent() {
	U.emptyData(form.formData);
}
</script>
