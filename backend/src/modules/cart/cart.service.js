const { CartItem, Product, ProductVariant } = require('../../common/database/models');
const { NotFoundError } = require('../../common/utils/errors');

async function getCartList(userId) {
  return CartItem.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Product,
        attributes: ['id', 'name', 'images', 'min_price', 'max_price', 'status'],
      },
      {
        model: ProductVariant,
        attributes: ['id', 'sku_code', 'attributes', 'price', 'stock', 'images'],
      },
    ],
    order: [['created_at', 'DESC']],
  });
}

async function upsertCartItem(userId, data) {
  const { product_id, variant_id, quantity } = data;

  // Verify product exists
  const product = await Product.findByPk(product_id);
  if (!product || product.status !== 'active') {
    throw new NotFoundError('Product not found');
  }

  // Find existing cart item
  const existing = await CartItem.findOne({
    where: { user_id: userId, variant_id },
  });

  if (existing) {
    existing.quantity += quantity;
    await existing.save();
    return existing;
  }

  return CartItem.create({
    user_id: userId,
    product_id,
    variant_id,
    quantity,
  });
}

async function updateCartItem(userId, cartItemId, data) {
  const item = await CartItem.findOne({
    where: { id: cartItemId, user_id: userId },
  });
  if (!item) {
    throw new NotFoundError('Cart item not found');
  }
  if (data.quantity <= 0) {
    await item.destroy();
    return { message: 'Item removed from cart' };
  }
  item.quantity = data.quantity;
  await item.save();
  return item;
}

async function deleteCartItem(userId, cartItemId) {
  const item = await CartItem.findOne({
    where: { id: cartItemId, user_id: userId },
  });
  if (!item) {
    throw new NotFoundError('Cart item not found');
  }
  await item.destroy();
  return { message: 'Item removed from cart' };
}

module.exports = {
  getCartList,
  upsertCartItem,
  updateCartItem,
  deleteCartItem,
};
