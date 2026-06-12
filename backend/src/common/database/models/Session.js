const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Session = sequelize.define('Session', {
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
  token: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  refresh_token: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  device_info: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  ip_address: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  tableName: 'sessions',
  underscored: true,
});

module.exports = Session;
