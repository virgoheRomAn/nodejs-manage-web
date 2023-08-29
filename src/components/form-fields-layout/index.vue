<template>
	<div class="form-render-box" :class="[isView ? 'form-render-view' : 'form-render-editor', wrapperCls]">
		<!-- 渲染等级1级 单层 -->
		<template v-if="renderLevel === 1">
			<el-card class="form-card-box" :class="settingConfig.cardCls" :body-style="settingConfig.cardBodyCss" shadow="hover">
				<template #default>
					<div class="form-card-box--content" :class="settingConfig.cardContCls">
						<template v-for="(item, key, index) in showFields" :key="key">
							<template v-if="!item.isNotRenderShow">
								<!-- 空白换行 -->
								<div class="halving" v-if="item.hr"></div>

								<!-- 数据渲染 -->
								<RenderCardItem
									ref="formFieldsLayoutItemRef"
									:isView="isView"
									:rKey="key"
									:rItem="item"
									:rParent="showFields"
									:ruleProp="key"
									:formData="formData"
									v-bind="$attrs"
									v-if="!item.hr"
								/>
							</template>
						</template>

						<slot name="form-button" :showFields="showFields"></slot>
					</div>
				</template>
			</el-card>
		</template>

		<!-- 渲染等级大于1级 嵌套 -->
		<template v-if="renderLevel > 1">
			<!-- 渲染数据 -->
			<template v-for="(item, key, index) in showFields" :key="key">
				<template v-if="!item.isNotRenderShow">
					<el-card class="form-card-box" :class="settingConfig.cardCls" :body-style="settingConfig.cardBodyCss" shadow="hover">
						<template #header v-if="settingConfig.hasCardHeader">
							<RenderCardHeader :isView="item.editor === undefined ? isView : !item.editor" :rItem="item" />
						</template>

						<template #default>
							<div class="form-card-box--content" :class="settingConfig.cardContCls || item.cardContCls">
								<!-- 渲染主体[对象渲染] -->
								<template v-if="item.render === 'object'">
									<template v-for="(xs, ks, is) in item.value" :key="`${ks}_${is}`">
										<!-- 数据渲染 -->
										<template v-if="!xs.isNotRenderShow">
											<!-- 空白换行 -->
											<div class="halving" v-if="xs.hr"></div>

											<!-- 除去空白数据渲染 -->
											<template v-if="!xs.hr">
												<!-- 含有数组 -->
												<template v-if="xs.formatField">
													<!-- 数据渲染 -->
													<template v-for="(its, ids) in xs.value" :key="`its_${ids}`">
														<div class="form-card-box--card" :class="{ 'is-hidden-line': xs.isHiddenLine, 'is-width-big': xs.addHandle }">
															<template v-for="(x, k, i) in its" :key="`${k}_${i}`">
																<!-- 空白换行 -->
																<div class="halving" v-if="x.hr"></div>

																<!-- 数据渲染 -->
																<RenderCardItem
																	ref="formFieldsLayoutItemRef"
																	:isView="xs.editor === undefined ? isView : !xs.editor"
																	:rKey="k"
																	:rItem="x"
																	:rParent="xs"
																	:ruleProp="`${ks}[${ids}].${[k]}`"
																	:ruleObject="rulesData[ks] ? rulesData[ks][k] : {}"
																	:formData="formData[ks][ids]"
																	v-bind="$attrs"
																	v-if="!x.hr"
																/>
															</template>

															<!-- 渲染操作按钮 -->
															<div class="handle ml10" v-if="editor">
																<template v-if="xs.addHandle">
																	<el-button
																		type="primary"
																		@click="
																			xs.addHandle.callback && xs.addHandle.callback.call($event, xs.addHandle, xs, ids, xs.value, formData[ks][ids])
																		"
																	>
																		{{ xs.addHandle.text }}
																	</el-button>
																</template>

																<template v-if="xs.delHandle && ids > 0">
																	<el-button
																		type="danger"
																		@click="
																			xs.delHandle.callback && xs.delHandle.callback.call($event, xs.delHandle, xs, ids, xs.value, formData[ks][ids])
																		"
																	>
																		{{ xs.delHandle.text }}
																	</el-button>
																</template>
															</div>
														</div>
													</template>
												</template>

												<!-- 子集是对象 但是需要转换成模块渲染 -->
												<template v-else-if="!!xs.isNotDeep && U.isObject(xs.value) && !U.isObjectEmpty(xs.value)">
													<div class="flex-column flex-center w100 mtb20">
														<template v-for="($x, $k, $i) in xs.value" :key="`${$k}_${$i}`">
															<el-card
																class="form-card-box is-children"
																shadow="never"
																:class="settingConfig.cardCls"
																:body-style="settingConfig.cardBodyCss"
																v-if="!$x.isNotRenderShow && formData[xs.conditionField].includes($k) && !U.isObjectEmpty($x.value)"
															>
																<template #header>
																	<RenderCardHeader :isView="$x.editor === undefined ? isView : !$x.editor" :rItem="$x" isChildren />
																</template>

																<!-- 数据渲染 -->
																<template #default>
																	<template v-for="(x, k, i) in $x.value" :key="`${k}_${i}`">
																		<!-- 空白换行 -->
																		<div class="halving" v-if="x.hr"></div>

																		<!-- 数据渲染 -->
																		<RenderCardItem
																			ref="formFieldsLayoutItemRef"
																			:isView="xs.editor === undefined ? isView : !xs.editor"
																			:rKey="k"
																			:rItem="x"
																			:rParent="xs"
																			:ruleProp="`${ks}.${$k}.${[k]}`"
																			:ruleObject="rulesData[ks] ? rulesData[ks][k] : {}"
																			:formData="formData[ks][$k]"
																			v-bind="$attrs"
																			v-if="!x.hr"
																		/>
																	</template>
																</template>
															</el-card>
														</template>
													</div>
												</template>

												<!-- 标准字段 -->
												<template v-else>
													<!-- 数据渲染 -->
													<RenderCardItem
														ref="formFieldsLayoutItemRef"
														:isView="item.editor === undefined ? isView : !item.editor"
														:rKey="ks"
														:rItem="xs"
														:rParent="item"
														:ruleProp="ks"
														:formData="formData"
														v-bind="$attrs"
													/>
												</template>
											</template>
										</template>
									</template>
								</template>

								<!-- 渲染主体[数组渲染] -->
								<template v-if="item.render === 'array'">
									<div class="form-card-box--list">
										<template v-for="(its, ids) in item.value" :key="ids">
											<el-card
												class="form-card-box is-children"
												shadow="never"
												:class="settingConfig.cardCls"
												:body-style="settingConfig.cardBodyCss"
											>
												<template #header>
													<RenderCardHeader
														isChildren
														:isView="item.editor === undefined ? isView : !item.editor"
														:rItem="item"
														:index="ids"
														:data="formData[key][ids]"
													/>
												</template>

												<!-- 数据渲染 -->
												<template #default>
													<div class="form-card-box--content" :class="settingConfig.cardContCls || item.cardContCls">
														<template v-for="(x, k, i) in its" :key="`${k}_${i}`">
															<!-- 空白换行 -->
															<div class="halving" v-if="x.hr"></div>

															<!-- 数据渲染 -->
															<RenderCardItem
																ref="formFieldsLayoutItemRef"
																:isView="item.editor === undefined ? isView : !item.editor"
																:rKey="k"
																:rItem="x"
																:rParent="item"
																:ruleProp="`${key}[${ids}].${[k]}`"
																:ruleObject="rulesData[key] ? rulesData[key][k] : {}"
																:formData="formData[key][ids]"
																v-bind="$attrs"
																v-if="!x.hr"
															/>
														</template>
													</div>
												</template>
											</el-card>
										</template>
									</div>
								</template>
							</div>
						</template>
					</el-card>
				</template>
			</template>
		</template>
	</div>
</template>

<script setup lang="ts" name="vhmFormFieldsLayout">
import { CSSProperties } from 'vue';
import { U } from '/@/utils';

const props = defineProps({
	// 是否是只读区域
	isView: { type: Boolean, default: false },
	// 整体是否可以编辑
	editor: { type: Boolean, default: false },
	// 渲染级别
	renderLevel: { type: Number, default: 2 },
	// 样式名字
	wrapperCls: { type: String, default: '' },
	// 表单设置
	formSetting: {
		type: Object as PropType<{ width: string; inline: boolean; hasCardHeader: boolean; cardCls: string; cardBodyCss: CSSProperties }>,
		default: () => ({})
	},
	// 渲染字段
	showFields: { type: Object as PropType<EmptyObjectType>, default: null },
	// 数据对象
	formData: { type: Object as PropType<EmptyObjectType>, default: () => ({}) },
	// 验证规则
	rulesData: { type: Object as PropType<EmptyObjectType>, default: null }
});

// 引入组件
const RenderCardItem = defineAsyncComponent(() => import('./src/item.vue'));
const RenderCardHeader = defineAsyncComponent(() => import('./src/header.vue'));

const attrs = useAttrs();
const route = useRoute();
const formFieldsRenderRef = ref<RefType>();
const formFieldsLayoutItemRef = ref<RefType>();

const defaultConfig = {
	width: '170px',
	inline: true,
	hasCardHeader: true,
	cardCls: '',
	cardContCls: '',
	cardBodyCss: {}
};
const settingConfig = computed(() => ({ ...defaultConfig, ...props.formSetting }));

defineExpose({ formFieldsRenderRef, formFieldsLayoutItemRef });
</script>
