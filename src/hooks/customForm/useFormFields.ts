import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';

/**
 * @description 预设值字段显示状态
 * @description 将所有显示字段 设置为不显示 根据大表单显示对应的字段
 * @description fixed 字段跳过
 */
export function disabledFields(fields: EmptyObjectType) {
	if (!U.isObject(fields)) return false;

	for (let key in fields) {
		let item = fields[key];
		if (item.fixed) continue;

		item.isNotRenderShow = true;

		if (U.isObject(item.value)) disabledFields(item.value);

		if (U.isArray(item.value)) {
			if (item.render === 'array' && item.formatField) {
				disabledFields(item.formatField);
			}
		}
	}
}

/**
 * @description 接口返回值配置页面渲染字段
 * @description fixed 读取渲染设置的默认值 [显示隐藏]
 * @param form 页面渲染字段 规则集 等
 * @param renderField 渲染的字段集合
 * @param data 读取的配置数据
 * @param productConfig 读取的产品配置
 * @param isView 是否是只读表单
 */
export function setRenderFieldByData(
	form: EmptyObjectType,
	renderField: EmptyObjectType,
	data: EmptyObjectType,
	productConfig: EmptyObjectType,
	isView = false
): void {
	try {
		// 分组 | 组里字段 | 审批操作 | 子表单[共借人 抵押物] | 接口验证规则
		const fieldsets = isView ? data.viewFieldsets : data.fieldsets;
		const fields = isView ? data.viewFields : data.fields;
		const subforms = isView ? data.viewSubforms : data.subforms;
		const outcomes = data.outcomes;

		// 根据页面渲染数据 读取配置项
		for (let key in renderField) {
			let item = renderField[key];

			// 读取组选项 [不在控制显示隐藏]
			if (!!item.render) {
				if (!!fieldsets[key]) {
					item.key = fieldsets[key].name;
					item.isNotRenderShow = item.fixed ? item.isNotRenderShow : false;
				} else {
					// showNotGroups - 是否展示配置中没有的组
					item.isNotRenderShow = item.showNotGroups !== undefined ? !item.showNotGroups : true;
				}
			}

			// 基础数据处理 [如果是根数据 或者 有子表单渲染 或者 是上传组件]
			if ((!U.isObject(item.value) && !U.isArray(item.value)) || !!item.subFormRenderKey || item.isUpload) {
				let fieldItem = fields[key];

				// 是否有字段 [fixed 字段控制显示隐藏 是否读取配置]
				if (!!fieldItem) {
					// 字段key | 数据字典 | 是否必填 | 编辑只读 | 最大输入 | 子表单
					const { dictCode, required, readonly, maxLength, subformKey } = fieldItem;
					// 添加权限 | 删除权限 | 编辑权限
					const { itemAdded, itemDeleted, itemEdited } = fieldItem;

					// 处理数据字段 [全量数据字典]+[产品配置中筛选]
					if (!!dictCode) {
						let dictList = C.filterDicts(dictCode, productConfig);
						item.select = dictList;
						item.allSelect = dictList;

						if (!!item.filterList) {
							item.filterList = item.select;
						}
					}

					item.isNotRenderShow = item.fixed ? item.isNotRenderShow : false;
					item.isNotrequired = readonly ? true : item.requiredFixed ? false : !required;
					item.editor = !readonly;
					item.itemAdded = !!itemAdded;
					item.itemDeleted = !!itemDeleted;
					item.itemEdited = !!itemEdited;
					item.maxlength = maxLength || Infinity;

					// [共借人 | 抵押物] 通过子集字段反向设置改组是否可以编辑
					if (item.parentGroupField) {
						const parent = (<Array<any>>item.parentGroupField.split('.')).reduce((pre, cur) => pre[cur], form);

						// 设置组的状态
						if (parent.handleList) {
							parent.editor = item.editor;
							parent.itemAdded = item.itemAdded;

							parent.handleList.forEach((x: any) => {
								x.handleKey === 'itemAdded' && (x['isNotRenderShow'] = !item.itemAdded);
								x.handleKey === 'itemEdited' && (x['isNotRenderShow'] = !item.itemEdited);
								x.handleKey === 'itemDeleted' && (x['isNotRenderShow'] = !item.itemDeleted);
							});
						}

						// 列表按钮 根据当前页面编辑状态显示隐藏
						if (item.table && item.showFields) {
							if (item.showFields.handler) {
								item.showFields.handler.buttons.forEach((x) => {
									// 排除默认的 不可编辑需要隐藏可以操作的按钮
									if (!x.fixed) {
										// 根据权限设置是否显示
										['itemEdited', 'itemDeleted'].forEach((d) => {
											if (x.handleKey === d) {
												x.hidden = !item[d];
											}
										});
									}
								});
							}
						}
					}

					// 如果有子表单 递归
					if (!!subformKey) {
						const render = (<Array<any>>item.subFormRenderKey.split('.')).reduce((pre, cur) => pre[cur], form);
						!render && (form.subFormConfig[item.subFormRenderKey] = subforms[subformKey]);
						!!render && setRenderFieldByData(form, render, subforms[subformKey], productConfig, isView);
						continue;
					}

					// 审批按钮读取
					if (key === 'form_outcome') {
						const outcomeList = (Object.values(outcomes) as Array<EmptyObjectType>).map((x) => ({ code: x.outcome, text: x.outcomeDesc }));
						item.select = outcomeList;
						continue;
					}
				}
				continue;
			}

			// 渲染的字段为对象
			if (U.isObject(item.value)) {
				// 读取具体字段配置 [必填][显示隐藏][编辑只读][数据字典]
				for (let k in item.value) {
					let x = item.value[k];

					// 级联数据 [父项不在 fields 中] [value 中的子项在 fields 中]
					if (!!x.cascader) {
						for (let val of Object.keys(x.value)) {
							if (!!fields[val]) {
								// 是否必填 | 编辑只读 | 最大输入
								const { required, readonly, maxLength } = fields[val];

								// 只要有字段 就显示 [fixed 字段控制是否读取配置]
								// 编辑 -1 表示 false    1 表示 true
								x.isNotRenderShow = x.fixed ? x.isNotRenderShow : false;
								// 是否读取配置中的必填项
								x.isNotrequired = readonly ? true : x.requiredFixed ? false : !required;
								x.editor = !readonly;
								x.maxlength = maxLength || Infinity;
								continue;
							}
						}
					}

					setRenderFieldByData(form, item.value, data, productConfig, isView);
				}
				continue;
			}

			// 渲染的 value 是数组 对应的联系人
			if (U.isArray(item.value)) {
				for (let val of item.value) {
					setRenderFieldByData(form, val, data, productConfig, isView);
				}
				continue;
			}
		}
	} catch (error) {
		jBox.error((<Error>error).message);
		throw new Error((<Error>error).message);
	}
}

/**
 * @description 通过返回的数据设置渲染表单
 * @param formRender 页面的 form 渲染集合 包含了 formData 和 showFields
 * @param formData 页面负责渲染数据的集合
 * @param showFields 页面负责布局的集合
 * @param ajaxData 返回的数据集合
 * @param extraCallback 额外处理数据的函数
 */
export function setRenderFormByAjaxData(
	formRender: EmptyObjectType,
	formData: EmptyObjectType,
	showFields: EmptyObjectType,
	ajaxData: EmptyObjectType,
	extraCallback?: Fn
) {
	for (let key in formData) {
		// 返回的每一项数据
		const ajaxItem = ajaxData.data[key];
		// 获取渲染字段
		const showField = U.getObjectItemByKey({ value: showFields }, key);
		// 数据为空
		const emptyData = U.isArray(formData[key]) ? [] : U.isObject(formData[key]) ? {} : '';

		// 如果需要赋值的是个复杂的对象 跳过赋值
		if (U.isObject(formData[key]) && !U.isObjectEmpty(formData[key])) continue;

		// 不设置过滤
		if (showField.isNotSetData) continue;

		// 时间戳
		if (showField.timestamp || showField.datetime) {
			formData[key] = U.isFalse(ajaxItem) ? emptyData : U.getFormatDateByTime(ajaxItem, 'date');
			continue;
		}

		// 返回字段类型 和数据字典不一致 转换成字符串
		if (showField.toStr) {
			formData[key] = U.isFalse(ajaxItem) ? emptyData : ajaxItem.toString();
			continue;
		}

		// 时间段赋值
		if (showField.daterange) {
			const setAjaxValue = showField.setAjaxValue;
			setAjaxValue.forEach((x: any) => (formData[x] = U.formatDatetime(ajaxData.data[x], '{y}-{m}-{d}')));
			formData[key] = setAjaxValue.map((x: any) => formData[x]);
			continue;
		}

		// 城市级联
		if (showField.cascader) {
			const sourceArea = C.getSourceArea();
			const codeArray = sourceArea.map((x) => x.value);
			const hasCityCode = showField.valueField.every((x: any) => codeArray.includes(ajaxData.data[x]));
			const result = U.compactArray(showField.valueField.map((x: any) => ajaxData.data[x]));
			formData[key] = !hasCityCode ? [] : result;
			continue;
		}

		// 城市详细地址
		if (showField.cityCode) {
			const sourceArea = C.getSourceArea();
			const cityCode = showField.cityCode;
			const cityText = U.compactArray(cityCode.map((x: any) => U.getArrayValueById(ajaxData.data[x], sourceArea, 'value', 'label'))).join('-');

			formData[key] = cityText + ' ' + ajaxData.data[key];
			continue;
		}

		// 渲染含有子表单同时数组模式渲染
		if (showField.render === 'array' && !!showField.subFormRenderKey) {
			const { formatField, value } = showField;
			const finallyField = U.clone(formatField);
			U.emptyArray(value);
			formData[key] = U.isFalse(ajaxItem) ? emptyData : ajaxItem;

			formData[key].forEach(() => {
				value.push(U.clone(finallyField));
			});
			continue;
		}

		// 图片渲染给 value 赋值 充当初始值
		if (showField.isUpload) {
			showField.value = U.isFalse(ajaxItem) ? emptyData : ajaxItem;
		}

		// 表格分页
		if (showField.pages) {
			if (ajaxData.data[`${key}Total`]) {
				showField.pages.total = ajaxData.data[`${key}Total`];
			}
		}

		// 需要设置项的标题 label
		if (showField.setKeyField) {
			showField.key = ajaxData.data[showField.setKeyField] + showField.defaultKey;
		}

		// 赋值
		formData[key] = U.isFalse(ajaxItem) ? emptyData : ajaxItem;

		// 额外处理数据 [作用域特殊的字段处理]
		extraCallback && extraCallback(key, formData, showField, ajaxData.data, formRender);
	}
}

/**
 * @description 过滤只读字段
 * @param form 页面渲染字段、规则集、表单配置 等
 * @param routeParams 路由参数
 * @returns
 */
export function filterReadonlyFieldForm(form: EmptyObjectType, routeParams: EmptyObjectType): EmptyObjectType {
	const filterReadonlyFieldForm = {};
	const { formData, formConfig, showFields } = form;
	const formConfigFields = formConfig.fields;

	// 有订单需要传入订单ID
	if (!!routeParams.orderId) formData.orderId = filterReadonlyFieldForm['orderId'] = routeParams.orderId;

	for (let key in formData) {
		let item = formData[key];

		// 如果还有子表单
		const render = U.getObjectItemByKey({ value: showFields }, key);

		if (render.subFormRenderKey) {
			if (!!render.editor) {
				if (formConfigFields[key]) {
					const subFormKey = formConfigFields[key].subformKey;
					if (subFormKey) {
						const subFormFields = formConfig.subforms[subFormKey].fields;
						filterReadonlyFieldForm[key] = [];

						(<any[]>item).forEach((itm, index) => {
							filterReadonlyFieldForm[key][index] = {};

							for (let k in itm) {
								if (subFormFields[k]) {
									if (!subFormFields[k].readonly) {
										filterReadonlyFieldForm[key][index][k] = itm[k];
									}
								} else {
									// 后端没有配置，前端增加的字段，如共借人ID，抵押物ID
									filterReadonlyFieldForm[key][index][k] = itm[k];
								}
							}
						});
					}
				}
			}
		} else {
			if (formConfigFields[key]) {
				if (!formConfigFields[key].readonly) {
					filterReadonlyFieldForm[key] = item;
				}
			}
		}
	}

	return filterReadonlyFieldForm;
}
