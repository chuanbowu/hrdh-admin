import request from '@/utils/request'

/* 系统模块 */

// 用户登录接口
export const login = data => request.post('/system/user/login', data, false)

// 用户退出登录
export const loginOut = () => request.post('/system/user/loginOut', {}, false)

// 平台用户菜单信息
export const sysInfo = () => request.post('/system/user/sysInfo', {}, false)

// 用户列表
export const systemUserList = data => request.post('/system/user/list', data, true)

// 新增用户
export const systemUserAdd = data => request.post('/system/user/add', data, false)

// 获取用户信息
export const systemUserInfo = data => request.post('/system/user/userInfo', data, false)

// 修改用户信息
export const systemUserEdit = data => request.post('system/user/userEdit', data, false)

// 修改用户状态
export const editStatus = data => request.post('/system/user/editStatus', data, false)

// 修改用户密码
export const editUserPwd = data => request.post('/system/user/edit', data, false)

// 重置用户密码
export const resetPassword = data => request.post('/system/user/resetPassword', data, false)

// 角色列表
export const sysRoleList = data => request.post('/system/sysRole/list', data, true)

// 新增角色信息
export const sysRoleAdd = data => request.post('/system/sysRole/add', data, false)

// 获取角色信息
export const sysRoleInfo = data => request.post('/system/sysRole/info', data, false)

// 修改角色信息
export const sysRoleEdit = data => request.post('/system/sysRole/edit', data, false)

// 删除角色信息
export const sysRoleDelete = data => request.post('/system/sysRole/delete', data, false)

// 用户分配角色列表
export const userRoleList = data => request.post('/system/userRole/list', data, true)

// 授权角色给用户
export const userRoleAddUserRole = data => request.post('/system/userRole/addUserRole', data, false)

// 角色分配菜单列表
export const roleMenuList = data => request.post('/system/roleMenu/roleMenuList', data, true)

// 授权菜单给角色
export const addRoleMenu = data => request.post('/system/roleMenu/addRoleMenu', data, false)

/* 公共模块 */

// 上传图片
export const uploadImage = data => request.post('/system/currency/uploadImage', data, false)

// 客服列表
export const customerList = data => request.post('/system/customer/customerList', data, true)

// 新增和编辑客服
export const addCustomer = data => request.post('/system/customer/addCustomer', data, false)

// 修改客服状态
export const customerUp = data => request.post('/system/customer/updateStatus', data, false)

// 轮播图列表
export const advertList = data => request.post('/system/advert/advertList', data, true)

// 新增和编辑轮播图
export const addAdvert = data => request.post('/system/advert/addAdvert', data, false)

// 修改轮播图状态
export const advertUp = data => request.post('/system/advert/updateStatus', data, false)

// 经纪人列表
export const agentList = data => request.post('/system/agent/agentList', data, true)

// 新增和编辑经纪人
export const addAgent = data => request.post('/system/agent/addAgent', data, false)

// 修改经纪人状态
export const agentUp = data => request.post('/system/agent/updateStatus', data, false)

// 广告列表
export const advertisementList = data => request.post('/system/advertisement/advertisementList', data, true)

// 新增和编辑广告
export const addAdvertisement = data => request.post('/system/advertisement/addAdvertisement', data, false)

// 修改广告状态
export const advertisementUp = data => request.post('/system/advertisement/updateStatus', data, false)

// 广告位配置
export const goodsAdvertisementList = data => request.post('/system/goodsAdvertisement/goodsAdvertisementList', data, true)

// 编辑广告位
export const updateGoodsAdvertisement = data => request.post('/system/goodsAdvertisement/updateGoodsAdvertisement', data, false)

// 常见问题配置列表
export const problemList = data => request.post('/system/problem/problemList', data, true)

// 新增和编辑轮常见问题配置
export const addProblem = data => request.post('/system/problem/addProblem', data, false)

// 修改常见问题配置状态
export const problemUp = data => request.post('/system/problem/updateStatus', data, false)

// 红人推荐列表
export const sensationRecommendList = data => request.post('/system/sensationRecommend/sensationRecommendList', data, true)

// 新增和编辑红人推荐
export const addSensationRecommend = data => request.post('/system/sensationRecommend/addSensationRecommend', data, false)

// 删除红人推荐
export const sensationRecommendUp = data => request.post('/system/sensationRecommend/updateStatus', data, false)

// 返佣推荐商品列表
export const commissionRecommendList = data => request.post('/system/commissionRecommend/commissionRecommendList', data, true)

// 新增和编辑返佣推荐商品
export const addCommissionRecommend = data => request.post('/system/commissionRecommend/addCommissionRecommend', data, false)

// 修改返佣推荐商品状态
export const commissionRecommendUp = data => request.post('/system/commissionRecommend/updateStatus', data, false)

// 拿货推荐商品列表
export const takeDeliveryRecommendList = data => request.post('/system/takeDeliveryRecommend/takeDeliveryRecommendList', data, true)

// 新增和编辑拿货推荐商品
export const addTakeDeliveryRecommend = data => request.post('/system/takeDeliveryRecommend/addTakeDeliveryRecommend', data, false)

// 修改拿货推荐商品状态
export const takeDeliveryRecommendUp = data => request.post('/system/takeDeliveryRecommend/updateStatus', data, false)

// 底部返佣推荐商品列表
export const bottomCommissionRecommendList = data => request.post('/system/bottomCommissionRecommend/bottomCommissionRecommendList', data, true)

// 新增和编辑底部返佣推荐商品
export const addBottomCommissionRecommend = data => request.post('/system/bottomCommissionRecommend/addBottomCommissionRecommend', data, false)

// 获取商家上传商品数量配置
export const goodsNumConfigList = data => request.post('/system/goodsNumConfig/goodsNumConfigList', data, true)

// 修改商家上传商品数量
export const addGoodsNumConfig = data => request.post('/system/goodsNumConfig/addGoodsNumConfig', data, false)

// 修改底部返佣推荐商品状态
export const bottomCommissionRecommendUp = data => request.post('/system/bottomCommissionRecommend/updateStatus', data, false)

// 省列表
export const provinceList = data => request.post('/system/address/provinceList', data, false)

// 市列表
export const cityList = data => request.post('/system/address/cityList', data, false)

// 区列表
export const areaList = data => request.post('/system/address/areaList', data, false)

// 首页统计
export const statisticsInfo = data => request.post('/system/statistics/statisticsInfo', data, false)

// 商品分类配置
export const goodsTypeConfigList = data => request.post('/system/goodsTypeConfig/goodsTypeConfigList', data, true)

// 新增和编辑分类配置
export const addGoodsTypeConfig = data => request.post('/system/goodsTypeConfig/addGoodsTypeConfig', data, false)

// 删除分类配置
export const updategoodsTypeStatus = data => request.post('/system/goodsTypeConfig/updateStatus', data, false)

/**
 * 商家接口
 */
// 商家列表
export const businessList = data => request.post('/system/business/businessList', data, true)

// 新增商家
export const addBusiness = data => request.post('/system/business/addBusiness', data, false)

// 修改商家
export const updateBusiness = data => request.post('/system/business/updateBusiness', data, false)

// 修改商家状态
export const updateStatus = data => request.post('/system/business/updateStatus', data, false)

// 返佣商品列表
export const commissionGoodsList = data => request.post('/system/goods/commissionGoodsList', data, true)

// 返佣商品详情
export const commissionGoodsInfo = data => request.post('/system/goods/commissionGoodsInfo', data, false)

// 拿货商品列表
export const takeDeliveryGoodsList = data => request.post('/system/goods/takeDeliveryGoodsList', data, true)

// 拿货商品详情
export const takeDeliveryGoodsInfo = data => request.post('/system/goods/takeDeliveryGoodsInfo', data, false)

/**
 * 红人接口管理
 */

// 红人列表
export const sensationList = data => request.post('/system/sensation/sensationList', data, true)

// 红人详情
export const sensationInfo = data => request.post('/system/sensation/sensationInfo', data, false)

// 新增红人
export const addSensation = data => request.post('/system/sensation/addSensation', data, false)

// 编辑红人
export const updateSensation = data => request.post('/system/sensation/updateSensation', data, false)

// 修改红人状态
export const sensationupdateStatus = data => request.post('/system/sensation/updateStatus', data, false)

// 红人审核列表
export const sensationCheckList = data => request.post('/system/sensationCheck/sensationCheckList', data, true)

// 认证审核
export const updateSensationCheck = data => request.post('/system/sensationCheck/updateSensationCheck', data, false)

// 红人提现明细列表
export const sensationWithdrawInfoList = data => request.post('system/sensationWithdrawInfo/sensationWithdrawInfoList', data, false)

// 红人收入明细列表
export const sensationIncomeList = data => request.post('/system/sensationIncome/sensationIncomeList', data, false)

// 红人提现审核
export const checkWithdrawInfo = data => request.post('/system/sensationWithdrawInfo/checkWithdrawInfo', data, false)
