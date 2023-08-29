<template>
	<div class="vhm-layout-container">
		<LayoutContainer :title="title" isFixed :loading="loading">
			<template #default>
				<el-form
					ref="ruleFormRef"
					class="form-box form-box--long"
					:class="{ 'form-box-validate': editor, 'form-box-view': !editor }"
					:validate-on-rule-change="false"
					:model="form.formData"
					:rules="form.rulesData"
					:inline="false"
					label-width="150px"
				>
					<FormFieldsLayout
						ref="formFieldsLayoutRef"
						:isView="!editor"
						:editor="editor"
						:showFields="form.showFields"
						:formData="form.formData"
						:rulesData="form.rulesData"
					/>
				</el-form>
			</template>

			<template #footer>
				<el-button @click="back()">返回</el-button>
				<el-button type="primary" @click="submit()">提交</el-button>
			</template>
		</LayoutContainer>
	</div>
</template>

<script setup lang="ts" name="jrBoss.order.repayment.offline">
// TODO：暂时不做金融部分的线下还款
import { C } from '/@/dicts';
import { U } from '/@/utils';
import { jBox } from '/@/plugins/jBox';
import { createObjectByUrlParams, goToUrl } from '/@/hooks/useRoute';
import { greaterThanZero } from '/@/plugins/verify';
import { queryRepaymentOfflineDetails } from '/@/api/jrboss/order';

const route = useRoute();
const params = createObjectByUrlParams({ route });

const loading = ref(false);
const editor = ref(true);
const title = ref(`${params.productName} - 线下还款`);
const ruleFormRef = ref<RefType>();
const formFieldsLayoutRef = ref<RefType>();

const form = reactive({
	showFields: {
		baseInfo: {
			key: '基本信息',
			render: 'object',
			editor: false,
			value: {
				id: { key: '订单编号', value: '' },
				productName: { key: '产品名称', value: '' },
				hr: { hr: true, isNotRenderShow: true, isNotAjax: true },
				userName: { key: '用户姓名', value: '' },
				userId: { key: '用户姓名', value: '' },
				userIdNo: { key: '身份证号码', value: '' },
				userPhone: { key: '手机号', value: '' }
			}
		},
		receiptInfo: {
			key: '小贷关联信息',
			render: 'object',
			editor: false,
			value: {
				receiptNum: { key: '借据编号', value: '', column: true },
				loanAmount: { key: '借款金额', value: '', moneyFormat: true, _suffix: '元', column: true },
				notRepayPrincipal: { key: '剩余应还总额', value: '', moneyFormat: true, _suffix: '元' },
				principal: { key: '剩余应还本金', value: '', moneyFormat: true, _suffix: '元' },
				interest: { key: '剩余应还利息', value: '', moneyFormat: true, _suffix: '元' },
				overduePenalty: { key: '剩余应还罚息', value: '', moneyFormat: true, _suffix: '元' },
				fee: { key: '剩余应还费用', value: '', moneyFormat: true, _suffix: '元' }
			}
		},
		collectInfo: {
			key: '登账信息',
			render: 'object',
			editor: true,
			width: '220px',
			value: {
				payType: { key: '还款类型', value: 1, select: C.jrDict['OfflineRepaymentType'], messageBox: [{ icon: 'ele-Question' }], column: true },
				trialTime: { key: '还款试算日期', value: U.getFormatDateByTime('', 'date'), datetime: true, isNotrequired: true, column: true },
				shouldRepayAmount: { key: '试算服务费', value: '', readonly: true, isNotrequired: true, _suffix: '元', column: true },
				payTime: {
					key: '实际还款日期',
					value: U.getFormatDateByTime('', 'date'),
					datetime: true,
					column: true,
					disabledDate(time: Date) {
						return time.getTime() > Date.now();
					}
				},
				remainAmount: { key: '溢缴款余额', value: '0', moneyFormat: true, readonly: true, isNotrequired: true, _suffix: '元', column: true },
				payAmt: {
					key: '实际还款金额',
					value: '',
					column: true,
					rules: [
						{ pattern: U.verifyExp.amount, message: '必须为数字，且最多只能有两位小数', trigger: 'blur' },
						{ validator: greaterThanZero, message: '实际还款金额必须大于0', trigger: 'blur' }
					]
				},
				paySn: { key: '还款流水', value: '', column: true },
				payWay: { key: '还款来源', value: '', select: C.jrDict['OfflineRepaymentChannel'], column: true }
			}
		}
	},
	formData: {} as EmptyObjectType,
	rulesData: {} as EmptyObjectType
});

// 赋值函数
const setFormRenderByData = (data: EmptyObjectType) => {
	for (let key in data) {
		form.formData[key] = U.isFalse(data[key]) ? (U.isArray(form.formData[key]) ? [] : '') : data[key];
	}
};

// 查询接口
async function initQuery(data?: EmptyObjectType) {
	const rs = await queryRepaymentOfflineDetails({ id: params.orderId });
	if (rs.code === 'SUCCESS') {
		setFormRenderByData(rs.data);
	}
}

// 返回
const back = () => {
	goToUrl(`/jrboss/order/list`, route);
};

onMounted(async () => {
	// 生成 form 表单
	form.formData = U.formatFormData(form.showFields);

	await initQuery();
});

watch(
	() => route,
	(r) => {},
	{ immediate: true, deep: true }
);
</script>
