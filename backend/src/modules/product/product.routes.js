const express = require('express');
const router = express.Router();
const controller = require('./product.controller');
const { validate } = require('../../common/middleware/validator.middleware');
const {
  getSpuListSchema,
  getSpuSchema,
  searchSpuSchema,
} = require('./product.validation');

router.post('/getSpuList', validate({ body: getSpuListSchema }), controller.getSpuList);
router.post('/getSpu', validate({ body: getSpuSchema }), controller.getSpu);
router.post('/getSpuListByIds', controller.getSpuListByIds);
router.post('/searchSpu', validate({ body: searchSpuSchema }), controller.searchSpu);
router.post('/getCategoryList', controller.getCategoryList);
router.post('/getRecommListbyTypes', controller.getRecommListbyTypes);

module.exports = router;
