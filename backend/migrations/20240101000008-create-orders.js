'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      order_number: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
        ),
        defaultValue: 'pending',
      },
      items: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      shipping_address_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'addresses', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      logistics_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'logistics', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      subtotal: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Price in cents',
      },
      shipping_cost: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Price in cents',
      },
      discount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Price in cents',
      },
      total: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Price in cents',
      },
      currency: {
        type: Sequelize.STRING(10),
        defaultValue: 'USD',
      },
      exchange_rate: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      payment_method: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      payment_status: {
        type: Sequelize.ENUM('unpaid', 'paid', 'failed', 'refunded'),
        defaultValue: 'unpaid',
      },
      paid_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    await queryInterface.dropTable('orders');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_orders_status;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_orders_payment_status;');
  },
};
