const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const ExchangeRate = sequelize.define('ExchangeRate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  base_currency: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  target_currency: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  rate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'exchange_rates',
  underscored: true,
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: false,
});

module.exports = ExchangeRate;
