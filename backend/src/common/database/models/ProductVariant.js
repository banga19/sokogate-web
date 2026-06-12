const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const ProductVariant = sequelize.define('ProductVariant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'products', key: 'id' },
  },
  sku_code: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  attributes: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'e.g. {"color":"red","size":"XL"}',
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Price in cents',
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  weight: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Weight in grams',
  },
  volume_cbm: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  images: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'product_variants',
  underscored: true,
});

module.exports = ProductVariant;
