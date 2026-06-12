import request from "./request.js";
import { getOSSInfo } from '@/utils/OSS'
import { getFileNameMd5 } from "@/utils"
// import { formatQuery } from "./index";

// 购物车列表
export function GetCartList(params) {
  return request({
    url: `getCartList`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 添加到购物车
export function AddCart(params) {
  return request({
    url: `upsertCartList`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 创建新订单
export function AddOrder(params) {
  return request({
    url: `addOrderV2`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 查询订单
export function GetOrderListbyIds(params) {
  return request({
    url: `getOrderListbyIds`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 订单支付
export function OrderPay(params) {
  return request({
    url: `checkOrder`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 获取支付结果
export function GetPayResult(params) {
  return request({
    url: `getPayStatus`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

/** cinetPay支付 */
export function UsedCinetPay(params) {
  return request({
    url: `cinetPay`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

/** quikkPay 支付 */
export function UsedQuikkPay(params) {
  return request({
    url: `quikkPay`,
    method: "POST",
    data: params,
    auth: 1,
  });
}


/** 获取用户支付订单数(是否首次购买) */
export function GetOrderUserIsOnePay(params) {
  return request({
    url: `getOrderUserIsOnePay`,
    method: "POST",
    data: params,
    auth: 1,
  });
}


// 添加我的物流公司
export function AddMyLogistics(params) {
  return request({
    url: `addUserLogistics`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 获取我的物流公司
export function GetMyLogistics(params) {
  return request({
    url: `getUserLogistics`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 添加收货地址
export function AddAddress(params) {
  return request({
    url: `addUserAddress`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 删除收货地址
export function DelAddress(params) {
  return request({
    url: `delUserAddress`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 修改收货地址
export function EditAddress(params) {
  return request({
    url: `editUserAddress`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 获取物流价目表
export function GetLogisticsPriceList(params) {
  return request({
    url: `getLogisticsPriceList`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 编辑Banner图片
export function EditBanner(params) {
  return request({
    url: `editBannerbyAdmin`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 删除Banner图片
export function DelBanner(params) {
  return request({
    url: `delBannerbyAdmin`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 获取收货地址
export function GetAddressList(params) {
  return request({
    url: `getUserAddressList`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 添加分类
export function AddCategory(params) {
  return request({
    url: `addModCategorybyAdmin`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 编辑分类
export function EditCategory(params) {
  return request({
    url: `editModCategorybyAdmin`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 删除分类
export function DelCategory(params) {
  return request({
    url: `delModCategorybyAdmin`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 获取分类列表
export function GetCategoryList(params) {
  return request({
    url: `getModCategoryListbyAdmin`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 获取订单状态
export function GetOrderListbyStatus(params) {
  return request({
    url: `getOrderListbyStatus`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 获取订单详情
export function GetOrderDetail(params) {
  return request({
    url: `getOrderDetail`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 取消订单
export function CanceOrder(params) {
  return request({
    url: `canceOrder`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 获取产品详情
export function GetSpu(params) {
  return request({
    url: `getSpu`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 查找产品
export function SearchSpu(params) {
  return request({
    url: `searchSpu`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

/** 以图搜图 */
export function GetSpuImagesearch(params) {
  return request({
    url: `getSpuImagesearch`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

/**
 * 添加用户搜索历史记录
 * 
 * 类似于埋点。无需关注调用结果
 *  */ 
export function AddSpuHistoryImgsearch(params) {
  return request({
    url: `addSpuHistoryImgsearch`,
    method: "POST",
    data: params,
  });
}

/**
 * 将文件上传到 OSS
 * @param {File} file 
 * @param {string} path 
 * @returns {Promise<filePath>}
 */
export async function UploadFileToOSS(file, path = 'appimg/') {
  const fileName = await getFileNameMd5(file);
  const ossInfo = await getOSSInfo()
  const form = new FormData()
  form.append('key', path + fileName)
  form.append('OSSAccessKeyId', ossInfo.accessid)
  form.append('policy', ossInfo.policy)
  form.append('signature', ossInfo.signature)
  form.append('success_action_status', '200')
  form.append('file', file)

  return request({
    url: ossInfo.host,
    method: "POST",
    data: form,
    ignoreError: true,
  }).then(() => {
    return Promise.resolve(path + fileName)
  })
}


// 获取产品列表
export function GetSpuList(params) {
  return request({
    url: `getSpuList`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

/**
 * 获取多商品列表
 */
export function GetSpuListByIds(params) {
  return request({
    url: `getSpuListByIds`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 获取分类列表
export function GetCategoryLists(params) {
  return request({
    url: `getCategoryList`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Submit onboarding data to Hermes agent core
export async function OnboardingSubmit(params) {
  return request({
    url: `onboarding/submit`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

export async function GetHermesPersonalizedFeed(params) {
  return request({
    url: `hermes/personalizedFeed`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

export async function UpdateUserPreference(params) {
  return request({
    url: `hermes/updateUserPreference`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 获取banner列表
export function GetBannerList(params) {
  return request({
    url: `getBannerList`,
    method: "POST",
    data: params,
    auth: 0,
  });
}


// 获取主页分类列表
export function GetModCategoryList(params) {
  return request({
    url: `getModCategoryList`,
    method: "POST",
    data: params,
    auth: 0,
  });
}


// 获取推荐
export function GetRecommListbyTypes(params) {
  return request({
    url: `getRecommListbyTypes`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 用户登录
export function Login(params) {
  return request({
    url: `login`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

/** 获取用户登录二维码 */
export function LoginQRCode(params) {
    return request({
    url: `loginQRCode`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

/** 扫描登录状态检查 */
export function GetLoginCheckStatus(params) {
    return request({
    url: `loginCheckStatus`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 用户注册
export function Registger(params) {
  return request({
    url: `registger`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 忘记密码
export function Forget(params) {
  return request({
    url: `forget`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 新建验证码
export function AddVerifyCode(params) {
  return request({
    url: `addVerifyCode`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 获取国家列表
export function GetCountryList(params) {
  return request({
    url: `getCountryList`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 获取店铺详情
export function GetStore(params) {
  return request({
    url: `getStore`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 获取子分类
export function GetCategoryChildenList(params) {
  return request({
    url: `getCategoryChildenList`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 获取产品列表
export function GetStoreSpuList(params) {
  return request({
    url: `getSpuList`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 获取产品收藏
export function GetSpuCollection(params) {
  return request({
    url: `getSpuCollection`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 添加产品收藏
export function AddSpuCollection(params) {
  return request({
    url: `addSpuCollection`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 获取产品收藏列表
export function GetSpuCollectionList(params) {
  return request({
    url: `getSpuCollectionList`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 删除产品收藏
export function DelSpuCollection(params) {
  return request({
    url: `delSpuCollection`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 获取oss直传凭证
export function GetOssPolicyToken(params) {
  return request({
    url: `getOssPolicyToken`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 添加本地oss文件
export function AddOssFile(params) {
  return request({
    url: `addOssFile`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 环信客服注册用户
export function RegisterEasemodUser(params) {
  return request({
    url: `registerEasemodUser`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 添加用户通信记录
export function AddMyImChat(params) {
  return request({
    url: `addImChat`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 获取im记录
export function GetMyImChatList(params) {
  return request({
    url: `getImChatList`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 获取店铺下的用户列表
export function GetUserListbyStoreId(params) {
  return request({
    url: `getUserListbyStoreId`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 上传预付款附件
export function PrepaymentAttach(params) {
  return request({
    url: `prepaymentAttach`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 查询店铺
export function GetStorebyName(params) {
  return request({
    url: `getStorebyName`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 查询汇率
export function GetExchateRateMap(params) {
  return request({
    url: `getExchateRateMap`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 获取产品列表
export function GetSpuListbyNewproduct(params) {
  return request({
    url: `getSpuList`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

/**
 * 智能推荐-猜你喜欢/Ai商品配套
 * 
 * - 传入商品名称，返回商品 id
 * @param {string} search 
 * @returns 
 */
export function GetIntelligentRecommend(search) {
  return request({
    url: `getIntelligentRecommend`,
    method: "POST",
    data: { search },
    auth: 1,
  });
}

/** 根据名称获取子分类列表 */
export function GetCategoryByName(params) {
  return request({
    url: `getCategoryByName`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 身份证实名认证
export function IdCardCheck(params) {
  return request({
    url: `idCardCheck`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 获取校验状态
export function GetCheckStatus(params) {
  return request({
    url: `getCheckStatus`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 获取视频活体h5链接
export function LifeCheckLink(params) {
  return request({
    url: `lifeCheckLink`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 身份证实名认证(阿里云数聚)
export function ShuJuIdCardCheck(params) {
  return request({
    url: `shuJuIdCardCheck`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 人像实人认证
export function FaceIdCardCompare(params) {
  return request({
    url: `faceIdCardCompare`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 发送手机验证码
export function SmsSend(params) {
  return request({
    url: `smsSend`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 手机验证码校验
export function SmsVerify(params) {
  return request({
    url: `smsVerify`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 身份证实名认证
export function Certification(params) {
  return request({
    url: `certification`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// 获取物流通道价格列表
export function GetLogisticChannelList(params) {
  return request({
    url: `getLogisticChannelList`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 获取城市列表
export function GetCityList(params) {
  return request({
    url: `getCityList`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 删除购物车
export function DelCart(params) {
  return request({
    url: `delCart`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 修改购物车
export function UpdateCart(params) {
  return request({
    url: `updateCart`,
    method: "POST",
    data: params,
    auth: 0,
  });
}


// 获取订单支付列表
export function GetOrderPayList(params) {
  return request({
    url: `getOrderPayList`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 拉取城市列表
export function GetAreabyAName(params) {
  return request({
    url: `getAreabyAName`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 新建验证码 V2
export function AddVerifyCodeV2(params) {
  return request({
    url: `addVerifyCodeV2`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 修改邮箱或电话
export function UpdateUserPhoneOrEmail(params) {
  return request({
    url: `updateUserPhoneOrEmail`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 修改用户衣服尺寸
export function UpdateUserClothSize(params) {
  return request({
    url: `updateUserClothSize`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// 获取城市列表
export function GeCountryV2List(params) {
  return request({
    url: `geCountryV2List`,
    method: "POST",
    data: params,
    auth: 0,
  });
}


// 获取区域和城市列表
export function GetStateAndCityListByCountryId(params) {
  return request({
    url: `getStateAndCityListByCountryId`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

/** 获取自己的分享码 */
export function GetShareCode() {
    return request({
    url: `getShareCode`,
    method: "GET",
    data: {},
    auth: 1,
  }); 
}

/** 新增商品分享链接访问记录 */
export function AddShareLinks(params) {
  return request({
    url: `addShareLinks`,
    method: "POST",
    data: params,
    ignoreError: true,
    auth: 1,
  });
}