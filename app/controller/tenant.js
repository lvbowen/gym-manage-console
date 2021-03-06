const Controller = require('egg').Controller;
const { success, error, mapValue } = require('../../utils/index');

class TenantController extends Controller {

  // 获取租户列表
  async list() {
    const { ctx } = this;
    const entity = mapValue([ 'tenantName', 'userName' ], ctx.request.query);
    const result = await ctx.service.tenant.list(entity);
    ctx.body = success({
      data: result,
    });
  }

  // 新增租户
  async add() {
    const { ctx } = this;
    const entity = mapValue([ 'tenantName', 'tenantPhone', 'userName', 'userMobile', 'provinceCode', 'cityCode', 'districtCode' ], ctx.request.body);
    if (entity.provinceCode && entity.cityCode && entity.districtCode) {
      const res = await ctx.service.address.findAddressTreeData({
        provinceCode: entity.provinceCode,
        cityCode: entity.cityCode,
        districtCode: entity.districtCode,
      });
      if (res) {
        entity.province = res[0].label;
        entity.city = res[0].children[0].label;
        entity.district = res[0].children[0].children[0].label;
      }
    }
    await ctx.service.tenant.create(entity);
    ctx.body = success();
  }

  // 更新租户信息
  async update() {
    const { ctx } = this;
    const entity = mapValue([ 'id', 'tenantName', 'tenantPhone', 'userName', 'userMobile' ], ctx.request.body);
    if (entity.id) {
      await ctx.service.tenant.update(entity);
      ctx.body = success();
    } else {
      ctx.body = error({
        message: 'id不能为空！',
      });
    }
  }

}

module.exports = TenantController;
