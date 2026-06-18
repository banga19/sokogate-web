'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sourcing_alerts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      agent_id: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      agent_name: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      platform: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      post_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      product: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      market: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      urgency: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      why_no_match: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      alert_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      email_sent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      email_sent_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      supplier_listed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      supplier_listed_at: {
        type: Sequelize.DATE,
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

    await queryInterface.addIndex('sourcing_alerts', ['agent_id'], {
      name: 'idx_sourcing_alerts_agent_id',
    });

    await queryInterface.addIndex('sourcing_alerts', ['product'], {
      name: 'idx_sourcing_alerts_product',
    });

    await queryInterface.addIndex('sourcing_alerts', ['urgency'], {
      name: 'idx_sourcing_alerts_urgency',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sourcing_alerts');
  },
};
