'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('scraped_posts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      platform: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'facebook, linkedin, whatsapp',
      },
      post_external_id: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'Original post ID from the platform',
      },
      post_url: {
        type: Sequelize.STRING(2000),
        allowNull: true,
      },
      author_name: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'Name of the person who made the post',
      },
      author_profile_url: {
        type: Sequelize.STRING(2000),
        allowNull: true,
      },
      group_name: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'Facebook group or LinkedIn group name',
      },
      post_text: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'The full text of the scraped post',
      },
      post_images: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'Array of image URLs if any',
      },
      post_date: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Original post date from platform',
      },
      language: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: 'Detected language of the post',
      },
      scrape_source: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'e.g. apify-facebook, apify-linkedin, manual',
      },
      scrape_run_id: {
        type: Sequelize.STRING(200),
        allowNull: true,
        comment: 'Apify run ID that scraped this post',
      },
      status: {
        type: Sequelize.STRING(50),
        defaultValue: 'pending',
        comment: 'pending, analyzed, skipped, error',
      },
      analysis_result: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'Result from comment agent analysis (lead_id or alert_id)',
      },
      error_message: {
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

    await queryInterface.addIndex('scraped_posts', ['platform'], {
      name: 'idx_scraped_posts_platform',
    });
    await queryInterface.addIndex('scraped_posts', ['status'], {
      name: 'idx_scraped_posts_status',
    });
    await queryInterface.addIndex('scraped_posts', ['scrape_run_id'], {
      name: 'idx_scraped_posts_run_id',
    });
    await queryInterface.addIndex('scraped_posts', ['post_external_id'], {
      name: 'idx_scraped_posts_external_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('scraped_posts');
  },
};
