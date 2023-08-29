<template>
	<LayoutDialog ref="dialogRef" isHeaderClose isFixed :fixed="{ width: '600px', height: 'auto' }" model="waring">
		<template #header>温馨提示</template>

		<template #render v-if="isRender">
			<el-card shadow="never">
				<div class="repay-type">
					<label>1、正常还款</label>
					<span>选择此项登账时，超出出账金额部分，系统自动录入溢缴款。</span>
					<label>2、提前还款</label>
					<span>选择此项登账时，预收7天利息提前入账，其余入账按正常还款进行。</span>
					<label>3、提前结清</label>
					<span>选择此项登账时，系统根据日期试算出对应的结清金额，实际还款金额超出结清金额后，多余部分入溢缴款</span>
				</div>
			</el-card>
		</template>
	</LayoutDialog>
</template>

<script setup lang="ts" name="xdBossFinancialRepayType">
const isRender = ref(false);
const dialogRef = ref();

// 打开弹窗
const openDialog = async () => {
	isRender.value = true;
	dialogRef.value.open();
};

// 关闭弹窗
const closeDialog = () => {
	isRender.value = false;
	dialogRef.value.close();
};

// 暴露变量
defineExpose({ openDialog, closeDialog });
</script>
<style lang="scss" scoped>
.repay-type {
	color: var(--color-text-normal);

	> label,
	> span {
		display: block;
	}

	> label {
		margin: 0 0 3px;
		font-size: 14px;
		color: var(--color-text-main);
	}

	> span {
		margin-bottom: 20px;
		line-height: 18px;
		font-size: 12px;
		padding-left: 23px;

		&:last-child {
			margin-bottom: 0;
		}
	}
}
</style>
