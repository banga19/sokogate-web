const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

// Register pgvector type with Sequelize (optional - gracefully degrades in test/dev without pgvector)
try {
  require('pgvector/sequelize');
} catch (err) {
  // pgvector not available (e.g., in test environments without the extension)
  // The embedding column will still work with raw SQL queries when pgvector IS available
}

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  store_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'stores', key: 'id' },
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'categories', key: 'id' },
  },
  name: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  images: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  video_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  attributes: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  min_price: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Price in cents',
  },
  max_price: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Price in cents',
  },
  moq: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: 'Minimum order quantity',
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'inactive'),
    defaultValue: 'draft',
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  sale_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  embedding: {
    type: DataTypes.VECTOR(1024),
    allowNull: true,
    comment: 'Semantic embedding for AI-powered product matching (pgvector)',
  },
}, {
  tableName: 'products',
  underscored: true,
  paranoid: true,
});

module.exports = Product;
