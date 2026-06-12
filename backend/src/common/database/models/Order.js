const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  order_number: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(
      'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
    ),
    defaultValue: 'pending',
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  shipping_address_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'addresses', key: 'id' },
  },
  logistics_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'logistics', key: 'id' },
  },
  subtotal: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Price in cents',
  },
  shipping_cost: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Price in cents',
  },
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Price in cents',
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Price in cents',
  },
  currency: {
    type: DataTypes.STRING(10),
    defaultValue: 'USD',
  },
  exchange_rate: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  payment_method: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  payment_status: {
    type: DataTypes.ENUM('unpaid', 'paid', 'failed', 'refunded'),
    defaultValue: 'unpaid',
  },
  paid_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'orders',
  underscored: true,
  paranoid: true,
});

module.exports = Order;
