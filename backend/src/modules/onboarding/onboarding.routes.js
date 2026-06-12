const express = require('express');
const router = express.Router();
const { authenticate } = require('../../common/middleware/auth.middleware');
const { User } = require('../../common/database/models');
const { success } = require('../../common/utils/apiResponse');

router.post('/submit', authenticate, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ errcode: 40400, errmsg: 'User not found' });
    user.onboarding_data = req.body;
    await user.save();
    return success(res, { message: 'Onboarding data saved' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
