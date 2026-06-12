const express = require('express');
const router = express.Router();
const controller = require('./collection.controller');
const { authenticate } = require('../../common/middleware/auth.middleware');

router.post('/getSpuCollection', authenticate, controller.getSpuCollection);
router.post('/addSpuCollection', authenticate, controller.addSpuCollection);
router.post('/getSpuCollectionList', authenticate, controller.getSpuCollectionList);
router.post('/delSpuCollection', authenticate, controller.delSpuCollection);

module.exports = router;
