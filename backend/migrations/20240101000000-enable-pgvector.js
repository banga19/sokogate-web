'use strict';

/**
 * Migration: Enable pgvector extension
 *
 * Required by the Comment Agent's embeddingService.js for semantic product
 * search using cosine similarity (<=> operator).
 *
 * The extension is installed at the PostgreSQL cluster level (not per-database),
 * but CREATE EXTENSION ensures it's available in this database.
 */

module.exports = {
  async up(queryInterface) {
    // Enable pgvector extension for vector similarity search
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS vector');
  },

  async down(queryInterface) {
    // Only drop in test/dev — production data depends on this
    await queryInterface.sequelize.query('DROP EXTENSION IF EXISTS vector');
  },
};
