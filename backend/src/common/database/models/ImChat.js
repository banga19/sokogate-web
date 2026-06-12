const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const ImChat = sequelize.define('ImChat', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  from_user_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  to_user_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  message_type: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  store_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'stores', key: 'id' },
  },
}, {
  tableName: 'im_chat_history',
  underscored: true,
});

module.exports = ImChat;
