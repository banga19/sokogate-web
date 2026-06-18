const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const ScrapedPost = sequelize.define('ScrapedPost', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  platform: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['facebook', 'linkedin']],
    },
  },
  post_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  post_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  author_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  author_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  posted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  engagement: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // The Apify actor run that produced this post
  apify_run_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  apify_actor_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // Pipeline status: pending → analyzed → commented / alerted
  pipeline_status: {
    type: DataTypes.STRING(20),
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'analyzed', 'commented', 'alerted', 'skipped', 'error']],
    },
  },
  // Analysis result stored as JSON
  analysis: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  // FK to comment_lead if a comment was generated
  comment_lead_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  // FK to sourcing_alert if an alert was generated
  sourcing_alert_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  // Raw JSON from Apify (stored for debugging / reprocessing)
  raw_data: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  // Error message if pipeline failed
  error_message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Soft delete
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'scraped_posts',
  underscored: true,
  paranoid: true, // Soft delete via deleted_at
  indexes: [
    {
      name: 'scraped_posts_platform_idx',
      fields: ['platform'],
    },
    {
      name: 'scraped_posts_pipeline_status_idx',
      fields: ['pipeline_status'],
    },
    {
      name: 'scraped_posts_created_at_idx',
      fields: ['created_at'],
    },
    {
      name: 'scraped_posts_apify_run_idx',
      fields: ['apify_run_id'],
    },
  ],
});

module.exports = ScrapedPost;
