const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { VerificationCode } = require('../../common/database/models');
const { success } = require('../../common/utils/apiResponse');
const logger = require('../../common/logger/logger');

// ---- QR Code Login ----
router.post('/loginQRCode', async (req, res, next) => {
  try {
    const qrId = uuidv4();
    // In production: generate actual QR code and associate with session
    return success(res, {
      qrId,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrId}`,
      expiresIn: 120,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/loginCheckStatus', async (req, res, next) => {
  try {
    // In production: check Redis for scanned status
    return success(res, {
      scanned: false,
      confirmed: false,
      message: 'Waiting for scan',
    });
  } catch (err) {
    next(err);
  }
});

// ---- Verification Codes ----
router.post('/addVerifyCode', async (req, res, next) => {
  try {
    const { email, phone, type } = req.body;
    const code = String(Math.floor(100000 + Math.random() * 900000)); // 6-digit

    await VerificationCode.create({
      email: email || null,
      phone: phone || null,
      code,
      type: type || 'register',
      expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    logger.info(`[DEV] Verification code for ${email || phone}: ${code}`);

    return success(res, { message: 'Verification code sent' });
  } catch (err) {
    next(err);
  }
});

router.post('/addVerifyCodeV2', async (req, res, next) => {
  try {
    const { email, phone, type } = req.body;
    const code = String(Math.floor(100000 + Math.random() * 900000));

    await VerificationCode.create({
      email: email || null,
      phone: phone || null,
      code,
      type: type || 'register',
      expires_at: new Date(Date.now() + 10 * 60 * 1000),
    });

    logger.info(`[DEV] V2 Verification code for ${email || phone}: ${code}`);

    return success(res, { message: 'Verification code sent' });
  } catch (err) {
    next(err);
  }
});

// ---- Countries / Cities ----
router.post('/geCountryV2List', async (req, res, next) => {
  try {
    const countries = [
      { id: 1, name: 'China', code: 'CN', phoneCode: '+86' },
      { id: 2, name: 'Guinea', code: 'GN', phoneCode: '+224' },
      { id: 3, name: 'Senegal', code: 'SN', phoneCode: '+221' },
      { id: 4, name: 'Ghana', code: 'GH', phoneCode: '+233' },
      { id: 5, name: "Côte d'Ivoire", code: 'CI', phoneCode: '+225' },
      { id: 6, name: 'Cameroon', code: 'CM', phoneCode: '+237' },
      { id: 7, name: 'Sierra Leone', code: 'SL', phoneCode: '+232' },
      { id: 8, name: 'Kenya', code: 'KE', phoneCode: '+254' },
      { id: 9, name: 'Zimbabwe', code: 'ZW', phoneCode: '+263' },
      { id: 10, name: 'Nigeria', code: 'NG', phoneCode: '+234' },
      { id: 11, name: 'South Africa', code: 'ZA', phoneCode: '+27' },
      { id: 12, name: 'United States', code: 'US', phoneCode: '+1' },
    ];
    return success(res, { rows: countries });
  } catch (err) {
    next(err);
  }
});

router.post('/getCityList', async (req, res, next) => {
  try {
    return success(res, { rows: [] });
  } catch (err) {
    next(err);
  }
});

router.post('/getStateAndCityListByCountryId', async (req, res, next) => {
  try {
    return success(res, { rows: [] });
  } catch (err) {
    next(err);
  }
});

router.post('/getAreabyAName', async (req, res, next) => {
  try {
    return success(res, { rows: [] });
  } catch (err) {
    next(err);
  }
});

router.post('/getCountryList', async (req, res, next) => {
  try {
    return success(res, { rows: [] });
  } catch (err) {
    next(err);
  }
});

// ---- Module Categories (Homepage) ----
router.post('/getModCategoryList', async (req, res, next) => {
  try {
    return success(res, { rows: [] });
  } catch (err) {
    next(err);
  }
});

// IMPORTANT: Match frontend's exact URL path — the frontend has a typo "Childen" not "Children"
router.post('/getCategoryChildenList', async (req, res, next) => {
  try {
    return success(res, { rows: [] });
  } catch (err) {
    next(err);
  }
});

router.post('/getCategoryByName', async (req, res, next) => {
  try {
    return success(res, { rows: [] });
  } catch (err) {
    next(err);
  }
});

// ---- Order helpers ----
router.post('/getOrderListbyIds', async (req, res, next) => {
  try {
    const { Order } = require('../../common/database/models');
    const orders = await Order.findAll({
      where: { id: req.body.ids || [] },
    });
    return success(res, { rows: orders });
  } catch (err) {
    next(err);
  }
});

router.post('/getOrderPayList', async (req, res, next) => {
  try {
    return success(res, { rows: [] });
  } catch (err) {
    next(err);
  }
});

router.post('/getOrderUserIsOnePay', async (req, res, next) => {
  try {
    return success(res, { isFirstPurchase: false });
  } catch (err) {
    next(err);
  }
});

// ---- Identity Verification (stubs) ----
router.post('/idCardCheck', async (req, res, next) => {
  try {
    return success(res, { status: 'pending' });
  } catch (err) {
    next(err);
  }
});

router.post('/getCheckStatus', async (req, res, next) => {
  try {
    return success(res, { status: 'pending' });
  } catch (err) {
    next(err);
  }
});

router.post('/lifeCheckLink', async (req, res, next) => {
  try {
    return success(res, { url: '' });
  } catch (err) {
    next(err);
  }
});

router.post('/shuJuIdCardCheck', async (req, res, next) => {
  try {
    return success(res, { status: 'pending' });
  } catch (err) {
    next(err);
  }
});

router.post('/faceIdCardCompare', async (req, res, next) => {
  try {
    return success(res, { status: 'pending' });
  } catch (err) {
    next(err);
  }
});

router.post('/certification', async (req, res, next) => {
  try {
    return success(res, { status: 'pending' });
  } catch (err) {
    next(err);
  }
});

router.post('/smsSend', async (req, res, next) => {
  try {
    return success(res, { message: 'SMS sent' });
  } catch (err) {
    next(err);
  }
});

router.post('/smsVerify', async (req, res, next) => {
  try {
    return success(res, { verified: true });
  } catch (err) {
    next(err);
  }
});

// ---- Image Search (stubs) ----
router.post('/getSpuImagesearch', async (req, res, next) => {
  try {
    return success(res, { rows: [] });
  } catch (err) {
    next(err);
  }
});

router.post('/addSpuHistoryImgsearch', async (req, res, next) => {
  try {
    return success(res, { message: 'Logged' });
  } catch (err) {
    next(err);
  }
});

// ---- User updates ----
router.post('/updateUserPhoneOrEmail', async (req, res, next) => {
  try {
    return success(res, { message: 'Updated' });
  } catch (err) {
    next(err);
  }
});

// ---- Prepayment ----
router.post('/prepaymentAttach', async (req, res, next) => {
  try {
    return success(res, { message: 'Attachment recorded' });
  } catch (err) {
    next(err);
  }
});

// ---- Exchange Rates ----
router.post('/getExchateRateMap', async (req, res, next) => {
  try {
    return success(res, { USD: 1.0 });
  } catch (err) {
    next(err);
  }
});

// ---- AI Recommendations ----
router.post('/getIntelligentRecommend', async (req, res, next) => {
  try {
    return success(res, { ids: [] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
