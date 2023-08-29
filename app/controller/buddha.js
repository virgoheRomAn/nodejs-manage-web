'use strict';

const Controller = require('egg').Controller;

/**
 * @description 账务
 * @author virgoheRomAn
 * @date 2021-12-19
 */
class BuddhaController extends Controller {
	// 获取审批记录
	async debtTransferTdDetail() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.buddhaService.debtTransferTdDetail(params);
		ctx.body = rs;
	}

	// 债转文件解析验证（合通业务）
	async debtTransferTdParse() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.buddhaService.debtTransferTdParse(params);
		ctx.body = rs;
	}

	// 创建债转信息（合通业务）
	async debtTransferTdCreate() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.buddhaService.debtTransferTdCreate(params);
		ctx.body = rs;
	}

	// 债转审批
	async debtTransferTdApproval() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.buddhaService.debtTransferTdApproval(params);
		ctx.body = rs;
	}

	// 查询借据列表
	async queryLoanReceipts() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.buddhaService.queryLoanReceipts(params);
		ctx.body = rs;
	}

	// 查询借据详情
	async queryReceiptDetail() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.buddhaService.queryReceiptDetail(params);
		ctx.body = rs;
	}

	// 分页查询还款记录明细
	async queryRepayRecord() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.buddhaService.queryRepayRecord(params);
		ctx.body = rs;
	}

	// 线下登账记录分页查询
	async queryOfflineRepayRecord() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.buddhaService.queryOfflineRepayRecord(params);
		ctx.body = rs;
	}

	// 通用产品-还款试算
	async settleRepayTrial() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.buddhaService.settleRepayTrial(params);
		ctx.body = rs;
	}

	// 线下还款成功-根据借据入账
	async offlineRepayByReceipt() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.buddhaService.offlineRepayByReceipt(params);
		ctx.body = rs;
	}

	// 分页查询批量债转
	async queryDebtTransferList() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.buddhaService.queryDebtTransferList(params);
		ctx.body = rs;
	}

	// 分页查询债转明细
	async queryDebtTransferItemList() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.buddhaService.queryDebtTransferItemList(params);
		ctx.body = rs;
	}

	// 在贷明细查询
	async queryOnloanProgressReport() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.buddhaService.queryOnloanProgressReport(params);
		ctx.body = rs;
	}

	// 查询小贷放款报表
	async queryLoansReport() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.buddhaService.queryLoansReport(params);
		ctx.body = rs;
	}

	// 分页查询小贷溢缴款报表
	async queryOverpaymentReport() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.buddhaService.queryOverpaymentReport(params);
		ctx.body = rs;
	}

	// 查询小贷结算明细报表
	async querySettleDetailReport() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.buddhaService.querySettleDetailReport(params);
		ctx.body = rs;
	}

	// 查询小贷结算明细报表
	async queryRepaymentReport() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.buddhaService.queryRepaymentReport(params);
		ctx.body = rs;
	}

	// 分页查询关账数据
	async queryCloseAccount() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.buddhaService.queryCloseAccount(params);
		ctx.body = rs;
	}

	// 新增关账
	async addCloseAccount() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.buddhaService.addCloseAccount(params);
		ctx.body = rs;
	}
}

module.exports = BuddhaController;
