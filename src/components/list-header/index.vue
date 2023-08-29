<template>
	<el-form
		ref="ruleFormRef"
		class="form-box form-box-validate"
		:validate-on-rule-change="false"
		:model="form.formData"
		:rules="form.rulesData"
		inline
		:label-width="labelWidth"
	>
		<FormFieldsLayout
			ref="formFieldsLayoutRef"
			:renderLevel="1"
			:formSetting="{ cardCls: isContentInner ? 'is-content-inner' : '' }"
			:showFields="showFields"
			:formData="form.formData"
			:rulesData="form.rulesData"
			editor
		>
			<template #form-button="{ showFields }">
				<el-form-item class="form-card-box--item" :class="buttonCls" :label="buttonCls === 'block' ? ` ` : ``">
					<template v-for="(item, index) in buttons" :key="`button_${index}`">
						<el-button
							:type="item.type"
							:plain="item.plain"
							:round="item.round"
							:icon="item.icon"
							:loading="item.loading"
							@click="item.handler"
							v-if="!item.isNotRenderShow"
						>
							<span>{{ item.text }}</span>
						</el-button>
					</template>

					<template v-if="isUseToggle">
						<div class="color-primary cursor-pointer ml10" @click="useToggleSearch()">
							<span>{{ isToggle ? '收筛选' : '展筛选' }}</span>
							<SvgIcon :name="isToggle ? 'ele-ArrowUp' : 'ele-ArrowDown'" />
						</div>
					</template>
				</el-form-item>
			</template>
		</FormFieldsLayout>
	</el-form>
</template>
<script setup lang="ts" name="vhmListHeader">
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { usePageSetting } from '/@/stores/modules/page';

const props = defineProps({
	// 启用了缓存的列表是后需要 启用头部重新加载刷新数据
	isKeepaliveRefresh: { type: Boolean, default: false },
	// 是否在内容的内层
	isContentInner: { type: Boolean, default: false },
	// 是否启用展开收缩选项
	isUseToggle: { type: Boolean, default: true },
	// 启用展开收缩选项 是否开启筛选主要展示字段
	isMain: { type: Boolean, default: false },
	// 表单文本宽度
	labelWidth: { type: String, default: '100px' },
	// 按钮布局
	buttonLayout: { type: String, default: 'inline' },
	// 是否展示重置按钮
	isRefresh: { type: Boolean, default: true },
	// 重置按钮是否开启请求数据
	isRefreshFunction: { type: Boolean, default: true },
	// 是否开启扩展 false表示不接收外部传输 只展示默认按钮
	isExtends: { type: Boolean, default: false },
	// 是否扩展按钮 false表示只展示传入的按钮 不展示默认的按钮
	isButtonExtends: { type: Boolean, default: true },
	// 扩展按钮是否展示在默认按钮后面
	mergerMode: { type: String, default: 'before' },
	// 表单数据
	showFields: { type: Object as PropType<EmptyDataType>, default: () => ({}) },
	// 验证规则
	rules: { type: Object as PropType<EmptyDataType>, default: () => ({}) },
	// 按钮展示
	button: { type: Array as PropType<EmptyArrayType>, default: () => [] }
});

const emit = defineEmits(['cancel', 'keepaliveSearch', 'submit', 'selectChange']);
const attrs = useAttrs();
const route = useRoute();
const pagename = ref<string>('');
const ruleFormRef = ref<RefType>();
const storesPageSetting = usePageSetting();

const isToggle = computed(() => storesPageSetting.pageSearchCollapse);

const form = reactive({
	formData: U.formatFormData(props.showFields),
	rulesData: props.rules
});

const buttonDefaults = [
	{
		text: '查询',
		type: 'primary',
		plain: false,
		round: false,
		icon: 'ele-Search',
		handler: () => {
			handleFormSubmit();
		}
	},
	{
		text: '重置',
		type: '',
		plain: false,
		round: false,
		icon: 'ele-Refresh',
		isNotRenderShow: !props.isRefresh,
		handler: () => {
			handleFormReset();
		}
	}
];

const buttonCls = computed(() =>
	!isToggle.value ? (!props.isMain ? props.buttonLayout : 'inline') : props.buttonLayout === 'block' ? 'block' : props.buttonLayout
);
const buttons = computed(() => {
	if (props.isExtends) {
		let mergeButton: EmptyArrayType = [];

		switch (props.mergerMode) {
			case 'before':
				mergeButton = U.mergeObjArray(props.button, buttonDefaults);
				break;
			case 'insert':
				buttonDefaults.splice(1, 0, ...props.button);
				mergeButton = buttonDefaults;
				break;
			case 'after':
			default:
				mergeButton = U.mergeObjArray(buttonDefaults, props.button);
				break;
		}

		return props.isButtonExtends ? mergeButton : props.button;
	} else {
		return buttonDefaults;
	}
});

// 展开收回筛选项
const useToggleSearch = (init = false) => {
	Object.values(props.showFields).forEach((item, index) => {
		if (!props.isMain) {
			if (index > 1) {
				item.isNotRenderShow = init ? !isToggle.value : isToggle.value;
			}
		} else {
			if (!item.isMain) {
				item.isNotRenderShow = init ? !isToggle.value : isToggle.value;
			}
		}
	});

	if (!init) {
		storesPageSetting.setPageSearchCollapse(!isToggle.value, pagename.value);
	}
};

/**
 * @description 筛选表单
 * @param {Boolean} isToggle 是否触发筛选回调 区分带条件的导出
 */
async function handleFormSubmit(isToggle: boolean = true) {
	const data: any = U.doEmptyObject(U.clone(form.formData));
	return await ruleFormRef.value.validate(async (valid: boolean, fields: any) => {
		if (valid) {
			// 删除日期区间
			if (data.dates) delete data.dates;
			if (data.daterange) delete data.daterange;

			emit('submit', data, isToggle);
		} else {
			if (!!fields) {
				const errMsg = Object.values(fields as EmptyObjectType)[0][0].message;
				jBox.error(errMsg);
			}
		}
	});
}

// 清空
function handleFormReset() {
	// 如果有规则 不清空带规则的字段
	if (!U.isObjectEmpty(props.rules)) {
		for (let key in form.formData) {
			if (!Object.keys(props.rules).includes(key)) {
				form.formData[key] = U.emptyData(form.formData[key]);
			}
		}
	} else {
		U.emptyData(form.formData);
	}

	if (props.isRefreshFunction) {
		handleFormSubmit();
	}

	emit('cancel');
}

watch(
	route,
	(r) => {
		pagename.value = (r.meta.title || `page_${U.uuid(5)}`) as string;
	},
	{ immediate: true, deep: true }
);

onAjaxInitData(async () => {
	// 是否展开搜索项
	if (props.isUseToggle) {
		await storesPageSetting.getPageSearchCollapse(pagename.value);
		useToggleSearch(true);
	}

	// 缓存之后需要条件处理数据
	if (props.isKeepaliveRefresh) {
		if (!U.isObjectItemEmpty(form.formData)) {
			handleFormSubmit();
		} else {
			const data: any = U.doEmptyObject(U.clone(form.formData));
			// 删除日期区间
			if (data.dates) delete data.dates;
			if (data.daterange) delete data.daterange;

			emit('submit', data);
		}
	}
});

defineExpose({ handleFormSubmit, formData: form.formData });
</script>
