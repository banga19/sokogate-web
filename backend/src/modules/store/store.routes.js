const express = require('express');
const router = express.Router();
const controller = require('./store.controller');

router.post('/getStore', controller.getStore);
router.post('/getStorebyName', controller.getStorebyName);
router.post('/getStoreProducts', controller.getStoreProducts);

module.exports = router;
