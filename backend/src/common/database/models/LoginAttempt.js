const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const LoginAttempt = sequelize.define('LoginAttempt', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  identifier: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Email or IP address used for the attempt',
  },
  attempt_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'email or ip',
  },
  attempts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  locked_until: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Account locked until this timestamp',
  },
}, {
  tableName: 'login_attempts',
  underscored: true,
  paranoid: true,
});

module.exports = LoginAttempt;
