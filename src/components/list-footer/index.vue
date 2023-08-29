<template>
	<div class="vhm-footer-pagination" :class="[{ 'has-background': isBackground, inline: inline }, position]">
		<el-pagination
			background
			:class="position"
			:current-page="pages.page"
			:page-size="pages.size"
			:page-sizes="[10, 20, 30, 40]"
			:total="pages.total"
			:layout="layout"
			small
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
		>
		</el-pagination>
	</div>
</template>
<script setup lang="ts" name="vhmListFooter">
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';

const props = defineProps({
	// 内联式
	inline: { type: Boolean, default: false },
	// 位置
	position: { type: String, default: 'flex-center' },
	// 当前标识
	formKey: { type: String, default: '' },
	// 当前关联的对象
	current: { type: Object, default: null },
	// 是否有背景
	isBackground: { type: Boolean, default: true },
	// pagination 布局
	layout: { type: String, default: 'total, sizes, prev, pager, next, jumper' },
	// 分页数据
	pages: {
		type: Object,
		default: () => ({
			page: 1,
			size: 20,
			total: 0
		})
	}
});

const emit = defineEmits(['change']);

// 更改分页页数
function handleSizeChange(val: any) {
	emit('change', { ...props.pages, size: val }, props.current, props.formKey);
}

// 更改每页条数
function handleCurrentChange(val: any) {
	emit('change', { ...props.pages, page: val }, props.current, props.formKey);
}
</script>
<style lang="scss" scoped>
.vhm-footer-pagination {
	&.inline {
		display: flex;
		width: 100%;
		flex-direction: column;
		justify-content: center;
	}

	&.right {
		align-items: flex-end;
	}

	&.left {
		align-items: flex-start;
	}

	&.has-background {
		.el-pagination.is-background {
			.btn-next,
			.btn-prev {
				background-color: var(--el-color-white);
			}

			.el-pager {
				li {
					background-color: var(--el-color-white);

					&.active {
						background-color: var(--el-color-primary);
					}
				}
			}
		}
	}
}
</style>
