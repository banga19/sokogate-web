const express = require('express');
const router = express.Router();
const controller = require('./user.controller');
const { authenticate } = require('../../common/middleware/auth.middleware');
const { validate } = require('../../common/middleware/validator.middleware');
const {
  addAddressSchema,
  editAddressSchema,
  updateProfileSchema,
} = require('./user.validation');

// Profile
router.get('/profile', authenticate, controller.getProfile);
router.post('/updateUserClothSize', authenticate, validate({ body: updateProfileSchema }), controller.updateProfile);

// Addresses
router.post('/getUserAddressList', authenticate, controller.getAddresses);
router.post('/addUserAddress', authenticate, validate({ body: addAddressSchema }), controller.addAddress);
router.post('/editUserAddress', authenticate, validate({ body: editAddressSchema }), controller.editAddress);
router.post('/delUserAddress', authenticate, controller.deleteAddress);

module.exports = router;
