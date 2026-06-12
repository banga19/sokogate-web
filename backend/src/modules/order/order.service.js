const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { Order, CartItem, Product, ProductVariant, Address } = require('../../common/database/models');
const { NotFoundError } = require('../../common/utils/errors');
const { getPagination } = require('../../common/utils/pagination');

async function createOrder(userId, data) {
  const { items, shipping_address_id, logistics_id, currency, note } = data;

  // Calculate totals
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findByPk(item.product_id);
    if (!product) throw new NotFoundError(`Product ${item.product_id} not found`);

    let price = product.min_price;
    if (item.variant_id) {
      const variant = await ProductVariant.findByPk(item.variant_id);
      if (variant) price = variant.price;
    }

    subtotal += price * (item.quantity || 1);
    orderItems.push({
      product_id: item.product_id,
      variant_id: item.variant_id,
      quantity: item.quantity || 1,
      price,
      name: product.name,
    });
  }

  const orderNumber = `SO${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  return Order.create({
    user_id: userId,
    order_number: orderNumber,
    status: 'pending',
    items: orderItems,
    shipping_address_id,
    logistics_id,
    subtotal,
    shipping_cost: data.shipping_cost || 0,
    discount: data.discount || 0,
    total: subtotal + (data.shipping_cost || 0) - (data.discount || 0),
    currency: currency || 'USD',
    payment_status: 'unpaid',
    note,
  });
}

async function getOrdersByStatus(userId, status, params = {}) {
  const { page, pageSize, offset, limit } = getPagination(params.page, params.pageSize);
  const where = { user_id: userId };
  if (status) where.status = status;

  const { count, rows } = await Order.findAndCountAll({
    where,
    offset,
    limit,
    order: [['created_at', 'DESC']],
  });

  return { rows, total: count, page, pageSize };
}

async function getOrderDetail(userId, orderId) {
  const order = await Order.findOne({
    where: { id: orderId, user_id: userId },
    include: [
      { model: Address, as: 'shippingAddress', attributes: { exclude: ['user_id'] } },
    ],
  });
  if (!order) throw new NotFoundError('Order not found');
  return order;
}

async function cancelOrder(userId, orderId) {
  const order = await Order.findOne({
    where: { id: orderId, user_id: userId, status: 'pending' },
  });
  if (!order) throw new NotFoundError('Order not found or cannot be cancelled');

  order.status = 'cancelled';
  await order.save();
  return order;
}

module.exports = {
  createOrder,
  getOrdersByStatus,
  getOrderDetail,
  cancelOrder,
};
