<template>
	<el-table
		v-loading="loading"
		:data="list"
		:row-key="rowKey"
		:border="isBorder"
		:stripe="isStripe"
		:span-method="mergeCallFun"
		:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
		:default-expand-all="isExpand"
		:expand-row-keys="expandRowKeys"
		:show-summary="isSummary"
		:indent="21"
		style="width: 100%"
		@current-change="handleCurrentChange"
		@selection-change="handleSelectionChange"
	>
		<template v-for="(item, key, index) in showFields" :key="key">
			<!-- 显示不隐藏的 -->
			<template v-if="!item.isNotRenderShow">
				<!-- 复选 -->
				<template v-if="item.type === 'selection'">
					<el-table-column align="center" type="selection" reserve-selection :selectable="item.selectable" width="50" fixed />
				</template>

				<!-- 序号 -->
				<template v-else-if="item.type === 'serialNo'">
					<el-table-column align="center" type="index" label="序号" width="60" fixed />
				</template>

				<!-- 展示序号 -->
				<template v-else-if="key === 'no'">
					<el-table-column
						:label="item.key"
						:width="item.width"
						:show-overflow-tooltip="item.showTooltips !== undefined ? item.showTooltips : showTooltips"
						:fixed="item.fixed"
						align="center"
					>
						<template #default="scope">{{ scope.$index + 1 }}</template>
					</el-table-column>
				</template>

				<!-- 需要展示图标 -->
				<template v-else-if="item.hasIcon">
					<el-table-column
						:label="item.key"
						:width="item.width"
						:show-overflow-tooltip="item.showTooltips !== undefined ? item.showTooltips : showTooltips"
						:fixed="item.fixed"
						align="left"
					>
						<template #default="scope">
							<SvgIcon :name="scope.row.icon" />
							{{ scope.row[key] }}
						</template>
					</el-table-column>
				</template>

				<!-- 需要展示 Tag -->
				<template v-else-if="item.isTag">
					<el-table-column
						:label="item.key"
						:width="item.width"
						:show-overflow-tooltip="item.showTooltips !== undefined ? item.showTooltips : showTooltips"
						:fixed="item.fixed"
						align="left"
					>
						<template #default="scope">
							<el-tag :type="item.status || `success`">{{ scope.row[key] }}</el-tag>
						</template>
					</el-table-column>
				</template>

				<!-- 有值展示默认值 -->
				<template v-else-if="item.defaultVal">
					<el-table-column
						:label="item.key"
						:width="item.width"
						align="center"
						:show-overflow-tooltip="item.showTooltips !== undefined ? item.showTooltips : showTooltips"
						:fixed="item.fixed"
					>
						<template #default="scope">{{ scope.row[key].value || scope.row[key].defaultVal || scope.row[key] }}</template>
					</el-table-column>
				</template>

				<!-- 链接详情 -->
				<template v-else-if="item.link">
					<el-table-column
						:label="item.key"
						:width="item.width"
						:show-overflow-tooltip="item.showTooltips !== undefined ? item.showTooltips : showTooltips"
						:fixed="item.fixed"
						align="center"
					>
						<template #default="scope">
							<el-link type="primary" @click="gotoDetails(scope.row[key], scope.row, scope, item)">{{ scope.row[key] }}</el-link>
						</template>
					</el-table-column>
				</template>

				<!-- 格式化钱币 -->
				<template v-else-if="item.moneyFormat">
					<el-table-column
						:label="item.key"
						:width="item.width"
						:show-overflow-tooltip="item.showTooltips !== undefined ? item.showTooltips : showTooltips"
						:fixed="item.fixed"
						:prop="key"
						align="center"
					>
						<template #default="scope">{{ moneyFormat(scope.row[key], item.moneyFormat) }}</template>
					</el-table-column>
				</template>

				<!-- 需要计算的字段 -->
				<template v-else-if="item.showCount">
					<el-table-column
						:label="item.key"
						:width="item.width"
						:show-overflow-tooltip="item.showTooltips !== undefined ? item.showTooltips : showTooltips"
						:fixed="item.fixed"
						:prop="key"
						align="center"
					>
						<template #default="scope">{{ count(scope.row[key], item.showCount) }}</template>
					</el-table-column>
				</template>

				<!-- 含有计算公式的字段 [同时该字段的值是 判断是否需要计算的依据] -->
				<template v-else-if="item.formula">
					<el-table-column
						:label="item.key"
						:width="item.width"
						:show-overflow-tooltip="item.showTooltips !== undefined ? item.showTooltips : showTooltips"
						:fixed="item.fixed"
						:prop="key"
						align="center"
					>
						<template #default="scope">
							{{ scope.row[key] === '1' ? count(scope.row[item.formula.dataField], item.formula) : scope.row[item.formula.dataField]
							}}{{ item.formula.suffix }}
						</template>
					</el-table-column>
				</template>

				<!-- 时间戳 -->
				<template v-else-if="item.timestamp">
					<el-table-column
						:label="item.key"
						:width="item.width"
						:show-overflow-tooltip="item.showTooltips !== undefined ? item.showTooltips : showTooltips"
						:fixed="item.fixed"
						align="center"
					>
						<template #default="scope">{{ time(scope.row[key], item.timeFormat) }}</template>
					</el-table-column>
				</template>

				<!-- 时间范围 -->
				<template v-else-if="item.timerange">
					<el-table-column
						:label="item.key"
						:key="key"
						:width="item.width"
						:show-overflow-tooltip="item.showTooltips !== undefined ? item.showTooltips : showTooltips"
						:fixed="item.fixed"
						align="center"
					>
						<template #default="scope">
							<template v-if="scope.row[item.rangeField[0]] !== scope.row[item.rangeField[1]]">
								{{
									`${time(scope.row[item.rangeField[0]], item.timeFormat)} ${item.rangeSplit} ${time(scope.row[item.rangeField[1]], item.timeFormat)}`
								}}
							</template>

							<template v-else>
								{{ time(scope.row[item.rangeField[0]], item.timeFormat) }}
							</template>
						</template>
					</el-table-column>
				</template>

				<!-- 数据字典 -->
				<template v-else-if="item.convert">
					<el-table-column
						:label="item.key"
						:width="item.width"
						:show-overflow-tooltip="item.showTooltips !== undefined ? item.showTooltips : showTooltips"
						:fixed="item.fixed"
						align="center"
					>
						<template #default="scope">
							<!-- 带有tag -->
							<template v-if="item.tag">
								<el-tag :type="dict(scope.row[key], item.convert, 'code', 'tag')" v-if="scope.row[key]">
									{{ dict(scope.row[key], item.convert) }}
								</el-tag>
								<span v-if="item.extend">{{ `（${scope.row[item.extend]}）` }}</span>
							</template>

							<template v-else>
								{{ dict(scope.row[key], item.convert) }}
								<span v-if="item.extend">{{ `（${scope.row[item.extend]}）` }}</span>
							</template>
						</template>
					</el-table-column>
				</template>

				<!-- 匹配数据字典中值的范围 -->
				<template v-else-if="item.convertRange">
					<el-table-column
						:label="item.key"
						:width="item.width"
						:show-overflow-tooltip="item.showTooltips !== undefined ? item.showTooltips : showTooltips"
						:fixed="item.fixed"
						align="center"
					>
						<template #default="scope">
							{{ dictValueRange(scope.row[key], item.convertRange) }}
							<span v-if="item.extend">{{ `（${scope.row[item.extend]}）` }}</span>
						</template>
					</el-table-column>
				</template>

				<!-- 布尔类型 -->
				<template v-else-if="item.isBoolean">
					<el-table-column
						:label="item.key"
						:width="item.width"
						:show-overflow-tooltip="item.showTooltips !== undefined ? item.showTooltips : showTooltips"
						:fixed="item.fixed"
						align="center"
					>
						<template #default="scope">{{ item.isBoolean[scope.row[key]] }}</template>
					</el-table-column>
				</template>

				<!-- 带有后缀 -->
				<template v-else-if="item.suffix">
					<el-table-column
						:label="item.key"
						:width="item.width"
						:show-overflow-tooltip="item.showTooltips !== undefined ? item.showTooltips : showTooltips"
						:fixed="item.fixed"
						align="center"
					>
						<template #default="scope">{{ scope.row[key] }}{{ scope.row[key] ? item.suffix : '' }}</template>
					</el-table-column>
				</template>

				<!-- 内容是HTML -->
				<template v-else-if="item.isHtml">
					<el-table-column
						:label="item.key"
						:width="item.width"
						:show-overflow-tooltip="item.showTooltips !== undefined ? item.showTooltips : showTooltips"
						:fixed="item.fixed"
						align="center"
					>
						<template #default="scope">
							<div class="html" v-html="scope.row[key]"></div>
						</template>
					</el-table-column>
				</template>

				<!-- 加密数据 -->
				<template v-else-if="item.AES">
					<el-table-column
						:label="item.key"
						:width="item.width"
						:show-overflow-tooltip="item.showTooltips !== undefined ? item.showTooltips : showTooltips"
						:fixed="item.fixed"
						align="center"
					>
						<template #default="scope">
							<el-tooltip effect="dark" trigger="click" :content="decrypt(key, scope.row)" placement="bottom" v-if="scope.row[key]">
								<label class="flex-center">
									<span>{{ scope.row[key] }}</span>
									<SvgIcon class="ml8 color-green cursor-pointer" name="ele-View" />
								</label>
							</el-tooltip>
						</template>
					</el-table-column>
				</template>

				<!-- 操作 -->
				<template v-else-if="item.buttons">
					<el-table-column :label="item.key" :width="item.width" :fixed="item.fixed" align="center">
						<template #default="scope">
							<div class="el-table-button-item" :class="item.column ? `column` : ``">
								<template v-for="(x, index) in item.buttons" :key="index">
									<template v-if="!x.isNotRenderShow">
										<!-- 显示隐藏按钮 [statusFields 读取列表中的状态字段] -->
										<template v-if="!!item.statusFields">
											<!-- 单独的某个按钮判断的字段 -->
											<template v-if="x.aloneStatusField">
												<template v-if="scope.row[x.aloneStatusField] === x.aloneStatusValue">
													<el-button
														:size="x.size || `default`"
														:type="x.type"
														:plain="x.plain"
														:round="x.round"
														:icon="x.icon"
														:text="x.isText === undefined ? true : x.isText"
														@click="handler(x.emit, scope.row[key], scope.row, scope, item, x)"
													>
														<span>{{ x.text }}</span>
													</el-button>
												</template>
											</template>

											<!-- 满足对象列表里面的key和value相等 -->
											<template v-else-if="x.objectStatusField">
												<template v-if="U.isUniteObjectByChild(scope.row, x.objectStatusField)">
													<el-button
														:size="x.size || `default`"
														:type="x.type"
														:plain="x.plain"
														:round="x.round"
														:icon="x.icon"
														:text="x.isText === undefined ? true : x.isText"
														@click="handler(x.emit, scope.row[key], scope.row, scope, item, x)"
													>
														<span>{{ x.text }}</span>
													</el-button>
												</template>
											</template>

											<!-- 其他的按钮判断逻辑 -->
											<template v-else>
												<!-- 读取前置条件对比 [precondition] -->
												<template v-if="x.precondition">
													<!-- 存在 includeStatus -->
													<template
														v-if="
															x.includeStatus &&
															x.includeStatus.includes(scope.row[item.statusFields]) &&
															x.precondition.includes(scope.row[item.preconditionFields])
														"
													>
														<el-button
															:size="x.size || `default`"
															:type="x.type"
															:plain="x.plain"
															:round="x.round"
															:icon="x.icon"
															:text="x.isText === undefined ? true : x.isText"
															@click="handler(x.emit, scope.row[key], scope.row, scope, item, x)"
														>
															<span>{{ x.text }}</span>
														</el-button>
													</template>

													<!-- 存在 excludeStatus -->
													<template
														v-if="
															x.excludeStatus &&
															!(x.excludeStatus.includes(scope.row[item.statusFields]) && x.precondition.includes(scope.row[item.preconditionFields]))
														"
													>
														<el-button
															:size="x.size || `default`"
															:type="x.type"
															:plain="x.plain"
															:round="x.round"
															:icon="x.icon"
															:text="x.isText === undefined ? true : x.isText"
															@click="handler(x.emit, scope.row[key], scope.row, scope, item, x)"
														>
															<span>{{ x.text }}</span>
														</el-button>
													</template>
												</template>

												<!-- 显示包含字段状态 数据中的值为数组 [includeStatusValue 包含字段] -->
												<template v-if="x.includeStatusValue">
													<template v-if="scope.row[item.statusFields].includes(x.includeStatusValue)">
														<el-button
															:size="x.size || `default`"
															:type="x.type"
															:plain="x.plain"
															:round="x.round"
															:icon="x.icon"
															:text="x.isText === undefined ? true : x.isText"
															@click="handler(x.emit, scope.row[key], scope.row, scope, item, x)"
														>
															<span>{{ x.text }}</span>
														</el-button>
													</template>
												</template>

												<!-- 显示包含状态 [includeStatus 包含列表] -->
												<template v-if="x.includeStatus">
													<template v-if="x.includeStatus.includes(scope.row[item.statusFields])">
														<el-button
															:size="x.size || `default`"
															:type="x.type"
															:plain="x.plain"
															:round="x.round"
															:icon="x.icon"
															:text="x.isText === undefined ? true : x.isText"
															@click="handler(x.emit, scope.row[key], scope.row, scope, item, x)"
														>
															<span>{{ x.text }}</span>
														</el-button>
													</template>
												</template>

												<!-- 隐藏不包含状态 [excludeStatus 排除列表] -->
												<template v-else-if="x.excludeStatus">
													<template v-if="!x.excludeStatus.includes(scope.row[item.statusFields])">
														<el-button
															:size="x.size || `default`"
															:type="x.type"
															:plain="x.plain"
															:round="x.round"
															:icon="x.icon"
															:text="x.isText === undefined ? true : x.isText"
															@click="handler(x.emit, scope.row[key], scope.row, scope, item, x)"
														>
															<span>{{ x.text }}</span>
														</el-button>
													</template>
												</template>

												<!-- 根据状态是否禁用按钮 [disabledStatus 禁用状态列表] -->
												<template v-else-if="x.disabledStatus">
													<el-button
														:size="x.size || `default`"
														:type="x.type"
														:plain="x.plain"
														:round="x.round"
														:icon="x.icon"
														:disabled="item.disabled || x.disabled || x.disabledStatus.includes(scope.row[item.statusFields])"
														:text="x.isText === undefined ? true : x.isText"
														@click="handler(x.emit, scope.row[key], scope.row, scope, item, x)"
													>
														<span>{{ x.text }}</span>
													</el-button>
												</template>

												<!-- 一直展示 -->
												<template v-else-if="x.isAlways">
													<el-button
														:size="x.size || `default`"
														:type="x.type"
														:plain="x.plain"
														:round="x.round"
														:icon="x.icon"
														:disabled="item.disabled || x.disabled"
														:text="x.isText === undefined ? true : x.isText"
														@click="handler(x.emit, scope.row[key], scope.row, scope, item, x)"
													>
														<span>{{ x.text }}</span>
													</el-button>
												</template>

												<!-- 一直不展示 -->
												<template v-else-if="x.isNoneShow">
													<el-button
														:size="x.size || `default`"
														:type="x.type"
														:plain="x.plain"
														:round="x.round"
														:icon="x.icon"
														:disabled="item.disabled || x.disabled"
														:text="x.isText === undefined ? true : x.isText"
														@click="handler(x.emit, scope.row[key], scope.row, scope, item, x)"
														v-if="!x.isNoneShow"
													>
														<span>{{ x.text }}</span>
													</el-button>
												</template>
											</template>
										</template>

										<!-- 没有状态 -->
										<template v-else>
											<el-button
												v-if="!x.hidden"
												:size="x.size || `default`"
												:type="x.type"
												:plain="x.plain"
												:round="x.round"
												:icon="x.icon"
												:disabled="false"
												:text="x.isText === undefined ? true : x.isText"
												@click="handler(x.emit, scope.row[key], scope.row, scope, item, x)"
											>
												<span>{{ x.text }}</span>
											</el-button>
										</template>
									</template>
								</template>
							</div>
						</template>
					</el-table-column>
				</template>

				<!-- 文本需要替换 -->
				<template v-else-if="item.replace">
					<el-table-column
						:label="item.key"
						:width="item.width"
						:show-overflow-tooltip="item.showTooltips !== undefined ? item.showTooltips : showTooltips"
						:fixed="item.fixed"
						align="center"
					>
						<template #default="scope">{{ replace(scope.row[key], item) }}</template>
					</el-table-column>
				</template>

				<template v-else>
					<el-table-column
						:label="item.key"
						:width="item.width"
						:show-overflow-tooltip="item.showTooltips !== undefined ? item.showTooltips : showTooltips"
						:fixed="item.fixed"
						:prop="key"
						align="center"
					>
						<template #default="scope">{{ scope.row[key] }}</template>
					</el-table-column>
				</template>
			</template>
		</template>
	</el-table>
</template>
<script setup lang="ts" name="vhmListTable">
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { cryptoAES } from '/@/plugins/storage/crypto';

const props = defineProps({
	// 加载
	loading: { type: Boolean, default: false },
	// 表格合并方法
	mergeCallFun: { type: Function, default: null },
	// 是否多余展示省略号
	showTooltips: { type: Boolean, default: true },
	// 表单字段的 Key
	formKey: { type: String, default: '' },
	// 传入的数据
	data: { type: null, default: null },
	// form
	form: { type: null, default: null },
	// 渲染字段
	showFields: { type: Object as PropType<EmptyDataType>, default: null }
});

const emit = defineEmits(['details', 'handler', 'handleCurrentChange', 'handleSelectionChange']);
const list: Ref<Array<any>> = ref([]);
const attrs = useAttrs();
const isBorder = attrs.isBorder ?? true;
const isStripe = attrs.isStripe ?? true;
const isExpand = attrs.isExpand ?? false;
const isSummary = attrs.isSummary ?? false;
const expandRowKeys = attrs.expandRowKeys ?? [];
const rowKey = attrs.rowKey ?? '';
const isSelection = computed(() => (attrs.tableConfig ? (attrs.tableConfig as EmptyObjectType).isSelection : false));
const isSerialNo = computed(() => (attrs.tableConfig ? (attrs.tableConfig as EmptyObjectType).isSerialNo : false));

watch(
	() => props.data,
	(val: EmptyDataType) => {
		if (U.isArray(val)) {
			list.value = val.slice();
		} else if (U.isObject(val) && !!val.list) {
			list.value = val.list.slice();
		}
	},
	{ immediate: true, deep: true }
);

// 缩略图的显示
function show(rows: EmptyObjectType) {
	rows.showHandler = true;
}

// 缩略图的关闭
function hide(rows: EmptyObjectType) {
	rows.showHandler = false;
}

// 格式化金钱格式
function moneyFormat(data: string | number, method: EmptyObjectType) {
	return data !== null && data !== undefined ? U.moneyFormat(data, method.tofixed ?? 2) : '';
}

// 计算结果
function count(data: string | number, method: EmptyObjectType) {
	return data ? U.moneyFormat(U.count[method.t](data, method.n), method.tofixed) : '0.00';
}

// 时间格式
function time(data: string | number | Date, format: string) {
	if (format && format.indexOf('-') < 0) {
		format = format === 'date' ? '{y}-{m}-{d}' : format === 'dateStr' ? '{y}年{m}月{d}日' : '{y}-{m}-{d} {h}:{i}:{s}';
	}

	return data ? U.formatDatetime(data, format) : '';
}

// 数据字段
function dict(data: string | number | boolean, dict: Array<any>, fields: string = 'code', rFields: string = 'text') {
	return U.getArrayValueById(data, dict, fields, rFields);
}

// 数据值中范围匹配字段
function dictValueRange(data: string | number, dict: Array<any>, fields: string = 'value', rFields: string = 'text') {
	const range = dict.map((x) => x.value);
	return dict[range.findIndex((x) => x[0] < data && data <= x[1])][rFields];
}

// 替换
function replace(data: string, item: { replace: string | RegExp; result: string }) {
	return data.replace(item.replace, item.result || '');
}

// 显示解密内容
function decrypt(key: string, data: EmptyObjectType) {
	if (data[`encrypt_${key}`]) {
		return cryptoAES.decrypt(data[`encrypt_${key}`]);
	} else {
		return data[key];
	}
}

/**
 * @description 表格单选
 * @param {Object} currentRow 选择的行
 * @param {Object} oldCurrentRow 行
 */
function handleCurrentChange(currentRow: any, oldCurrentRow: any) {
	emit('handleCurrentChange', currentRow, oldCurrentRow);
}

/**
 * @description 表格选择
 * @param {Object} val 选择的行
 */
function handleSelectionChange(val: any) {
	emit('handleSelectionChange', val);
}

/**
 * @description 查看详情
 * @param {Object} data 当前字段的值
 * @param {Object} rows 当前列
 * @param {Object} scope 当前行列
 * @param {Object} item 当前项
 */
function gotoDetails(data: any, rows: EmptyObjectType, scope: EmptyObjectType, item: EmptyObjectType) {
	emit('handler', 'details', data, rows, null, scope, item, list.value);
}

/**
 * @description 按钮操作
 * @param {String} emitname 事件绑定名字
 * @param {String} data 当前字段的值
 * @param {Object} rows 当前列
 * @param {Object} scope 当前行列
 * @param {Object} item 当前项
 * @param {Object} button 当前点击按钮
 */
function handler(emitname: any, data: any, rows: EmptyObjectType, scope: EmptyObjectType, item: EmptyObjectType, button: EmptyObjectType) {
	emit('handler', emitname, data, rows, button, scope, item, list.value);
}
</script>
