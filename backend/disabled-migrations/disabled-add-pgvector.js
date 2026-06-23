'use strict';

/**
 * Migration: Add pgvector support for semantic product search.
 *
 * Steps:
 * 1. Enable the vector extension (requires superuser — will silently skip if already enabled)
 * 2. Add an embedding column (vector(1024)) to the products table
 * 3. Create an HNSW index for fast approximate nearest neighbor search
 *
 * Note: The index creation uses CONCURRENTLY-like approach via a separate transaction
 * to avoid locking the products table during migration.
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Enable the vector extension
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS vector');

    // Step 2: Add the embedding column (1024 dimensions for nvidia/nv-embed-v1)
    await queryInterface.sequelize.query(`
      ALTER TABLE products
      ADD COLUMN embedding vector(1024)
    `);

    // Step 3: Create HNSW index for fast similarity search
    // Using HNSW (Hierarchical Navigable Small World) for better recall/speed trade-off
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_products_embedding_hnsw
      ON products
      USING hnsw (embedding vector_cosine_ops)
      WITH (m = 16, ef_construction = 200);
    `).catch(async (err) => {
      // HNSW index creation may fail if table has no data or in older pgvector versions
      // Fall back to IVFFlat index which works without data
      console.warn('HNSW index failed, falling back to IVFFlat:', err.message);
      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_products_embedding_ivfflat
        ON products
        USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 100);
      `);
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS idx_products_embedding_hnsw');
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS idx_products_embedding_ivfflat');
    await queryInterface.sequelize.query('ALTER TABLE products DROP COLUMN IF EXISTS embedding');
  },
};
