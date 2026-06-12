const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: true,
    validate: { isEmail: true },
  },
  phone: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  avatar_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  country_code: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('buyer', 'seller', 'admin'),
    defaultValue: 'buyer',
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  cloth_size: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  onboarding_data: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  tableName: 'users',
  underscored: true,
  paranoid: true,
});

module.exports = User;
