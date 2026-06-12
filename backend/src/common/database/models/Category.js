const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  parent_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'categories', key: 'id' },
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: true,
  },
  icon_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'categories',
  underscored: true,
});

module.exports = Category;
