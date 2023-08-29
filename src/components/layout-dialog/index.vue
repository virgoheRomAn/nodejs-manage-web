<template>
	<Teleport to="body" v-bind="$attrs">
		<transition name="layout-dialog-container" enter-active-class="animate fadeIn" leave-active-class="animate fadeOut">
			<div class="layout-dialog-bar element-fixed" v-show="state === 1" @click.self="close()">
				<transition
					name="layout-dialog-container"
					:enter-active-class="`animate ${boxEnterAnimate}`"
					:leave-active-class="`animate ${boxLeaveAnimate}`"
				>
					<div class="layout-dialog-wrap" v-show="state === 1">
						<div class="layout-dialog-modal" v-show="isMask"></div>

						<template v-if="isClose">
							<div class="layout-dialog-close" @click="close()">
								<SvgIcon name="ele-Close" />
							</div>
						</template>

						<div
							class="layout-dialog-content"
							:class="{ 'layout-dialog-center': isCenter, 'layout-dialog-fixed': isFixed, 'layout-dialog-full': isFull }"
						>
							<!-- 嵌套 -->
							<LayoutContainer
								ref="layoutContainerRef"
								class="layout-dialog-box background"
								:class="wrapperCls"
								:style="isFixed ? { width: fixed.width, height: fixed.height } : ''"
								:scrollBarCls="uScrollBarCls"
								:headerCls="uContainerHeaderCls"
								:footerCls="uContainerFooterCls"
								isBacktop
							>
								<template #header v-if="getShowHeader">
									<div class="layout-dialog-box--header" :class="headerCls">
										<label><slot name="header"></slot></label>
										<SvgIcon name="ele-Close" @click="close()" v-if="!isClose && isHeaderClose" />
									</div>
								</template>

								<template #default>
									<div class="layout-dialog-render" :class="renderCls">
										<slot name="render"></slot>
									</div>
								</template>

								<template #footer>
									<div class="layout-dialog-box--footer center" :class="footerCls">
										<!-- confirm 模式 -->
										<template v-if="model === 'confirm'">
											<el-button @click="hide()">取消</el-button>

											<template v-if="editor">
												<el-button type="primary" @click="change()" v-if="isChange">修改</el-button>
												<el-button type="primary" @click="submit()" v-else>确定</el-button>
											</template>
										</template>

										<!-- waring 模式 -->
										<template v-else-if="model === 'waring'">
											<el-button type="primary" @click="close()">确定</el-button>
										</template>

										<!-- 自定义 模式 -->
										<template v-else-if="model === 'custom'">
											<el-button @click="close()" v-if="customModelHasClose">关闭</el-button>

											<slot name="customButtom"></slot>
										</template>

										<!-- 分页 模式 -->
										<template v-else-if="model === 'footerPaging'">
											<slot name="footerPaging"></slot>
										</template>
									</div>
								</template>
							</LayoutContainer>
						</div>
					</div>
				</transition>
			</div>
		</transition>
	</Teleport>
</template>
<script setup lang="ts" name="vhmLayoutDialog">
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';

const props = defineProps({
	// 是否编辑
	editor: { type: Boolean, default: true },
	// 模式
	model: { type: String, default: 'confirm' },
	// 自定义模式是否有关闭按钮
	customModelHasClose: { type: Boolean, default: true },
	// 进入时候的动画
	boxEnterAnimate: { type: String, default: 'slideIn' },
	// 离开时的动画
	boxLeaveAnimate: { type: String, default: 'slideOut' },
	// 是否开启遮罩
	isMask: { type: Boolean, default: true },
	// 是否是居中
	isCenter: { type: Boolean, default: true },
	// 是否是全屏
	isFull: { type: Boolean, default: false },
	// 是否固定宽高 [默认 735px * 600px]
	isFixed: { type: Boolean, default: false },
	// 是否有右上角关闭
	isClose: { type: Boolean, default: false },
	// 是否在插槽头部有关闭按钮
	isHeaderClose: { type: Boolean, default: false },
	// 是否有底部
	hasFooter: { type: Boolean, default: true },
	// 是否是修改
	isChange: { type: Boolean, default: false },
	// fixed 模式下宽高
	fixed: {
		type: Object as PropType<{ width: string; height: string }>,
		default: () => ({ width: '735px', height: '600px' })
	}
});
const emit = defineEmits(['open', 'close', 'show', 'hide', 'submit', 'change', 'beforeShow', 'beforeOpen']);
const slots = useSlots();
const attrs = useAttrs();
const state = ref(0);
const wrapperCls = computed(() => attrs?.['wrapperCls']);
const headerCls = computed(() => attrs?.['headerCls']);
const renderCls = computed(() => attrs?.['renderCls']);
const footerCls = computed(() => attrs?.['footerCls']);
const uScrollBarCls = computed(() => (attrs['uScrollBarCls'] ? `layout-dialog-scrollbar ${attrs['uScrollBarCls']}` : 'layout-dialog-scrollbar'));
const uContainerHeaderCls = computed(() => attrs?.['uContainerHeaderCls'] ?? 'flex-row flex-between ptb15 plr20');
const uContainerFooterCls = computed(() => attrs?.['uContainerFooterCls'] ?? 'transparent ptb8');
const getShowHeader = computed(() => !!slots.header);

const layoutContainerRef = ref<RefType>();
const scrollBarRef = ref<RefType>();

const show = () => {
	emit('beforeShow');

	state.value = 1;
	emit('show');
};

const hide = () => {
	state.value = 0;
	emit('hide');
};

const open = () => {
	emit('beforeOpen');

	state.value = 1;
	emit('open');
	nextTick(() => {
		layoutContainerRef.value.scrollToTop(false);
	});
};

const close = () => {
	state.value = 0;
	emit('close');
};

const submit = () => {
	emit('submit');
};

const change = () => {
	emit('change');
};

defineExpose({
	open,
	close
});
</script>
<style lang="scss" scoped>
%block {
	display: block;
	width: 100%;
	height: 100%;
}

.layout-dialog-bar {
	$main: '.layout-dialog';

	position: fixed;
	top: 0;
	left: 0;
	z-index: 1001;
	@extend %block;

	&.samll-zindex {
		z-index: 99;
	}

	#{$main}-wrap {
		position: relative;
		@extend %block;
	}

	#{$main}-modal {
		position: absolute;
		top: 0;
		left: 0;
		background: var(--next-color-black);
		opacity: 0.5;
		@extend %block;
	}

	#{$main}-close {
		position: absolute;
		top: 40px;
		right: 40px;
		z-index: 99;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;

		i {
			width: 100%;
			height: 100%;
			cursor: pointer;
			font-size: 32px !important;
			color: var(--next-color-white);
		}
	}

	#{$main}-content {
		position: relative;
		height: 100%;

		&#{$main}-center {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			margin: 0;
			padding: 0;

			#{$main}-box {
				width: 80%;
				height: 80%;
				border-radius: 5px;

				&.background {
					background: var(--next-bg-color);

					&.white {
						background: var(--next-color-white);
					}

					&.gray {
						background: var(--next-bg-color);
					}
				}

				&--header {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					width: 100%;
					color: var(--el-text-color-primary);

					> label {
						font-size: 16px;
					}

					> i {
						width: 30px;
						height: 30px;
						cursor: pointer;
						font-size: 24px !important;
						color: var(--color-text-sub);
					}
				}

				&--footer {
					display: flex;
					flex-direction: row;
					justify-content: flex-end;
					align-items: center;
					flex: 1;
					padding: 0 30px;

					&.center {
						justify-content: center;
					}
				}
			}

			#{$main}-render {
				position: relative;
				width: 100%;
			}
		}

		&#{$main}-fixed {
			#{$main}-box {
				width: 500px;
				height: 500px;

				#{$main}-render {
					position: relative;
				}
			}
		}
	}

	:deep(.layout-dialog-scrollbar) {
		& + .el-backtop {
			position: absolute;
			bottom: 20px !important;
			right: 20px !important;
		}
	}
}
</style>
