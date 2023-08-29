<template>
	<div
		class="form-card-box--item"
		:class="[rItem.cls, { column: rItem.column, block: rItem.block, upload: rItem.upload, top: rItem.top, full: rItem.full, tree: rItem.tree }]"
		v-if="!rItem.isNotRenderShow"
	>
		<el-form-item class="form-item-box" :label="formLabel" :label-width="formLabelWidth" :prop="prop" :rules="rules">
			<FormFieldsRender
				ref="formFieldsRenderRef"
				:editor="isView ? false : rItem.editor"
				:current="rItem"
				:parent="rParent"
				:formKey="rKey"
				:formData="formData"
				v-bind="$attrs"
			/>
		</el-form-item>
	</div>
</template>
<script setup lang="ts" name="vhmFormFieldsLayoutItem">
const props = defineProps({
	// 是否是只读
	isView: { type: Boolean, default: false },
	// 渲染项的 key
	rKey: { type: String, default: '' },
	// 渲染项
	rItem: { type: Object as PropType<EmptyObjectType>, default: null },
	// 渲染项的父辈
	rParent: { type: Object as PropType<EmptyObjectType>, default: null },
	// 表单项的 规则字段属性
	ruleProp: { type: String, default: '' },
	// 表单项的 规则验证
	ruleObject: { type: Object as PropType<EmptyObjectType>, default: null },
	// 数据对象
	formData: { type: Object as PropType<EmptyObjectType>, default: null }
});

const formFieldsRenderRef = ref<RefType>();
const formLabel = computed(() => (props.rItem.key ? `${props.rItem.key}：` : ''));
const formLabelWidth = computed(() => props.rItem.width || props.rParent.width);
const prop = computed(() => (props.isView ? '' : props.ruleProp));
const rules = computed(() => (props.isView ? {} : props.ruleObject));

// 导出
defineExpose({ formFieldsRenderRef });
</script>
