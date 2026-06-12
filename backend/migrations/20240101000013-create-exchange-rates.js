'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('exchange_rates', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      base_currency: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      target_currency: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      rate: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Unique constraint on (base_currency, target_currency)
    await queryInterface.addIndex('exchange_rates', ['base_currency', 'target_currency'], {
      unique: true,
      name: 'exchange_rates_pair_unique',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex('exchange_rates', 'exchange_rates_pair_unique');
    await queryInterface.dropTable('exchange_rates');
  },
};
