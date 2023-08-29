'use strict';

const Controller = require('egg').Controller;

/**
 * @description 金融boss 订单处理器
 * @author virgoheRomAn
 * @date 2021-12-19
 */
class JrBossOrderController extends Controller {
	// 查询订单列表
	async queryJRorderList() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrOrderService.queryJRorderList(params);
		ctx.body = rs;
	}

	// 导出客户明细列表
	async queryUserDetail() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrOrderService.queryUserDetail(params);
		ctx.body = rs;
	}

	// 导出客户明细列表
	async queryClaimConfirmation() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrOrderService.queryClaimConfirmation(params);
		ctx.body = rs;
	}

	// 获取订单详情
	async queryOrderDetails() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrOrderService.queryOrderDetails(params);
		ctx.body = rs;
	}

	// 查询订单还款计划
	async queryRepaymentPlanList() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrOrderService.queryRepaymentPlanList(params);
		ctx.body = rs;
	}

	// 线下还款详情查询
	async queryRepaymentOfflineDetails() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrOrderService.queryRepaymentOfflineDetails(params);
		ctx.body = rs;
	}

	// 查询公告列表
	async queryAnnouncementList() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrOrderService.queryAnnouncementList(params);
		ctx.body = rs;
	}

	// 查询公告详情
	async queryAnnouncementDetails() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrOrderService.queryAnnouncementDetails(params);
		ctx.body = rs;
	}

	// 保存公告
	async saveAnnouncement() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrOrderService.saveAnnouncement(params);
		ctx.body = rs;
	}

	// 查询业务岗人员列表
	async queryjrBusinessStaffList() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrOrderService.queryjrBusinessStaffList(params);
		ctx.body = rs;
	}

	// 保存业务岗人员
	async savejrBusinessStaff() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrOrderService.savejrBusinessStaff(params);
		ctx.body = rs;
	}

	// 更新业务岗人员状态
	async updatejrBusinessStaff() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrOrderService.updatejrBusinessStaff(params);
		ctx.body = rs;
	}

	// 获取客户入库列表
	async queryUserApplyList() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrOrderService.queryUserApplyList(params);
		ctx.body = rs;
	}

	// 获取客户入库详情
	async queryUserApplyDetail() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrOrderService.queryUserApplyDetail(params);
		ctx.body = rs;
	}

	// 审批客户入库
	async approvalUserApply() {
		const { ctx, service } = this;
		const params = ctx.request.body;
		const rs = await service.jrboss.jrOrderService.approvalUserApply(params);
		ctx.body = rs;
	}
}

module.exports = JrBossOrderController;
