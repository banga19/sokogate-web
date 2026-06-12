const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Banner = sequelize.define('Banner', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  link_url: {
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
  tableName: 'banners',
  underscored: true,
});

module.exports = Banner;
