<template>
	<div class="form-card-box--header">
		<!-- 大列表的头部标题 -->
		<div class="title" v-if="!isChildren">
			<SvgIcon :name="rItem.icon || 'ele-Grid'" />
			<label>{{ rItem.key }}</label>
			<span>{{ rItem.tips }}</span>
		</div>

		<!-- 嵌套小列表的头部说明 有索引表示是嵌套列表 -->
		<div class="tips" v-else>
			<i v-if="rItem.icon" :class="rItem.icon"></i>
			<label v-if="rItem.name">{{ rItem.name.replace('%no%', index + 1) }}</label>
			<label v-if="rItem.key">{{ rItem.key }}</label>
		</div>

		<template v-if="!isView">
			<!-- 卡片的头部有操作按钮 -->
			<div class="handle" v-if="rItem.handleList && index === null">
				<template v-for="($button, $btnIndex) in rItem.handleList" :key="$btnIndex">
					<template v-if="!$button.isNotRenderShow">
						<el-button
							:type="$button.type || `success`"
							:icon="$button.icon || `ele-Plus`"
							circle
							@click="$button.callback && $button.callback.call($event, $button, rItem, index, data)"
							v-if="$button.isIcon"
						/>

						<el-button
							:type="$button.type || 'primary'"
							@click="$button.callback && $button.callback.call($event, $button, rItem, index, data)"
							v-else
						>
							{{ $button.text }}
						</el-button>
					</template>
				</template>
			</div>

			<!-- 针对数组项渲染 每一项的头部操作 -->
			<div class="handle" v-if="index > 0">
				<template v-for="($button, $btnIndex) in rItem.itemHandleList" :key="$btnIndex">
					<template v-if="!$button.isNotRenderShow">
						<el-button
							:type="$button.type || `danger`"
							:icon="$button.icon || `ele-Delete`"
							link
							@click="$button.callback && $button.callback.call($event, $button, rItem, index, data)"
							v-if="$button.isIcon"
						/>

						<el-button
							:type="$button.type || 'primary'"
							@click="$button.callback && $button.callback.call($event, $button, rItem, index, data)"
							v-else
						>
							{{ $button.text }}
						</el-button>
					</template>
				</template>
			</div>
		</template>
	</div>
</template>
<script setup lang="ts" name="vhmFormFieldsLayoutCardHeader">
const props = defineProps({
	// 是否是只读
	isView: { type: Boolean, default: false },
	// 是否是嵌套
	isChildren: { type: Boolean, default: false },
	// 渲染项
	rItem: { type: Object as PropType<EmptyObjectType>, default: null },
	// 当前操作按钮对用的项 索引
	index: { type: Number, default: null },
	// 当前操作按钮对用的项 数据
	data: { type: Object as PropType<EmptyObjectType>, default: null }
});
</script>
