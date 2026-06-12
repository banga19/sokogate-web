const express = require('express');
const router = express.Router();
const { authenticate } = require('../../common/middleware/auth.middleware');
const { success } = require('../../common/utils/apiResponse');

router.get('/getShareCode', authenticate, async (req, res, next) => {
  try {
    const shareCode = req.user.id.slice(0, 8).toUpperCase();
    return success(res, { shareCode });
  } catch (err) {
    next(err);
  }
});

router.post('/addShareLinks', authenticate, async (req, res, next) => {
  try {
    return success(res, { message: 'Share recorded' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
