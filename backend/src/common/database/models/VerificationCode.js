const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const VerificationCode = sequelize.define('VerificationCode', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'users', key: 'id' },
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('register', 'login', 'forgot', 'bind', 'verify'),
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  is_used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'verification_codes',
  underscored: true,
});

module.exports = VerificationCode;
