const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Upload = sequelize.define('Upload', {
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
  file_name: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  file_url: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  file_type: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  file_size: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  md5: {
    type: DataTypes.STRING(64),
    allowNull: true,
  },
}, {
  tableName: 'uploads',
  underscored: true,
  paranoid: true,
});

module.exports = Upload;
