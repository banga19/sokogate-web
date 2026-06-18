'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn('sourcing_alerts', 'email_failed', {
        type: require('sequelize').BOOLEAN,
        allowNull: true,
        defaultValue: null,
      }, { transaction });
    });
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('sourcing_alerts', 'email_failed', { transaction });
    });
  },
};
