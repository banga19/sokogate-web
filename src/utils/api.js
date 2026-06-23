import request from "./request.js";
import { getOSSInfo } from '@/utils/OSS'
import { getFileNameMd5 } from "@/utils"
// import { formatQuery } from "./index";

// Cart list
export function GetCartList(params) {
  return request({
    url: `getCartList`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Add to cart
export function AddCart(params) {
  return request({
    url: `upsertCartList`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Create order
export function AddOrder(params) {
  return request({
    url: `addOrderV2`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Query order
export function GetOrderListbyIds(params) {
  return request({
    url: `getOrderListbyIds`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Order payment
export function OrderPay(params) {
  return request({
    url: `checkOrder`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Get payment result
export function GetPayResult(params) {
  return request({
    url: `getPayStatus`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

/** cinetPay payment */
export function UsedCinetPay(params) {
  return request({
    url: `cinetPay`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

/**
 * Flutterwave payment verification — called after client-side modal completes.
 * Verifies the transaction server-to-server with Flutterwave API.
 */
export function verifyFlutterwavePayment(params) {
  return request({
    url: `flutterwave/verify`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

/** quikkPay payment */
export function UsedQuikkPay(params) {
  return request({
    url: `quikkPay`,
    method: "POST",
    data: params,
    auth: 1,
  });
}


/** Get user first purchase status */
export function GetOrderUserIsOnePay(params) {
  return request({
    url: `getOrderUserIsOnePay`,
    method: "POST",
    data: params,
    auth: 1,
  });
}


// Add my logistics company
export function AddMyLogistics(params) {
  return request({
    url: `addUserLogistics`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Get my logistics company
export function GetMyLogistics(params) {
  return request({
    url: `getUserLogistics`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Add shipping address
export function AddAddress(params) {
  return request({
    url: `addUserAddress`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Delete shipping address
export function DelAddress(params) {
  return request({
    url: `delUserAddress`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Edit shipping address
export function EditAddress(params) {
  return request({
    url: `editUserAddress`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Get logistics price list
export function GetLogisticsPriceList(params) {
  return request({
    url: `getLogisticsPriceList`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Edit banner image
export function EditBanner(params) {
  return request({
    url: `editBannerbyAdmin`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Delete banner image
export function DelBanner(params) {
  return request({
    url: `delBannerbyAdmin`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Get shipping address
export function GetAddressList(params) {
  return request({
    url: `getUserAddressList`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Add category
export function AddCategory(params) {
  return request({
    url: `addModCategorybyAdmin`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Edit category
export function EditCategory(params) {
  return request({
    url: `editModCategorybyAdmin`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Delete category
export function DelCategory(params) {
  return request({
    url: `delModCategorybyAdmin`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Get category list
export function GetCategoryList(params) {
  return request({
    url: `getModCategoryListbyAdmin`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Get order status
export function GetOrderListbyStatus(params) {
  return request({
    url: `getOrderListbyStatus`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Get order details
export function GetOrderDetail(params) {
  return request({
    url: `getOrderDetail`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Cancel order
export function CanceOrder(params) {
  return request({
    url: `canceOrder`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Get product details
export function GetSpu(params) {
  return request({
    url: `getSpu`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Search products
export function SearchSpu(params) {
  return request({
    url: `searchSpu`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

/** Search by image */
export function GetSpuImagesearch(params) {
  return request({
    url: `getSpuImagesearch`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

/**
 * Add user search history
 * 
 * Similar to于event tracking.No need to关注调用结果
 *  */ 
export function AddSpuHistoryImgsearch(params) {
  return request({
    url: `addSpuHistoryImgsearch`,
    method: "POST",
    data: params,
  });
}

/**
 * Upload file to OSS
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


// Get product list
export function GetSpuList(params) {
  return request({
    url: `getSpuList`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

/**
 * Get multiple products list
 */
export function GetSpuListByIds(params) {
  return request({
    url: `getSpuListByIds`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Get category list
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

// ──────────────────────────────────────────────
// Comment Agent API — for ground agent tool
// ──────────────────────────────────────────────

/**
 * Analyze a social media post and generate comment or sourcing alert.
 */
export function AnalyzeCommentAgentPost(params) {
  return request({
    url: `comment-agent/analyze-post`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

/**
 * Preview analysis only (no comment/alert generated).
 */
export function AnalyzeCommentAgentOnly(params) {
  return request({
    url: `comment-agent/analyze-only`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

/**
 * List comment leads.
 */
export function GetCommentLeads(params) {
  return request({
    url: `comment-agent/leads`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

/**
 * List sourcing alerts.
 */
export function GetSourcingAlerts(params) {
  return request({
    url: `comment-agent/alerts`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

/**
 * Confirm that a comment was posted.
 */
export function ConfirmCommentPosted(params) {
  return request({
    url: `comment-agent/leads/confirm-post`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

/**
 * Mark a sourcing alert's supplier as listed.
 */
export function MarkSupplierListed(params) {
  return request({
    url: `comment-agent/alerts/mark-listed`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

/**
 * Get HQ dashboard aggregated statistics.
 */
export function GetCommentAgentDashboard(params) {
  return request({
    url: `comment-agent/dashboard`,
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

// Get banner list
export function GetBannerList(params) {
  return request({
    url: `getBannerList`,
    method: "POST",
    data: params,
    auth: 0,
  });
}


// Get homepage category list
export function GetModCategoryList(params) {
  return request({
    url: `getModCategoryList`,
    method: "POST",
    data: params,
    auth: 0,
  });
}


// Get recommendations
export function GetRecommListbyTypes(params) {
  return request({
    url: `getRecommListbyTypes`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// User login
export function Login(params) {
  return request({
    url: `login`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

/** Get login QR code */
export function LoginQRCode(params) {
    return request({
    url: `loginQRCode`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

/** Check scan login status */
export function GetLoginCheckStatus(params) {
    return request({
    url: `loginCheckStatus`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// User registration
export function Registger(params) {
  return request({
    url: `registger`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Forgot password
export function Forget(params) {
  return request({
    url: `forget`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Google SSO — exchange Google ID token for app session
export function GoogleSSO(params) {
  return request({
    url: `google-sso`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Create verification code
export function AddVerifyCode(params) {
  return request({
    url: `addVerifyCode`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Get country list
export function GetCountryList(params) {
  return request({
    url: `getCountryList`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Get store details
export function GetStore(params) {
  return request({
    url: `getStore`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Get subcategories
export function GetCategoryChildenList(params) {
  return request({
    url: `getCategoryChildenList`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Get store product list (uses getSpuList backend route)
export function GetStoreSpuList(params) {
  return request({
    url: `getSpuList`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Get product collection
export function GetSpuCollection(params) {
  return request({
    url: `getSpuCollection`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Add product collection
export function AddSpuCollection(params) {
  return request({
    url: `addSpuCollection`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Get product collectionlist
export function GetSpuCollectionList(params) {
  return request({
    url: `getSpuCollectionList`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Delete product collection
export function DelSpuCollection(params) {
  return request({
    url: `delSpuCollection`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Get OSS direct upload token
export function GetOssPolicyToken(params) {
  return request({
    url: `getOssPolicyToken`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Add local OSS file
export function AddOssFile(params) {
  return request({
    url: `addOssFile`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Register Easemob customer service user
export function RegisterEasemodUser(params) {
  return request({
    url: `registerEasemodUser`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Add user chat record
export function AddMyImChat(params) {
  return request({
    url: `addImChat`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Get IM chat record
export function GetMyImChatList(params) {
  return request({
    url: `getImChatList`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Get user list by store ID
export function GetUserListbyStoreId(params) {
  return request({
    url: `getUserListbyStoreId`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Upload prepayment attachment
export function PrepaymentAttach(params) {
  return request({
    url: `prepaymentAttach`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Search store
export function GetStorebyName(params) {
  return request({
    url: `getStorebyName`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Get exchange rate
export function GetExchateRateMap(params) {
  return request({
    url: `getExchateRateMap`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Get product list
export function GetSpuListbyNewproduct(params) {
  return request({
    url: `getSpuList`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

/**
 * Smart recommendation - You may also like / AI product matching
 * 
 * - Pass inproduct name, Returns商品 id
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

/** Get subcategory list by name */
export function GetCategoryByName(params) {
  return request({
    url: `getCategoryByName`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// ID card real-name verification
export function IdCardCheck(params) {
  return request({
    url: `idCardCheck`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Get verification status
export function GetCheckStatus(params) {
  return request({
    url: `getCheckStatus`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Get video liveness H5 link
export function LifeCheckLink(params) {
  return request({
    url: `lifeCheckLink`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// ID card real-name verification(阿里云数聚)
export function ShuJuIdCardCheck(params) {
  return request({
    url: `shuJuIdCardCheck`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Face ID comparison verification
export function FaceIdCardCompare(params) {
  return request({
    url: `faceIdCardCompare`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Send SMS verification code
export function SmsSend(params) {
  return request({
    url: `smsSend`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Verify SMS code
export function SmsVerify(params) {
  return request({
    url: `smsVerify`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// ID card real-name verification
export function Certification(params) {
  return request({
    url: `certification`,
    method: "POST",
    data: params,
    auth: 1,
  });
}

// Get logistics channel price list
export function GetLogisticChannelList(params) {
  return request({
    url: `getLogisticChannelList`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Get city list
export function GetCityList(params) {
  return request({
    url: `getCityList`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Delete cart item
export function DelCart(params) {
  return request({
    url: `delCart`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Update cart item
export function UpdateCart(params) {
  return request({
    url: `updateCart`,
    method: "POST",
    data: params,
    auth: 0,
  });
}


// Get order payment list
export function GetOrderPayList(params) {
  return request({
    url: `getOrderPayList`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Fetch city list
export function GetAreabyAName(params) {
  return request({
    url: `getAreabyAName`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Create verification code V2
export function AddVerifyCodeV2(params) {
  return request({
    url: `addVerifyCodeV2`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Update email or phone
export function UpdateUserPhoneOrEmail(params) {
  return request({
    url: `updateUserPhoneOrEmail`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Update user clothing size
export function UpdateUserClothSize(params) {
  return request({
    url: `updateUserClothSize`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

// Get city list
export function GeCountryV2List(params) {
  return request({
    url: `geCountryV2List`,
    method: "POST",
    data: params,
    auth: 0,
  });
}


// Get region and city list by country ID
export function GetStateAndCityListByCountryId(params) {
  return request({
    url: `getStateAndCityListByCountryId`,
    method: "POST",
    data: params,
    auth: 0,
  });
}

/** Get own share code */
export function GetShareCode() {
    return request({
    url: `getShareCode`,
    method: "GET",
    data: {},
    auth: 1,
  }); 
}

/** Add product share link visit record */
export function AddShareLinks(params) {
  return request({
    url: `addShareLinks`,
    method: "POST",
    data: params,
    ignoreError: true,
    auth: 1,
  });
}