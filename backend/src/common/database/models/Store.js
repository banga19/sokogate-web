const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  owner_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  logo_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  banner_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  contact_email: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  contact_phone: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
}, {
  tableName: 'stores',
  underscored: true,
});

module.exports = Store;
