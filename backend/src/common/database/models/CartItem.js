const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const CartItem = sequelize.define('CartItem', {
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
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'products', key: 'id' },
  },
  variant_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'product_variants', key: 'id' },
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: { min: 1 },
  },
}, {
  tableName: 'cart_items',
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'variant_id'],
    },
  ],
});

module.exports = CartItem;
