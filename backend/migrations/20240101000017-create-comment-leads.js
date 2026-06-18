'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comment_leads', {
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
      post_url: {
        type: Sequelize.STRING(1000),
        allowNull: true,
      },
      comment_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      analysis: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      posted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      posted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      outcome: {
        type: Sequelize.STRING(50),
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

    // Index for querying by agent
    await queryInterface.addIndex('comment_leads', ['agent_id'], {
      name: 'idx_comment_leads_agent_id',
    });

    // Index for querying by platform
    await queryInterface.addIndex('comment_leads', ['platform'], {
      name: 'idx_comment_leads_platform',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('comment_leads');
  },
};
