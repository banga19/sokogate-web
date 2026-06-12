const express = require('express');
const router = express.Router();
const controller = require('./store.controller');

router.post('/getStore', controller.getStore);
router.post('/getStorebyName', controller.getStorebyName);

module.exports = router;
