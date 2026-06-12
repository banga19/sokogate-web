'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      store_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'stores', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      name: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      images: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      video_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      attributes: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      min_price: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Price in cents',
      },
      max_price: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Price in cents',
      },
      moq: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        comment: 'Minimum order quantity',
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      status: {
        type: Sequelize.ENUM('draft', 'active', 'inactive'),
        defaultValue: 'draft',
      },
      view_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      sale_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('products');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_products_status;');
  },
};
