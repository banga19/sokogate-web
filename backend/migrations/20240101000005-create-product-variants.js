'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('product_variants', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      sku_code: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      attributes: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'e.g. {"color":"red","size":"XL"}',
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Price in cents',
      },
      stock: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      weight: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Weight in grams',
      },
      volume_cbm: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      images: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('product_variants');
  },
};
