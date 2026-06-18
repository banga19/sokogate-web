/**
 * Backfill Embeddings Script
 *
 * Generates pgvector embeddings for all existing products that don't have one yet.
 *
 * Usage:
 *   node scripts/backfill-embeddings.js                    # Dry run (preview only)
 *   node scripts/backfill-embeddings.js --apply            # Actually generate + save embeddings
 *   node scripts/backfill-embeddings.js --apply --force    # Re-generate even products that already have embeddings
 *
 * Environment:
 *   NVIDIA_API_KEY must be set
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const { Sequelize, Op, DataTypes } = require('sequelize');
require('pgvector/sequelize');
const config = require('../src/config');
const embeddingService = require('../src/modules/commentAgent/embeddingService');
const logger = require('../src/common/logger/logger');

const BATCH_SIZE = 10;   // Process N products at a time (NVIDIA rate limit)
const DELAY_MS = 2000;    // Delay between batches to avoid rate limiting

async function main() {
  const args = process.argv.slice(2);
  const applyFlag = args.includes('--apply');
  const forceFlag = args.includes('--force');

  if (!config.nvidia.apiKey) {
    console.error('ERROR: NVIDIA_API_KEY is not set. Please add it to your .env file.');
    process.exit(1);
  }

  console.log(`🔍 Product embedding backfill`);
  console.log(`   Mode: ${applyFlag ? (forceFlag ? 'FORCE re-generate all' : 'Generate missing only') : 'DRY RUN (pass --apply to execute)'}`);
  console.log(`   Batch size: ${BATCH_SIZE}`);
  console.log(`   Model: ${embeddingService.EMBEDDING_MODEL} (${embeddingService.EMBEDDING_DIMENSIONS}d)`);
  console.log('');

  // Connect directly (not through the Sequelize instance in models, to keep it isolated)
  const sequelize = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password,
    {
      host: config.db.host,
      port: config.db.port,
      dialect: 'postgres',
      logging: false,
    }
  );

  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');
    console.log('');

    // Count products needing embeddings
    const whereClause = forceFlag
      ? { status: 'active' }
      : { status: 'active', embedding: null };

    const totalCount = await sequelize.query(
      `SELECT COUNT(*) as count FROM products WHERE status = 'active'` + (forceFlag ? '' : ` AND embedding IS NULL`),
      { type: Sequelize.QueryTypes.SELECT }
    );
    const count = parseInt(totalCount[0].count, 10);

    if (count === 0) {
      console.log('✅ All active products already have embeddings.');
      if (!forceFlag) {
        console.log('   Use --force to re-generate existing embeddings.');
      }
      await sequelize.close();
      return;
    }

    console.log(`📊 Products to process: ${count}`);
    console.log('');

    // Fetch products in batches
    let offset = 0;
    let processed = 0;
    let errors = 0;

    while (offset < count) {
      const query = `
        SELECT id, name, description, tags, status
        FROM products
        WHERE status = 'active'
        ${forceFlag ? '' : 'AND embedding IS NULL'}
        ORDER BY created_at ASC
        LIMIT ${BATCH_SIZE} OFFSET ${offset}
      `;

      const products = await sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });

      if (products.length === 0) break;

      console.log(`   Batch ${Math.floor(offset / BATCH_SIZE) + 1}/${Math.ceil(count / BATCH_SIZE)} (${offset + 1}-${offset + products.length} of ${count})`);

      for (const product of products) {
        try {
          const embedding = await embeddingService.generateProductEmbedding(product);

          // Guard: ensure all embedding values are numeric before SQL injection
          if (!Array.isArray(embedding) || !embedding.every(v => typeof v === 'number' && isFinite(v))) {
            throw new Error(`Invalid embedding generated for product ${product.id}: non-numeric value`);
          }
          const embeddingStr = `[${embedding.join(',')}]`;

          if (applyFlag) {
            await sequelize.query(
              `UPDATE products SET embedding = '${embeddingStr}'::vector WHERE id = '${product.id}'`,
              { type: Sequelize.QueryTypes.UPDATE }
            );
          }

          processed++;
          const nameDisplay = (product.name || '').slice(0, 50);
          console.log(`   ${applyFlag ? '✅' : '🔶'} [${processed}/${count}] "${nameDisplay}..."`);
        } catch (err) {
          errors++;
          const nameDisplay = (product.name || '').slice(0, 50);
          console.error(`   ❌ [${processed + errors}] "${nameDisplay}..." — ${err.message}`);
        }
      }

      offset += BATCH_SIZE;

      if (offset < count) {
        console.log(`   ⏳ Waiting ${DELAY_MS}ms before next batch...`);
        await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
      }
    }

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🏁 Complete!`);
    console.log(`   Processed: ${processed}`);
    console.log(`   Errors:    ${errors}`);

    if (!applyFlag) {
      console.log('');
      console.log('⚠️  This was a DRY RUN. No embeddings were saved.');
      console.log('   Run with --apply to actually generate and store embeddings.');
    }

  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

main();
