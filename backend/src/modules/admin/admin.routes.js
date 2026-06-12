const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../../common/middleware/auth.middleware');
const { Banner } = require('../../common/database/models');
const { Category } = require('../../common/database/models');
const { success, created } = require('../../common/utils/apiResponse');

// ---- Category Management ----
router.post('/addModCategorybyAdmin', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const cat = await Category.create(req.body);
    return created(res, cat);
  } catch (err) {
    next(err);
  }
});

router.post('/editModCategorybyAdmin', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const cat = await Category.findByPk(req.body.id);
    if (!cat) return res.status(404).json({ errcode: 40400, errmsg: 'Category not found' });
    await cat.update(req.body);
    return success(res, cat);
  } catch (err) {
    next(err);
  }
});

router.post('/delModCategorybyAdmin', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const cat = await Category.findByPk(req.body.id);
    if (!cat) return res.status(404).json({ errcode: 40400, errmsg: 'Category not found' });
    cat.is_active = false;
    await cat.save();
    return success(res, { message: 'Category deactivated' });
  } catch (err) {
    next(err);
  }
});

router.post('/getModCategoryListbyAdmin', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const cats = await Category.findAll({ order: [['sort_order', 'ASC']] });
    return success(res, { rows: cats });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
