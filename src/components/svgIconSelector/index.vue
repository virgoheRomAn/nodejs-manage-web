<template>
	<div class="icon-selector w100 h100">
		<el-input
			v-model="state.fontIconSearch"
			:placeholder="state.fontIconPlaceholder"
			:clearable="clearable"
			:disabled="disabled"
			:size="size"
			ref="inputWidthRef"
			@clear="onClearFontIcon"
			@focus="onIconFocus"
			@blur="onIconBlur"
		>
			<template #prepend>
				<SvgIcon
					:name="state.fontIconPrefix === '' ? prepend : state.fontIconPrefix"
					class="font14"
					v-if="state.fontIconPrefix === '' ? prepend?.indexOf('ele-') > -1 : state.fontIconPrefix?.indexOf('ele-') > -1"
				/>
				<i v-else :class="state.fontIconPrefix === '' ? prepend : state.fontIconPrefix" class="font14"></i>
			</template>
		</el-input>
		<el-popover
			placement="bottom"
			:width="state.fontIconWidth"
			transition="el-zoom-in-top"
			popper-class="icon-selector-popper"
			trigger="click"
			:visible="visible"
			:virtual-ref="inputWidthRef"
			virtual-triggering
		>
			<template #default>
				<div class="icon-selector-warp">
					<div class="icon-selector-warp-title">{{ title }}</div>
					<el-tabs v-model="state.fontIconTabActive" @tab-click="onIconClick">
						<el-tab-pane lazy label="ali" name="ali">
							<SvgIconList :list="fontIconSheetsFilterList" :empty="emptyDescription" :prefix="state.fontIconPrefix" @getIcon="onColClick" />
						</el-tab-pane>
						<el-tab-pane lazy label="ele" name="ele">
							<SvgIconList :list="fontIconSheetsFilterList" :empty="emptyDescription" :prefix="state.fontIconPrefix" @getIcon="onColClick" />
						</el-tab-pane>
						<el-tab-pane lazy label="awe" name="awe">
							<SvgIconList :list="fontIconSheetsFilterList" :empty="emptyDescription" :prefix="state.fontIconPrefix" @getIcon="onColClick" />
						</el-tab-pane>
					</el-tabs>
				</div>
			</template>
		</el-popover>
	</div>
</template>

<script setup lang="ts" name="svgIconSelector">
import type { TabsPaneContext } from 'element-plus';
import initIconfont from '/@/hooks/useIconFont';

// 定义父组件传过来的值
const props = defineProps({
	// 输入框前置内容
	prepend: { type: String, default: () => 'ele-Pointer' },
	// 输入框占位文本
	placeholder: { type: String, default: () => '请输入内容搜索图标或者选择图标' },
	// 输入框占位文本
	size: { type: String, default: () => 'default' },
	// 弹窗标题
	title: { type: String, default: () => '请选择图标' },
	// 禁用
	disabled: { type: Boolean, default: () => false },
	// 是否可清空
	clearable: { type: Boolean, default: () => true },
	// 自定义空状态描述文字
	emptyDescription: { type: String, default: () => '无相关图标' },
	// 双向绑定值，默认为 modelValue，
	modelValue: String
});

const emit = defineEmits(['update:modelValue', 'get', 'clear']);

// 定义变量内容
const inputWidthRef = ref();
const visible = ref(false);
const state = reactive({
	fontIconPrefix: '',
	fontIconWidth: 0,
	fontIconSearch: '',
	fontIconPlaceholder: '',
	fontIconTabActive: 'ali',
	fontIconList: {
		ali: [],
		ele: [],
		awe: []
	}
});

// 处理 input 获取焦点时，modelValue 有值时，改变 input 的 placeholder 值
const onIconFocus = () => {
	getInputWidth();
	nextTick(() => {
		visible.value = true;
	});

	if (!props.modelValue) return false;
	state.fontIconSearch = '';
	state.fontIconPlaceholder = props.modelValue;
};

// 处理 input 失去焦点时，为空将清空 input 值，为点击选中图标时，将取原先值
const onIconBlur = () => {
	const list = fontIconTabNameList();
	setTimeout(() => {
		const icon = list.filter((icon: string) => icon === state.fontIconSearch);
		if (icon.length <= 0) state.fontIconSearch = '';
		visible.value = false;
	}, 300);
};

// 图标搜索及图标数据显示
const fontIconSheetsFilterList = computed(() => {
	const list = fontIconTabNameList();
	if (!state.fontIconSearch) return list;
	let search = state.fontIconSearch.trim().toLowerCase();
	return list.filter((item: string) => item.toLowerCase().indexOf(search) !== -1);
});

// 根据 tab name 类型设置图标
const fontIconTabNameList = () => {
	let iconList: any = [];
	if (state.fontIconTabActive === 'ali') iconList = state.fontIconList.ali;
	else if (state.fontIconTabActive === 'ele') iconList = state.fontIconList.ele;
	else if (state.fontIconTabActive === 'awe') iconList = state.fontIconList.awe;
	return iconList;
};

// 处理 icon 双向绑定数值回显
const initModeValueEcho = () => {
	if (props.modelValue === '' || props.modelValue === undefined) return (state.fontIconPlaceholder = props.placeholder);
	state.fontIconPlaceholder = props.modelValue || '';
	state.fontIconPrefix = props.modelValue || '';
};

// 处理 icon 类型，用于回显时，tab 高亮与初始化数据
const initFontIconName = () => {
	let name = 'ele';
	if (props.modelValue !== undefined) {
		if (props.modelValue!.indexOf('iconfont') > -1) name = 'ali';
		else if (props.modelValue!.indexOf('ele-') > -1) name = 'ele';
		else if (props.modelValue!.indexOf('fa') > -1) name = 'awe';
	}
	// 初始化 tab 高亮回显
	state.fontIconTabActive = name;
	return name;
};

// 初始化数据
const initFontIconData = async (name: string) => {
	if (name === 'ali') {
		// 阿里字体图标使用 `iconfont xxx`
		if (state.fontIconList.ali.length > 0) return;
		await initIconfont.ali().then((res: any) => {
			state.fontIconList.ali = res.map((i: string) => `iconfont ${i}`);
		});
	} else if (name === 'ele') {
		// element plus 图标
		if (state.fontIconList.ele.length > 0) return;
		await initIconfont.ele().then((res: any) => {
			state.fontIconList.ele = res;
		});
	} else if (name === 'awe') {
		// fontawesome字体图标使用 `fa xxx`
		if (state.fontIconList.awe.length > 0) return;
		await initIconfont.awe().then((res: any) => {
			state.fontIconList.awe = res.map((i: string) => `fa ${i}`);
		});
	}
	// 初始化 input 的 placeholder
	state.fontIconPlaceholder = props.placeholder;
	// 初始化双向绑定回显
	initModeValueEcho();
};

// 图标点击切换
const onIconClick = (pane: TabsPaneContext) => {
	initFontIconData(pane.paneName as string);
};

// 获取当前点击的 icon 图标
const onColClick = (v: string) => {
	state.fontIconPlaceholder = v;
	state.fontIconPrefix = v;
	visible.value = false;

	nextTick(() => {
		inputWidthRef.value.blur();
	});
	emit('get', state.fontIconPrefix);
	emit('update:modelValue', state.fontIconPrefix);
};

// 清空当前点击的 icon 图标
const onClearFontIcon = () => {
	state.fontIconPrefix = '';
	visible.value = false;
	emit('clear', state.fontIconPrefix);
	emit('update:modelValue', state.fontIconPrefix);
};

// 获取 input 的宽度
const getInputWidth = () => {
	nextTick(() => {
		state.fontIconWidth = inputWidthRef.value.$el.offsetWidth;
	});
};

// 监听页面宽度改变
const initResize = () => {
	window.addEventListener('resize', () => {
		getInputWidth();
	});
};

// 页面加载时
onMounted(() => {
	initFontIconData(initFontIconName());
	initResize();
	getInputWidth();
});

// 监听双向绑定 modelValue 的变化
watch(
	() => props.modelValue,
	() => {
		initModeValueEcho();
		initFontIconName();
	}
);
</script>
