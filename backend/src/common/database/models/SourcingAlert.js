const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const SourcingAlert = sequelize.define('SourcingAlert', {
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
  },
  post_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  product: {
    type: DataTypes.STRING(500),
    allowNull: false,
    comment: 'Extracted product name from AI analysis',
  },
  market: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: 'Detected country/region',
  },
  urgency: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'high, medium, or low',
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  why_no_match: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Reason the product was not found in the catalog',
  },
  alert_text: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'AI-generated sourcing alert body',
  },
  email_sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  email_failed: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: null,
  },
  email_sent_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  supplier_listed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether HQ has sourced and listed the supplier',
  },
  supplier_listed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'sourcing_alerts',
  underscored: true,
  paranoid: true,
});

module.exports = SourcingAlert;
