'use strict';

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    await queryInterface.bulkInsert('banners', [
      {
        id: 'c0000000-0000-0000-0000-000000000001',
        title: 'Summer Sale — Up to 40% Off',
        image_url: 'https://oss.sokogate.com/image/banner-summer-sale.jpg',
        link_url: '/v2/product/list?categoryId=electronics',
        sort_order: 1,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'c0000000-0000-0000-0000-000000000002',
        title: 'New Arrivals: Fashion Collection',
        image_url: 'https://oss.sokogate.com/image/banner-fashion.jpg',
        link_url: '/v2/product/list?categoryId=fashion',
        sort_order: 2,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'c0000000-0000-0000-0000-000000000003',
        title: 'Free Shipping on Orders Over $200',
        image_url: 'https://oss.sokogate.com/image/banner-free-shipping.jpg',
        link_url: '/merchant-settlement',
        sort_order: 3,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('banners', null, {});
  },
};
