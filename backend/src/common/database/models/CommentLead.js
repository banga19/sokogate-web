const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const CommentLead = sequelize.define('CommentLead', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  agent_id: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Identifier for the ground agent who submitted the post',
  },
  agent_name: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  platform: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'e.g. facebook, linkedin, whatsapp',
  },
  post_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  post_url: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  comment_text: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'AI-generated comment for the agent to post',
  },
  analysis: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Full AI analysis result (intent, product, market, urgency, etc.)',
  },
  posted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether the agent confirmed they posted the comment',
  },
  posted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  outcome: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'e.g. pending, replied, converted',
  },
}, {
  tableName: 'comment_leads',
  underscored: true,
  paranoid: true,
});

module.exports = CommentLead;
