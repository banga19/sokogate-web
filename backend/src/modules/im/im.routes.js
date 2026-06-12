const express = require('express');
const router = express.Router();
const { ImChat } = require('../../common/database/models');
const { success, created } = require('../../common/utils/apiResponse');

router.post('/registerEasemodUser', async (req, res, next) => {
  try {
    // In production, forward to Easemob API
    return success(res, { userId: req.body.username || `user_${Date.now()}` });
  } catch (err) {
    next(err);
  }
});

router.post('/addImChat', async (req, res, next) => {
  try {
    const chat = await ImChat.create(req.body);
    return created(res, chat);
  } catch (err) {
    next(err);
  }
});

router.post('/getImChatList', async (req, res, next) => {
  try {
    const chats = await ImChat.findAll({
      where: {
        from_user_id: req.body.from_user_id || req.body.userId,
      },
      order: [['created_at', 'DESC']],
      limit: 50,
    });
    return success(res, { rows: chats });
  } catch (err) {
    next(err);
  }
});

router.post('/getUserListbyStoreId', async (req, res, next) => {
  try {
    // Mock: return empty user list
    return success(res, { rows: [] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
