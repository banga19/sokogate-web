'use strict';

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    // Deterministic UUIDs for idempotent seed re-runs
    const phoneId = 'd0000000-0000-0000-0000-000000000001';
    const tshirtId = 'd0000000-0000-0000-0000-000000000002';
    const blenderId = 'd0000000-0000-0000-0000-000000000003';

    const phoneVariants = [
      { id: 'd0000000-0000-0000-0000-000000000011', product_id: phoneId, sku_code: 'PHONE-BLK-128', attributes: JSON.stringify({ color: 'Black', storage: '128GB' }), price: 29999, stock: 100, weight: 200, images: JSON.stringify(['https://oss.sokogate.com/image/phone-black.jpg']), is_active: true },
      { id: 'd0000000-0000-0000-0000-000000000012', product_id: phoneId, sku_code: 'PHONE-WHT-128', attributes: JSON.stringify({ color: 'White', storage: '128GB' }), price: 29999, stock: 80, weight: 200, images: JSON.stringify(['https://oss.sokogate.com/image/phone-white.jpg']), is_active: true },
      { id: 'd0000000-0000-0000-0000-000000000013', product_id: phoneId, sku_code: 'PHONE-BLK-256', attributes: JSON.stringify({ color: 'Black', storage: '256GB' }), price: 34999, stock: 50, weight: 205, images: JSON.stringify(['https://oss.sokogate.com/image/phone-black.jpg']), is_active: true },
    ];

    const tshirtVariants = [
      { id: 'd0000000-0000-0000-0000-000000000021', product_id: tshirtId, sku_code: 'TSHIRT-S-RED', attributes: JSON.stringify({ size: 'S', color: 'Red' }), price: 1499, stock: 200, weight: 150, images: JSON.stringify(['https://oss.sokogate.com/image/tshirt-red.jpg']), is_active: true },
      { id: 'd0000000-0000-0000-0000-000000000022', product_id: tshirtId, sku_code: 'TSHIRT-M-RED', attributes: JSON.stringify({ size: 'M', color: 'Red' }), price: 1499, stock: 200, weight: 160, images: JSON.stringify(['https://oss.sokogate.com/image/tshirt-red.jpg']), is_active: true },
      { id: 'd0000000-0000-0000-0000-000000000023', product_id: tshirtId, sku_code: 'TSHIRT-L-RED', attributes: JSON.stringify({ size: 'L', color: 'Red' }), price: 1499, stock: 150, weight: 170, images: JSON.stringify(['https://oss.sokogate.com/image/tshirt-red.jpg']), is_active: true },
      { id: 'd0000000-0000-0000-0000-000000000024', product_id: tshirtId, sku_code: 'TSHIRT-M-BLK', attributes: JSON.stringify({ size: 'M', color: 'Black' }), price: 1599, stock: 180, weight: 160, images: JSON.stringify(['https://oss.sokogate.com/image/tshirt-black.jpg']), is_active: true },
    ];

    const blenderVariants = [
      { id: 'd0000000-0000-0000-0000-000000000031', product_id: blenderId, sku_code: 'BLEND-1L', attributes: JSON.stringify({ capacity: '1L', color: 'Silver' }), price: 3999, stock: 60, weight: 1500, images: JSON.stringify(['https://oss.sokogate.com/image/blender-1l.jpg']), is_active: true },
      { id: 'd0000000-0000-0000-0000-000000000032', product_id: blenderId, sku_code: 'BLEND-15L', attributes: JSON.stringify({ capacity: '1.5L', color: 'Silver' }), price: 4999, stock: 40, weight: 1800, images: JSON.stringify(['https://oss.sokogate.com/image/blender-15l.jpg']), is_active: true },
    ];

    // Insert products
    await queryInterface.bulkInsert('products', [
      {
        id: phoneId,
        store_id: 'b0000000-0000-0000-0000-000000000001',
        category_id: 'a0000000-0000-0000-0000-000000000111',
        name: 'ProMax Smartphone 6.5" 128GB/256GB',
        description: 'High-performance smartphone with 6.5-inch HD+ display, 48MP camera, dual SIM, 5000mAh battery. Perfect for the African market.',
        images: JSON.stringify([
          'https://oss.sokogate.com/image/phone-black.jpg',
          'https://oss.sokogate.com/image/phone-white.jpg',
        ]),
        video_url: null,
        attributes: JSON.stringify({ brand: 'ProMax', model: 'PM2024', screen: '6.5 inch', camera: '48MP', battery: '5000mAh' }),
        min_price: 29999,
        max_price: 34999,
        moq: 10,
        tags: ['smartphone', 'android', 'dual-sim', '4g'],
        status: 'active',
        view_count: 1520,
        sale_count: 89,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        id: tshirtId,
        store_id: 'b0000000-0000-0000-0000-000000000001',
        category_id: 'a0000000-0000-0000-0000-000000000211',
        name: 'Classic Cotton T-Shirt — Premium Quality',
        description: '100% premium cotton t-shirt. Breathable, comfortable, and durable. Available in multiple sizes and colors. Perfect for wholesale orders.',
        images: JSON.stringify([
          'https://oss.sokogate.com/image/tshirt-red.jpg',
          'https://oss.sokogate.com/image/tshirt-black.jpg',
        ]),
        video_url: null,
        attributes: JSON.stringify({ material: '100% Cotton', weight_gsm: '180', fit: 'Regular', neck: 'Round' }),
        min_price: 1499,
        max_price: 1599,
        moq: 50,
        tags: ['t-shirt', 'cotton', 'wholesale', 'fashion'],
        status: 'active',
        view_count: 3400,
        sale_count: 560,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        id: blenderId,
        store_id: 'b0000000-0000-0000-0000-000000000001',
        category_id: 'a0000000-0000-0000-0000-000000000031',
        name: 'Multi-Function Blender 1L/1.5L',
        description: 'Powerful 1000W blender with 6 stainless steel blades. Perfect for smoothies, soups, and sauces. 2-speed settings with pulse function.',
        images: JSON.stringify([
          'https://oss.sokogate.com/image/blender-1l.jpg',
          'https://oss.sokogate.com/image/blender-15l.jpg',
        ]),
        video_url: null,
        attributes: JSON.stringify({ power: '1000W', material: 'Stainless Steel', speeds: '2 + Pulse', voltage: '220V' }),
        min_price: 3999,
        max_price: 4999,
        moq: 20,
        tags: ['blender', 'kitchen', 'appliance', 'wholesale'],
        status: 'active',
        view_count: 890,
        sale_count: 45,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
    ]);

    // Insert product variants
    await queryInterface.bulkInsert('product_variants', [
      ...phoneVariants,
      ...tshirtVariants,
      ...blenderVariants,
    ].map((v) => ({
      ...v,
      volume_cbm: null,
      created_at: now,
      updated_at: now,
    })));
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('product_variants', null, {});
    await queryInterface.bulkDelete('products', null, {});
  },
};
