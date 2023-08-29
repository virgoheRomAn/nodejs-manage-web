<template>
	<LayoutDialog ref="dialogRef" isHeaderClose editor model="waring">
		<template #header>敏感词列表</template>

		<template #render v-if="isRender">
			<ListContent isTableHeader v-model:showFields="table.showFields" :data="table" :showTableLock="false" />
		</template>
	</LayoutDialog>
</template>

<script setup lang="ts" name="SensitiveWorld">
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { queryReconciliationFailureList } from '/@/api/jfmanage/system';

const emit = defineEmits(['submit', 'update:form']);

const isRender = ref(false);
const dialogRef = ref();
const ruleFormRef = ref();

const table = reactive({
	title: '关键词信息',
	isSerialNo: true,
	isSelection: false,
	isColumSetting: true,
	list: [] as any[],

	showFields: {
		keywords: { key: '敏感词', value: '' },
		keywordsId: { key: '敏感词ID', value: '' },
		level: {
			key: '风险等级',
			value: '',
			convert: [
				{ code: 1, text: '高' },
				{ code: 2, text: '中' },
				{ code: 3, text: '低' }
			]
		},
		score: { key: '敏感度', value: '' },
		suggestion: {
			key: '建议',
			value: '',
			convert: [
				{ code: 1, text: '建议屏蔽' },
				{ code: 2, text: '建议人工复审' },
				{ code: 3, text: '建议通过' }
			]
		},
		typeId: { key: '敏感词类型Id', value: '' },
		typeName: { key: '敏感词类型', value: '' }
	}
});

// 打开弹窗
const openDialog = async (data: EmptyObjectType) => {
	table.list = data?.hitKeywordsInfoList ?? [];

	isRender.value = true;
	dialogRef.value.open();
};

// 关闭弹窗
const closeDialog = () => {
	isRender.value = false;
	dialogRef.value.close();
};

// 暴露变量
defineExpose({ openDialog, closeDialog });
</script>
