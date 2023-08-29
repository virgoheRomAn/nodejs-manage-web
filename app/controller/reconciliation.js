'use strict';

const Controller = require('egg').Controller;

/**
 * @description 对账
 * @author virgoheRomAn
 * @date 2021-12-19
 */
class ReconciliationController extends Controller {
	// 查询对账类型
	async queryReconciliationTypes() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.reconciliationService.queryReconciliationTypes(params);
		ctx.body = rs;
	}

	// 查询对账记录
	async queryReconciliationList() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.reconciliationService.queryReconciliationList(params);
		ctx.body = rs;
	}

	// 查询对账失败明细
	async queryReconciliationFailureList() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.reconciliationService.queryReconciliationFailureList(params);
		ctx.body = rs;
	}

	// 对账失败明细处理
	async failureItemProcess() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.reconciliationService.failureItemProcess(params);
		ctx.body = rs;
	}

	// 对账操作记录
	async queryReconciliationOperateRecord() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.reconciliationService.queryReconciliationOperateRecord(params);
		ctx.body = rs;
	}

	// 重新对账
	async reconciliationRetry() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.reconciliationService.reconciliationRetry(params);
		ctx.body = rs;
	}

	// 人工对账
	async reconciliationManualProcess() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.reconciliationService.reconciliationManualProcess(params);
		ctx.body = rs;
	}
}

module.exports = ReconciliationController;
