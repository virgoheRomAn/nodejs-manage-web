<template>
	<div ref="printRef" class="element-fixed print-wrap" :loading="loading">
		<div class="print-wrap-header">
			<h2>债权转让确认单</h2>
			<label>编号：<span></span></label>
		</div>

		<div class="print-wrap-cont">
			<table class="debt-table" border="0" cellspacing="0" cellpadding="0">
				<thead>
					<tr>
						<th>序号</th>
						<th>债权转让日</th>
						<th>借款合同编号</th>
						<th>债务人姓名</th>
						<th>债务人身份证号</th>
						<th>借款起始时间</th>
						<th>借款本金</th>
						<th>借款利率</th>
						<th>借款到期时间</th>
						<th>还款方式</th>
						<th>债权转让对价</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item, index) in data.debtList" :key="index">
						<td>{{ item.no }}</td>
						<td>{{ item.debtTransferTime }}</td>
						<td>{{ item.loanContractNo }}</td>
						<td v-html="item.debtorNames"></td>
						<td v-html="item.debtorIdCardNos"></td>
						<td>{{ item.loanStartTime }}</td>
						<td>{{ item.loanAmount }}</td>
						<td>{{ item.loanRate }}</td>
						<td>{{ item.loanEndTime }}</td>
						<td>{{ U.getArrayValueById(item.repayMode, C.filterDictsByProId('repaymentMode', 'bjjr_tongdao1')) }}</td>
						<td>{{ item.debtTransferPrice }}</td>
					</tr>
					<tr>
						<td colspan="5" class="table-end">
							<p class="stamp">债权转让方：（盖章）</p>
							<p class="date">
								<span>{{ date.year }} 年</span><span>{{ date.month }} 月</span><span>{{ date.date }} 日</span>
							</p>
						</td>
						<td colspan="6" class="table-end">
							<p class="stamp">债权受让方：（盖章）</p>
							<p class="date">
								<span>{{ date.year }} 年</span><span>{{ date.month }} 月</span><span>{{ date.date }} 日</span>
							</p>
						</td>
					</tr>
				</tbody>
			</table>
			<div class="debt-tips">
				<p class="list-ender">
					*本《债权转让确认单》为协议编号【{{
						data.debtTransferNo
					}}】的《债权转让协议》的附件，债权转让方和债权受让方的权利义务以《债权转让协议》的约定为准。
				</p>
				<p class="list-ender">*本《债权转让确认单》传真机、扫描件、影印件等均具有同等法律效力，债权转让方均对该债权信息及债权转让事宜予以认可。</p>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts" name="jrBoss.order.list.debtTransfer">
import printJs from 'print-js';
import { C } from '/@/dicts';
import { U } from '/@/utils';

const props = defineProps({
	data: { type: Object as PropType<{ debtTransferNo: string; debtList: any[] }>, default: () => ({ debtTransferNo: '', debtList: [] }) }
});

const route = useRoute();
const date = U.getFormatDateByTime(new Date(), 'split');
const loading = ref(false);
const printRef = ref<RefType>();

// 数据处理
const handleData = async () => {
	if (props.data.debtList.length > 0) {
		props.data.debtList.map(
			(item, index) => (
				(item.no = index + 1),
				((item.debtorNames = item.debtorNames.split(',').join('<br>')), (item.debtorIdCardNos = item.debtorIdCardNos.split(',').join('<br>')))
			)
		);
	}
};

watchEffect(() => {
	handleData();
});

// 打印方法
const print = () => {
	const host = window.location.origin;

	printJs({
		printable: printRef.value,
		type: 'html',
		css: [`${host}/resource/css/print.css`],
		scanStyles: false,
		style: `@media print{}`
	});
};

// 暴露变量
defineExpose({ print });
</script>

<style lang="scss" scoped>
.print-wrap {
	width: 80%;
	margin: auto;
	padding-bottom: 20px;

	> .print-wrap-header {
		width: 100%;
		margin: 30px auto 15px;
		> h2 {
			text-align: center;
		}
	}

	.debt-table {
		width: 100%;
		margin: 0 auto;
		border: 1px solid var(--render-card-line);

		td,
		th {
			border-right: 1px solid var(--render-card-line);
			border-bottom: 1px solid var(--render-card-line);
			vertical-align: middle;
			text-align: center;
			padding: 10px;
			font-size: 12px;
			line-height: 20px;

			&:last-child {
				border-right: 0 none;
			}

			&.table-end {
				border-bottom: 0 none;

				.stamp {
					text-align: left;
				}
				.date {
					text-align: right;
					padding-top: 20px;
					span {
						margin-left: 20px;
					}
				}
			}
		}
	}

	.debt-tips {
		width: 100%;
		margin: 20px auto;
		.list-ender {
			font-size: 12px;
		}
	}
}
</style>
