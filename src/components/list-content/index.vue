<template>
	<el-card class="form-card-box" :class="{ 'is-fixed-overflow': tableFixed, 'is-fixed-table-overflow': isTableInnerOverflow }" v-loading="loading">
		<template #header v-if="isTableHeader">
			<div class="form-card-box--header">
				<div class="title" v-if="data.title">
					<SvgIcon :name="data.icon || 'ele-Grid'" v-if="!data.isNotIcon" />
					<label>{{ data.title || '列表数据' }}</label>
					<span>{{ data.tips || '' }}</span>

					<el-tooltip effect="dark" :content="data.warning || `温馨提示`" placement="right" v-if="data.warning">
						<SvgIcon class="tooltip" name="ele-WarningFilled" />
					</el-tooltip>
				</div>

				<div class="handle-buttons" v-if="data.handleList">
					<template v-for="(item, index) in data.handleList" :key="index">
						<el-button
							:type="item.style || 'primary'"
							:icon="item.icon"
							@click="item.click ? item.click.call($event, item, data) : buttonHandle(item)"
							v-if="!item.isNotRenderShow"
						>
							{{ item.text }}
						</el-button>
					</template>
				</div>

				<div class="fixed-buttons">
					<div class="tool" title="刷新" @click="refreshDataList()" v-if="attrs.onRefreshFunction">
						<SvgIcon name="ele-Refresh" />
					</div>
					<div class="tool" :class="{ lock: !isCollapse }" :title="isCollapse ? `展开` : `缩略`" @click="isCollapse = !isCollapse">
						<SvgIcon name="ele-DCaret" />
					</div>
					<div class="tool" title="导出" @click="exportDataList()" v-if="exportOpts.isExport">
						<SvgIcon name="ele-Download" />
					</div>
					<div class="tool" :class="{ lock: tableFixed }" :title="!tableFixed ? `固定表格` : `取消固定`" @click="fixedTable()" v-if="showTableLock">
						<SvgIcon :name="!tableFixed ? `ele-Unlock` : `ele-Lock`" />
					</div>

					<el-popover
						placement="bottom-end"
						trigger="click"
						transition="el-zoom-in-bottom"
						popper-class="table-tool-popper"
						:width="300"
						:persistent="false"
						@show="onSetTable"
						v-if="!!isColumSetting"
					>
						<template #reference>
							<div class="tool" title="列设置"><SvgIcon name="ele-Setting" /></div>
						</template>

						<template #default>
							<div class="tool-box">
								<el-tooltip content="拖动进行排序" placement="top-start">
									<SvgIcon name="fa fa-question-circle-o" :size="17" class="ml11" color="#909399" />
								</el-tooltip>
								<el-checkbox class="ml12 mr1" label="多选" v-model="tableConfig.isSelection" />
								<el-checkbox class="ml12 mr1" label="序号" v-model="tableConfig.isSerialNo" />
								<el-checkbox class="ml12 mr1" label="表格内滚动" v-model="tableInnerOverflow" :disabled="!tableFixed" v-if="showTableLock" />
							</div>
							<el-scrollbar>
								<div ref="toolSetRef" class="tool-sortable">
									<div class="tool-sortable-item" v-for="(item, key, index) in renderFields" :key="key" :data-key="key">
										<template v-if="!item.isDisabled">
											<i class="fa fa-arrows-alt cursor-pointer"></i>
											<el-checkbox class="ml12 mr8" v-model="item.isCheck" :label="item.key" @change="onCheckChange($event, key, item)" />
										</template>
									</div>
								</div>
							</el-scrollbar>
						</template>
					</el-popover>
				</div>
			</div>
		</template>

		<template #default>
			<div class="form-card-box--content">
				<div class="list-content-box" :class="{ 'is-fixed': tableFixed }">
					<!-- 搜索区域 -->
					<template v-if="getSearch">
						<div class="search">
							<slot name="search"></slot>
						</div>
					</template>

					<!-- 有显示字段表示是列表 -->
					<div
						class="content"
						:class="{
							'is-width-auto': data.list.length === 0,
							'is-table-out-overflow': !isTableInnerOverflow,
							'is-table-inner-overflow': isTableInnerOverflow
						}"
					>
						<template v-if="showFields">
							<ListTable
								:class="{ 'is-fixed-table': tableFixed }"
								:showTooltips="isCollapse"
								:data="data"
								:showFields="renderFields"
								:height="tableHeight"
								:tableConfig="tableConfig"
								rowKey="id"
								v-bind="$attrs"
								v-on="handlerList"
							/>
						</template>

						<!-- 没有显示字段表示是自定义内容 -->
						<template v-else>
							<slot name="content" :data="data"></slot>
						</template>
					</div>

					<!-- 统计部份 -->
					<template v-if="getStatistic">
						<div class="statistic-box" v-if="!U.isObjectEmpty(data.statistic)">
							<h2>统计：</h2>
							<slot name="statistic" :statistic="data.statistic"></slot>
						</div>
					</template>

					<div class="footer" v-if="getShowFooter">
						<slot name="footer" :data="data"></slot>
					</div>
				</div>
			</div>
		</template>
	</el-card>
</template>
<script setup lang="ts" name="vhmListContent">
import Sortable from 'sortablejs';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { usePageSetting } from '/@/stores/modules/page';
import { onAjaxInitData } from '/@/hooks/useAjaxInitData';
import { exportExcelByJSON } from '/@/plugins/export/excel';

type ExportType = {
	filename: string;
	isExport: boolean;
	fields: EmptyObjectType;
	extra: EmptyObjectType;
	fn?: Fn;
};

const props = defineProps({
	// 加载
	loading: { type: Boolean, default: false },
	// 显示提示
	isTooltips: { type: Boolean, default: true },
	// 是否有头部
	isTableHeader: { type: Boolean, default: true },
	// 是否在table 内部滚动
	isTableInnerOverflow: { type: Boolean, default: true },
	// 是否展示列设置
	isColumSetting: { type: Boolean, default: true },
	// 表格是否固定滚动
	isPageTableFixed: { type: Boolean, default: true },
	// 是否显示表格锁定图标
	showTableLock: { type: Boolean, default: true },
	// 事件触发列表
	handlerList: { type: Object as PropType<EmptyObjectType>, default: () => ({}) },
	// 渲染的数据字段
	showFields: { type: Object as PropType<EmptyDataType>, default: () => ({}) },
	// 返回的接口数据
	data: { type: Object as PropType<EmptyObjectType>, default: () => ({}) },
	// 导出设置
	exportOpts: {
		type: Object as PropType<ExportType>,
		default: () => ({ filename: '', isExport: false, fields: {}, fn: null, extra: {} })
	}
});

const emit = defineEmits(['update:showFields', 'export', 'refresh', 'sortHeaderFunction', 'fixedTable', 'buttonHandler']);

const storesPageSetting = usePageSetting();

const slots = useSlots();
const attrs = useAttrs();
const route = useRoute();
const toolSetRef = ref<RefType>();
const tableHeight = ref('auto');
const pagename = ref(``);
const isCollapse = ref(props.isTooltips);
const tableConfig = reactive({
	isSelection: props.data.isSelection ?? false,
	isSerialNo: props.data.isSerialNo ?? true
});
const tableInnerOverflow = ref(true);

const tableFixed = computed(() => storesPageSetting.pageTableFixed);
const isTableInnerOverflow = computed(() => tableFixed.value && props.isTableInnerOverflow && tableInnerOverflow.value);
const getShowFooter = computed(() => !!slots.footer);
const getSearch = computed(() => !!slots.search);
const getStatistic = computed(() => !!slots.statistic);
const renderFields = computed(() => {
	const r: EmptyObjectType = {};
	for (let key in props.showFields) {
		if (tableConfig.isSelection) {
			r['selection'] = {
				key: '复选',
				type: 'selection',
				isDisabled: true,
				isNotExport: true,
				selectable: props.data.selectableFn ? props.data.selectableFn : () => true
			};
		}

		if (tableConfig.isSerialNo) {
			r['serialNo'] = { key: '序号', type: 'serialNo', isDisabled: true };
		}

		r[key] = props.showFields[key];
		r[key].isCheck = !r[key].isNotRenderShow;
	}

	return r;
});

/**
 * 列设置 - 勾选是否展示对应列选项
 */
function onCheckChange(value: string | number | boolean, key: string, item: EmptyObjectType) {
	item.isNotRenderShow = !value;
}

/**
 * 列设置 - 拖拽
 */
const onSetTable = () => {
	nextTick(() => {
		const sortable = Sortable.create(toolSetRef.value, {
			handle: '.fa-arrows-alt',
			dataIdAttr: 'data-key',
			animation: 150,
			onEnd: () => {
				const r: EmptyArrayType = [];
				const result: any = {};
				const array = sortable.toArray();

				array.forEach((val) => {
					r.push({ ...renderFields.value[val], k: val });
				});

				r.forEach((item) => {
					result[item.k] = item;
				});

				emit('update:showFields', result);
			}
		});
	});
};

/**
 * 固定表格 [通过样式固定]
 */
async function fixedTable() {
	storesPageSetting.setPageTableFixed(!tableFixed.value, pagename.value);
	emit('fixedTable', !tableFixed.value, pagename.value);
}

/**
 * 刷新列表 refresh
 */
async function refreshDataList() {
	const rs: any = await (attrs.onRefreshFunction as Fn)();
	emit('refresh', rs);
}

/**
 * @description 导出列表 excel
 * @param exportFields 需要导出的字段
 * @param exportData 需要导出的数据
 * @param fn 导出函数
 * @param filename 文件名字
 * @param extra.beforeValidateFn 前置验证函数
 */
async function exportDataList(
	exportFields: EmptyObjectType,
	exportData: any = props.data.list,
	fn: Fn = (attrs.onExportExeclAjax || props.exportOpts.fn) as Fn,
	filename: '',
	extra: EmptyObjectType = props.exportOpts.extra
) {
	// 验证导出
	if (!!extra) {
		if (!!extra.beforeValidateFn) {
			const rs = await extra.beforeValidateFn();
			if (rs === false) return;
		}
	}

	const loading = jBox.loading('导出中，请稍等...');
	exportFields = exportFields ? exportFields : !U.isObjectEmpty(props.exportOpts.fields) ? props.exportOpts.fields : renderFields.value;

	if (!!fn) {
		const rs = await fn();

		if (rs.code === 'SUCCESS') {
			exportData = rs.data;
		}
	}

	const { header, fields: filterVal } = U.formatExportLayout(exportFields) as EmptyObjectType;
	const data = U.formatExportData(exportData, filterVal, exportFields) as EmptyArrayType;

	jBox.closeById(loading);

	exportExcelByJSON({ header, data, filename: filename || props.exportOpts.filename || props.data.title || '列表数据' });
}

/**
 * 多个导出操作回调
 * @param emit 触发回调方法
 */
function buttonHandle(item: any) {
	if (item.fn) {
		exportDataList(item.exportFields, [], item.fn, item.filename, item.extra);
	}

	if (item.emit) {
		emit('buttonHandler', item.emit, props.data);
	}
}

watch(
	route,
	(r) => {
		pagename.value = (r.meta.title || `page_${U.uuid(5)}`) as string;
	},
	{ immediate: true, deep: true }
);

onAjaxInitData(() => {
	storesPageSetting.getPageTableFixed(pagename.value, props.isPageTableFixed);
});

defineExpose({ exportDataList });
</script>
<style lang="scss" scoped>
.list-content-box {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 100%;

	// 统计部份
	.statistic-box {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		width: 100%;
		margin-top: 20px;
		padding: 0 15px;

		> h2 {
			display: block;
			width: 100%;
			font-size: 14px;
			margin-bottom: 5px;
		}

		:deep(label) {
			margin: 5px 50px 5px 0;
		}
	}

	> .search {
		margin-bottom: 15px;
	}

	> .content {
		flex: 1;
	}

	> .footer {
		margin-top: 15px;
	}

	&.is-fixed {
		> .content.is-table-out-overflow {
			height: 0;
			overflow-x: hidden;
			overflow-y: scroll !important;
			transform: translate3d(0, 0, 0);
			-webkit-overflow-scrolling: touch;
		}

		> .content.is-table-inner-overflow {
			height: 0;

			> .is-fixed-table {
				height: 100% !important;
				overflow-x: auto !important;
				transform: translate3d(0, 0, 0);
				-webkit-overflow-scrolling: touch;

				:deep([class$='inner-wrapper']) {
					height: 100% !important;
				}

				:deep([class$='body-wrapper']) {
					height: 100%;
					overflow-y: auto !important;
				}
			}
		}

		> .content.is-width-auto {
			> .is-fixed-table {
				height: auto !important;
			}
		}
	}
}

// 操作列
.table-tool-popper {
	padding: 0 !important;

	.tool-box {
		display: flex;
		border-bottom: 1px solid var(--el-border-color-lighter);
		box-sizing: border-box;
		color: var(--el-text-color-primary);
		height: 40px;
		align-items: center;
	}

	.tool-sortable {
		max-height: 303px;
		.tool-sortable-item {
			display: flex;
			box-sizing: border-box;
			color: var(--el-text-color-primary);
			align-items: center;
			padding: 0 12px;
			&:hover {
				background: var(--el-fill-color-lighter);
			}
			i {
				opacity: 0.7;
			}
		}
	}
}
</style>
