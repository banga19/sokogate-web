const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Collection = sequelize.define('Collection', {
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
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'products', key: 'id' },
  },
}, {
  tableName: 'collections',
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'product_id'],
    },
  ],
});

module.exports = Collection;
