<template>
	<div class="form-render-item" :class="{ 'is-readonly': cRender.readonly, 'is-disabled': cRender.disabled }">
		<!-- 固定状态值 -->
		<template v-if="cRender.formRenderFixed">
			<template v-if="cRender.link">
				<el-link
					style="fontweight: 700"
					type="primary"
					:underline="false"
					@click="cRender.tap && cRender.tap.call(this, $event, cRender, pRender, key, form)"
				>
					{{ form[key] }}
				</el-link>
			</template>
		</template>

		<!-- 渲染表单项 -->
		<template v-else>
			<!-- 编辑 可以编辑 -->
			<template v-if="isEditor">
				<!-- 下拉选择框 -->
				<template v-if="cRender.select">
					<el-select
						class="form-item"
						:class="cRender.cls"
						v-model="form[key]"
						v-bind="cRender.config"
						:placeholder="cRender.placeholder || `请选择${cRender.key}`"
						:filterable="cRender.filterable === false ? false : true"
						:clearable="cRender.clearable === false ? false : true"
						:readonly="cRender.readonly"
						:disabled="cRender.disabled"
						@change="selectChange($event, cRender, pRender, key, form)"
					>
						<template v-for="(x, i) in cRender.select" :key="x.code">
							<el-option :label="x.text" :value="x.code" />
						</template>
					</el-select>
				</template>

				<!-- 下拉选择框组 -->
				<template v-else-if="cRender.selectGroup">
					<div class="select-group">
						<template v-for="(x, k, i) in cRender.value" :key="k">
							<div class="select-group-item">
								<span>{{ `${x.key}：` }}</span>
								<el-select
									class="form-item"
									:class="x.cls"
									v-model="form[key]"
									:placeholder="cRender.placeholder || `请选择${x.key}`"
									:readonly="x.readonly"
									:disabled="x.disabled"
									@change="x.change && x.change.call(this, $event, x, cRender, data)"
								>
									<template v-for="(m, j) in x.select" :key="m.code">
										<el-option :label="m.text" :value="m.code" />
									</template>
								</el-select>
							</div>
						</template>
					</div>
				</template>

				<!-- 远程搜索 -->
				<template v-else-if="cRender.remoteFilter">
					<el-select
						class="form-item"
						:class="cRender.cls"
						v-model="form[key]"
						filterable
						clearable
						:readonly="cRender.readonly"
						:disabled="cRender.disabled"
						:placeholder="cRender.placeholder || `请选择${cRender.key}`"
						:filter-method="cRender.remoteMethod && cRender.remoteMethod"
						@focus="cRender.focus && cRender.focus.call(this, $event, cRender, pRender, form, key)"
						@change="cRender.change && cRender.change.call(this, $event, cRender, pRender, form, key)"
					>
						<template v-for="x in cRender.remoteSelect" :key="x.code">
							<el-option :label="x.text" :value="x.code" />
						</template>
					</el-select>
				</template>

				<!-- 级联选择器 -->
				<template v-else-if="cRender.cascader">
					<el-cascader
						:ref="
							(el) => {
								if (el) cascaderRef[key] = el;
							}
						"
						class="form-item"
						:class="cRender.cls"
						v-model="form[key]"
						:collapse-tags="cRender.cascaderProps.tags"
						:collapse-tags-tooltip="cRender.cascaderProps.tagTooltip"
						:props="cRender.cascaderProps"
						:separator="cRender.cascader.separator"
						:options="cRender.cascader.data"
						:placeholder="cRender.placeholder || `请选择${cRender.key}`"
						:filterable="cRender.filterable === false ? false : true"
						:clearable="cRender.clearable === false ? false : true"
						:readonly="cRender.readonly"
						:disabled="cRender.disabled"
						@change="cascaderChange($event, key, cRender, data)"
					>
					</el-cascader>
				</template>

				<!-- 树形结构 -->
				<template v-else-if="cRender.tree">
					<el-tree
						:ref="
							(el) => {
								if (el) treeRef[key] = el;
							}
						"
						class="form-item"
						:class="cRender.cls"
						:data="cRender.data"
						:props="cRender.prorps"
						:node-key="cRender.options ? cRender.options.nodeKey || 'id' : `id`"
						:highlight-current="cRender.options ? (cRender.options.highlight === undefined ? true : false) : true"
						:default-expanded-keys="cRender.options ? cRender.options.expanded : ['01', '02', '03']"
						:default-expand-all="cRender.options ? !!cRender.options.expandedAll : false"
						:default-checked-keys="cRender.options ? cRender.options.checked || [] : []"
						:show-checkbox="cRender.options ? (cRender.options.checkbox === undefined ? true : false) : true"
						:readonly="cRender.readonly"
						:disabled="cRender.disabled"
					/>
				</template>

				<!-- range 范围输入 -->
				<template v-else-if="cRender.range">
					<div class="el-input-range">
						<template v-for="(x, k, i) in cRender.value" :key="k">
							<el-input
								class="form-item"
								:class="x.cls"
								type="text"
								v-model="form[key]"
								:placeholder="x.placeholder || `请输入${x.key}`"
								:clearable="!x.readonly"
								:readonly="x.readonly"
								:disabled="x.disabled"
								@input="x.input && x.input.call(this, $event, x, cRender, data)"
							>
								<template #suffix>
									<span class="suffix" v-if="x._suffix">{{ x._suffix }}</span>
								</template>
							</el-input>
							<span v-if="i < Object.keys(cRender.value).length - 1">至</span>
						</template>
					</div>
				</template>

				<!-- switch -->
				<template v-else-if="cRender.switch">
					<el-switch
						class="form-item"
						:class="cRender.cls"
						v-model="form[key]"
						:active-text="cRender.activeText || '是'"
						:inactive-text="cRender.inactiveText || '否'"
						:active-value="cRender.activeValue || 1"
						:inactive-value="cRender.inactiveValue || 0"
						:readonly="cRender.readonly"
						:disabled="cRender.disabled"
						@change="cRender.change && cRender.change.call(this, $event, cRender, data)"
					/>
				</template>

				<!-- 选择图标 -->
				<template v-else-if="cRender.iconSelect">
					<SvgIconSelector :placeholder="cRender.placeholder || `请输入${cRender.key}`" v-model="form[key]" />
				</template>

				<!-- 复选框 -->
				<template v-else-if="cRender.checkbox">
					<el-checkbox
						class="form-checkbox"
						:class="cRender.cls"
						v-model="form[key]"
						:true-label="cRender.activeValue || 1"
						:false-label="cRender.inactiveValue || 0"
						:readonly="cRender.readonly"
						:disabled="cRender.disabled"
						@change="cRender.change && cRender.change.call(this, $event, cRender, data)"
					>
						{{ cRender.title || cRender.key }}
					</el-checkbox>
				</template>

				<!-- 复选按钮组 -->
				<template v-else-if="cRender.checkboxGroup">
					<template v-for="(x, i) in cRender.value" :key="i">
						<el-checkbox
							class="form-checkbox-group--item"
							:class="x.cls"
							v-model="form[key]"
							:true-label="x.activeValue || 1"
							:false-label="x.inactiveValue || 0"
							:readonly="x.readonly"
							:disabled="x.disabled"
							@change="cRender.change && cRender.change.call(this, $event, x, cRender, data)"
						>
							{{ x.title || x.key }}
						</el-checkbox>
					</template>
				</template>

				<!-- 复选框组集合 -->
				<template v-else-if="cRender.checkboxGroupArray">
					<!-- 中间状态 -->
					<div class="w100 mt10" v-if="cRender.indeterminate">
						<div class="w100 mb30" v-for="(x, i) in cRender.indeterminateArray" :key="`indeterminate_${i}`">
							<el-tag class="mb5 fs-14" size="large" type="warning">{{ x.text }}</el-tag>

							<el-checkbox-group
								class="form-checkbox-group"
								:class="cRender.cls"
								v-model="form[key]"
								:readonly="cRender.readonly"
								:disabled="cRender.disabled"
								@change="cRender.change && cRender.change.call(this, $event, cRender, data)"
							>
								<template v-for="(b, j) in x.checkboxGroupArray" :key="b.key">
									<el-checkbox class="form-checkbox" :label="b.code">{{ b.text }}</el-checkbox>
								</template>
							</el-checkbox-group>
						</div>
					</div>

					<template v-else>
						<el-checkbox-group
							class="form-checkbox-group"
							:class="cRender.cls"
							v-model="form[key]"
							:readonly="cRender.readonly"
							:disabled="cRender.disabled"
							@change="cRender.change && cRender.change.call(this, $event, cRender, data)"
						>
							<template v-for="(x, i) in cRender.checkboxGroupArray" :key="x.key">
								<el-checkbox class="form-checkbox" :label="x.code">{{ x.text }}</el-checkbox>
							</template>
						</el-checkbox-group>
					</template>
				</template>

				<!-- 单选按钮组 -->
				<template v-else-if="cRender.radioGroup">
					<el-radio-group
						class="form-radio-group"
						:class="cRender.cls"
						v-model="form[key]"
						:readonly="cRender.readonly"
						:disabled="cRender.disabled"
						@change="cRender.change && cRender.change.call(this, $event, cRender, data)"
					>
						<template v-for="(x, i) in cRender.radios" :key="x.value">
							<el-radio :label="x.value" :disabled="x.disabled">{{ x.title || x.key }}</el-radio>
						</template>
					</el-radio-group>
				</template>

				<!-- 时间日期 -->
				<template v-else-if="cRender.datetime">
					<el-date-picker
						class="form-item"
						:class="cRender.cls"
						v-model="form[key]"
						:type="cRender.dateType || 'date'"
						:disabled-date="cRender.disabledDate"
						:placeholder="cRender.placeholder || `请选择${cRender.key}`"
						:format="cRender.format || 'YYYY-MM-DD'"
						:value-format="cRender.valueFormat || 'YYYY-MM-DD'"
						:readonly="cRender.readonly"
						:disabled="cRender.disabled"
						@change="cRender.change && cRender.change.call(this, $event, cRender, data)"
					/>
				</template>

				<!-- 日期段选择 -->
				<template v-else-if="cRender.daterange">
					<el-date-picker
						class="form-item daterange"
						:class="cRender.cls"
						ref="daterange"
						v-model="form[key]"
						:type="cRender.type || `daterange`"
						range-separator="至"
						:start-placeholder="cRender.startPlaceholder || `开始日期`"
						:end-placeholder="cRender.endPlaceholder || `结束日期`"
						:disabled-date="cRender.disabledDate"
						:format="cRender.format || `YYYY-MM-DD`"
						:value-format="cRender.valueFormat || `YYYY-MM-DD`"
						:clearable="cRender.clearable === false ? false : true"
						:readonly="cRender.readonly"
						:disabled="cRender.disabled"
						@change="dateRange($event, cRender)"
					/>
				</template>

				<!-- 数字输入框 -->
				<template v-else-if="cRender.inputNumber">
					<el-input-number
						class="form-item input-number"
						:class="cRender.cls"
						v-model="form[key]"
						:min="cRender.min || 1"
						:max="cRender.max || 100"
						:readonly="cRender.readonly"
						:disabled="cRender.disabled"
						@change="cRender.change && cRender.change.call($event, cRender)"
					/>
				</template>

				<!-- 表格 -->
				<template v-else-if="cRender.table">
					<div class="form-table-button mb20" v-if="cRender.buttons">
						<template v-for="(x, i) in cRender.buttons" :key="i">
							<el-button :type="x.type || 'primary'" @click="x.callback && x.callback.call($event, x, cRender)">{{ x.text }}</el-button>
						</template>
					</div>

					<ListTable
						class="form-table-box no-hover"
						:formKey="key"
						:form="form"
						:data="form[key]"
						:showFields="cRender.showFields"
						:mergeCallFun="cRender.mergeCallFun"
						:tableConfig="cRender.tableConfig"
						:rowKey="key"
						v-bind="cRender.attrs"
						v-on="cRender.handlerList || {}"
					/>

					<div class="form-card-box--item block mt25" v-if="cRender.pages">
						<ListFooter inline position="right" :current="cRender" :formKey="key" :pages="cRender.pages" @change="cRender.handlePaginationChange" />
					</div>
				</template>

				<!-- 上传按钮 -->
				<template v-else-if="cRender.isUpload">
					<FormUpload
						:formKey="key"
						:form="form[key]"
						v-bind="cRender"
						:showFields="cRender"
						:editor="isUploadEditor(cRender.editor)"
						@uploadComplete="uploadComplete"
						@uploadDelete="uploadDelete"
					/>
				</template>

				<!-- 富文本 -->
				<template v-else-if="cRender.textEditor">
					<Editor
						:toolbarConfig="cRender.toolbarConfig"
						:editorConfig="cRender.editorConfig"
						v-model:get-html="form[key]"
						v-model:get-text="cRender.textVal"
						:disable="cRender.disable"
					/>
				</template>

				<!-- 文本域 -->
				<template v-else-if="cRender.textarea">
					<el-input
						class="form-textarea"
						:class="cRender.cls"
						v-model="form[key]"
						type="textarea"
						:placeholder="`请输入${cRender.key || cRender.placeholder}`"
						:maxlength="cRender.maxlength"
						:readonly="cRender.readonly"
						:disabled="cRender.disabled"
						:resize="cRender.resize || 'none'"
						:autosize="cRender.autosize || { minRows: 5, maxRows: 8 }"
						:show-word-limit="!!cRender.maxlength"
					/>
				</template>

				<!-- 普通按钮操作 -->
				<template v-else-if="cRender.isButton">
					<div class="rander-button flex-row">
						<el-button :type="cRender.type || 'primary'" @click="cRender.handle && cRender.handle.call($event, formKey, cRender)">
							{{ cRender.text }}
						</el-button>
						<div class="ml30 fs14">
							<el-alert
								class="ptb0"
								:title="cRender.status === 'success' ? `成功！` : `失败！`"
								:type="cRender.status"
								:closable="false"
								show-icon
								center
								v-if="cRender.status === 'success'"
							/>
						</div>
					</div>
				</template>

				<!-- 文本框 -->
				<template v-else>
					<!-- 数字类型 -->
					<template v-if="cRender.number">
						<el-input
							class="form-item"
							:class="cRender.cls"
							type="number"
							:maxlength="cRender.maxlength"
							v-model="form[key]"
							:clearable="!cRender.readonly"
							:readonly="cRender.readonly"
							:disabled="cRender.disabled"
							:placeholder="cRender.placeholder || `请输入${cRender.key}`"
							:oninput="`if(value.length > ${cRender.maxlength}) value = value.slice(0, ${cRender.maxlength})`"
						>
							<template #suffix>
								<span class="suffix" v-if="cRender._suffix && !U.isFalse(form[key])">{{ cRender._suffix }}</span>
							</template>
						</el-input>
					</template>

					<!-- 转换大写 -->
					<template v-else-if="cRender.upperCase">
						<el-input
							class="form-item"
							:class="cRender.cls"
							type="text"
							:maxlength="cRender.maxlength"
							v-model="formValueUpperCase"
							:clearable="!cRender.readonly"
							:readonly="cRender.readonly"
							:disabled="cRender.disabled"
							:placeholder="cRender.placeholder || `请输入${cRender.key}`"
							@input="cRender.input && cRender.input.call(this, $event, cRender, pRender, form[key])"
						>
							<template #suffix>
								<span class="suffix" v-if="cRender._suffix && !U.isFalse(form[key])">{{ cRender._suffix }}</span>
							</template>
						</el-input>
					</template>

					<!-- 密码 -->
					<template v-else-if="cRender.isPassword">
						<el-input
							class="form-item"
							:class="cRender.cls"
							:type="cRender.isShowPassword ? 'text' : 'password'"
							:maxlength="cRender.maxlength"
							v-model="form[key]"
							:clearable="!cRender.readonly"
							:readonly="cRender.readonly"
							:disabled="cRender.disabled"
							:placeholder="cRender.placeholder || `请输入${cRender.key}`"
							@input="cRender.input && cRender.input.call(this, $event, cRender, pRender, form[key])"
						>
							<template #suffix>
								<i
									class="iconfont el-input__icon login-content-password"
									:class="!cRender.isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
									@click="cRender.isShowPassword = !cRender.isShowPassword"
								></i>
							</template>
						</el-input>
					</template>

					<!-- 其他类型 -->
					<template v-else>
						<el-input
							class="form-item"
							:class="cRender.cls"
							:style="cRender.style"
							:type="cRender.type || 'text'"
							:maxlength="cRender.maxlength"
							v-model="form[key]"
							:clearable="!cRender.readonly"
							:readonly="cRender.readonly"
							:disabled="cRender.disabled"
							:placeholder="cRender.placeholder || `请输入${cRender.key}`"
							@input="cRender.input && cRender.input.call(this, $event, cRender, data)"
						>
							<template #suffix>
								<span class="suffix" v-if="cRender._suffix && !U.isFalse(form[key])">{{ cRender._suffix }}</span>
							</template>
						</el-input>
					</template>
				</template>
			</template>

			<!-- 读取 不可以编辑 -->
			<template v-if="!isEditor">
				<!-- 级联选择 读取文本 -->
				<template v-if="cRender.cascader">
					<el-cascader
						class="form-item cascader disabled"
						:class="{ 'd-inline-block': cRender.connectDetailAddress }"
						:props="cRender.cascaderProps"
						:separator="cRender.cascader.separator"
						:options="cRender.cascader.data"
						v-model="form[key]"
						disabled
					/>

					<!-- 连接地址详情 -->
					<template v-if="cRender.connectDetailAddress">{{ form[cRender.detailAddressField] }}</template>
				</template>

				<!-- 表格 -->
				<template v-else-if="cRender.table">
					<div class="form-table-button mb20" v-if="cRender.buttons">
						<template v-for="(x, i) in cRender.buttons" :key="i">
							<el-button :type="x.type || 'primary'" @click="x.callback && x.callback.call($event, x, cRender)">{{ x.text }}</el-button>
						</template>
					</div>

					<ListTable
						class="form-table-box no-hover"
						:formKey="key"
						:form="form"
						:data="form[key]"
						:showFields="cRender.showFields"
						:mergeCallFun="cRender.mergeCallFun"
						:tableConfig="cRender.tableConfig"
						:rowKey="key"
						v-bind="cRender.attrs"
						v-on="cRender.handlerList || {}"
					/>

					<div class="form-card-box--item block mt25" v-if="cRender.pages">
						<ListFooter inline position="right" :current="cRender" :formKey="key" :pages="cRender.pages" @change="cRender.handlePaginationChange" />
					</div>
				</template>

				<!-- 上传按钮 -->
				<template v-else-if="cRender.isUpload">
					<FormUpload :formKey="key" :form="form[key]" v-bind="cRender" :showFields="cRender" :editor="false" />
				</template>

				<template v-else>
					<label class="form-item" :class="cRender.viewClass">
						<!-- 下拉选择 读取文本 -->
						<template v-if="cRender.select">{{ dict(form[key], cRender.select) }}</template>

						<!-- 单选按钮 -->
						<template v-else-if="cRender.radioGroup">{{ radio(form[key], cRender.radios) }}</template>

						<!-- 时间戳 -->
						<template v-else-if="cRender.timestamp">{{ form[key] ? U.getFormatDateByTime(form[key], 'dateStr') : '' }}</template>

						<!-- 时间戳 -->
						<template v-else-if="cRender.datetime">{{ form[key] ? U.getFormatDateByTime(form[key], 'dateStr') : '' }}</template>

						<!-- 加密数据 -->
						<template v-else-if="cRender.AES">
							{{ form[key] }}
							<span class="suffix" v-if="cRender._suffix && !U.isFalse(form[key])">{{ cRender._suffix }}</span>
							<el-tooltip effect="dark" trigger="click" :content="decrypt(key, form)" placement="bottom" v-if="!!form[key]">
								<SvgIcon class="ml8 color-green cursor-pointer" name="ele-View" />
							</el-tooltip>
						</template>

						<!-- 加密数据 -->
						<template v-else-if="cRender.AESshow">
							{{ decrypt(key, form) }}
							<span class="suffix" v-if="cRender._suffix && !U.isFalse(form[key])">{{ cRender._suffix }}</span>
						</template>

						<!-- 展示金额千分符 -->
						<template v-else-if="cRender.moneyFormat">
							{{ !U.isFalse(form[key]) ? U.moneyFormat(form[key]) : `` }}
							<span class="suffix" v-if="cRender._suffix && !U.isFalse(form[key])">{{ cRender._suffix }}</span>
						</template>

						<!-- 展示金额大写 -->
						<template v-else-if="cRender.moneyToCapital">
							{{ !U.isFalse(form[key]) ? U.moneyToCapital(form[key]) : `` }}
							<span class="suffix" v-if="cRender._suffix && !U.isFalse(form[key])">{{ cRender._suffix }}</span>
						</template>

						<!-- 普通文本 -->
						<template v-else>
							{{ form[key] }}
							<span class="suffix" v-if="cRender._suffix && !U.isFalse(form[key])">{{ cRender._suffix }}</span>
						</template>
					</label>
				</template>
			</template>
		</template>

		<!-- 渲染项紧邻的提示标识 -->
		<template v-if="cRender.neighbor">
			<template v-for="(x, i) in cRender.neighbor" :key="`neighbor_${i + 1}`">
				<div
					class="form-render-item--neighbor"
					:class="{ disabled: x.disabled }"
					@click="!x.disabled && x.click && x.click.call(cRender, key, x, cRender, form)"
				>
					<template v-if="x.icon">
						<SvgIcon :name="x.icon" />
					</template>

					<template v-if="x.text">
						<span>{{ x.text }}</span>
					</template>
				</div>
			</template>
		</template>
	</div>
</template>

<script setup lang="ts" name="vhmFormFieldsRender">
import { jBox } from '/@/plugins/jBox';
import { mittBus } from '/@/plugins/settings';
import { cryptoAES } from '/@/plugins/storage/crypto';
import { U } from '/@/utils';

const props = defineProps({
	// 是否可编辑
	editor: { type: null, default: true },
	// 需要渲染的数据结构
	current: { type: Object as PropType<EmptyObjectType>, default: null },
	// 当前数据的父级
	parent: { type: Object as PropType<EmptyObjectType>, default: null },
	// 当前的 key
	formKey: { type: String, default: null },
	// 绑定数据的值
	formData: { type: null, default: null }
});

// 事件
const emit = defineEmits(['cascaderChange']);

// 声明变量
const cRender = computed(() => props.current);
const pRender = computed(() => props.parent);
const key = computed(() => props.formKey);
const form = computed(() => props.formData);

// 级联的Ref
const cascaderRef = ref<RefType>({});
const treeRef = ref<RefType>({});

// 上传图片是否可以编辑
const isUploadEditor = computed(() => (val: any) => U.isBoolean(val) ? val : val === -1 ? false : true);

// 是否可以编辑
const isEditor = computed(() => {
	if (!U.isBoolean(props.editor)) {
		return props.editor === -1 ? false : true;
	} else {
		return props.editor;
	}
});

// 转换成大写
const formValueUpperCase = computed({
	get() {
		return form.value[key.value];
	},
	set(newValue) {
		form.value[key.value] = newValue.toUpperCase();
	}
});

// 监听
watchEffect(() => {
	// 绑定菜单树选择节点
	mittBus.on('getTreeCheckKeys', () => {
		if (cRender.value.tree) {
			const treeRefItem = treeRef.value[key.value];
			const keys = treeRefItem!.getCheckedKeys(true);
			form.value[key.value] = keys;
		}
	});
});

/**
 * @description 数据字典
 */
function dict(data: string | number | boolean, dict: Array<any>) {
	return U.getArrayValueById(data, dict);
}

/**
 * @description 单选按钮
 */
function radio(data: string | number | boolean, raios: Array<any>) {
	return U.getArrayValueById(data, raios, 'value', 'key');
}

/**
 * @description 显示解密内容
 */
function decrypt(key: string, data: EmptyObjectType) {
	if (data[`encrypt_${key}`]) {
		return cryptoAES.decrypt(data[`encrypt_${key}`]);
	} else {
		return data[key];
	}
}

/**
 * @description 下拉选择
 */
function selectChange(value: any, cRender: EmptyObjectType, pRender: EmptyObjectType, key: string, form: EmptyObjectType) {
	if (cRender.setAjaxValue) {
		if (U.isArray(value) && !U.isArrayEmpty(value)) {
			value.forEach((x: any, i: number) => {
				form[cRender.setAjaxValue[i]] = x;
			});
		}
	}

	cRender.change && cRender.change.call(null, value, cRender, pRender, key, form);
}

/**
 * @description 级联选择 读取文本
 */
function cascader(value: Array<any>, fields: Array<any>, cascader: EmptyObjectType) {
	const result = U.compactArray(fields.map((x: any) => value[x]));
	return result.length > 0 ? result.join(cascader.separator || '-') : '';
}

/**
 * @description 级联选择 回调函数
 */
function cascaderChange(value: Array<any>, key: string, item: EmptyObjectType, data: EmptyObjectType) {
	const { cascader, valueField, textFileds } = item as { valueField: EmptyArrayType; textFileds: EmptyArrayType; cascader: EmptyObjectType };
	const currentCascaderRef = cascaderRef.value[key];
	const codeArray = value;
	const textArray = currentCascaderRef.getCheckedNodes()[0].pathLabels;

	// 需要给额外的字段赋值
	if (!!cascader.extraField) {
		const checkedData = currentCascaderRef.getCheckedNodes()[0].data;
		item.extraFieldValue = checkedData[cascader.extraField];
	}

	// 城市级联需要单独设置省市区的编码和名字
	if (codeArray) {
		if (codeArray.length === 0) {
			if (!!valueField && !!textFileds) {
				valueField.forEach((x, index) => {
					form.value[valueField[index]] = '';
					form.value[textFileds[index]] = '';
				});
			}
		} else {
			if (!!valueField && !!textFileds) {
				codeArray.forEach((x, index) => {
					form.value[valueField[index]] = x;
					form.value[textFileds[index]] = textArray[index];
				});
			}
		}
	}

	emit('cascaderChange', codeArray, textArray, key, item);
}

/**
 * @description 日期段选择
 */
function dateRange(value: Array<any>, source: EmptyObjectType) {
	// 是否需要拼接开始时间和结束时间
	const isNotTimestamp = source.isNotTimestamp;
	const times = ['00:00:00', '23:59:59'];

	if (!U.isArray(value)) {
		source.setAjaxValue.forEach((name: string, index: number) => {
			form.value[name] = '';
		});

		return;
	}

	if (source.validation) {
		if (source.type === 'monthrange') {
			const months = source.months || 12;
			const [sYear, sMonth] = value[0].split('-').map((x: string) => parseInt(x));
			const [eYear, eMonth] = value[1].split('-').map((x: string) => parseInt(x));

			if ((eYear - sYear) * 12 + (eMonth - sMonth) > months) {
				jBox.error(`时间区间大于 ${months} 个月`);
				U.emptyArray(value);
				return false;
			}
		} else {
			const days = source.days || 7;
			const diff = days * 24 * 60 * 60 * 1000;
			const start = value[0];
			const end = value[1];
			if (new Date(end).getTime() - new Date(start).getTime() > diff) {
				jBox.error(source.errorTips || `时间区间大于 ${days} 个自然日`);
				U.emptyArray(value);
				return false;
			}
		}
	}

	source.setAjaxValue.forEach((name: string, index: number) => {
		form.value[name] = !isNotTimestamp ? new Date(`${value[index]} ${times[index]}`).getTime() : value[index];
	});
}

/**
 * @description 上传完成回调
 */
function uploadComplete({ result, source } = {} as EmptyObjectType) {
	form.value[source.formKey] = result.formData;
}

/**
 * @description 删除文件
 */
function uploadDelete({ result, source, index } = {} as EmptyObjectType) {
	form.value[source.formKey] = result.formData;
}

defineExpose({ treeRef, cascaderRef });
</script>
