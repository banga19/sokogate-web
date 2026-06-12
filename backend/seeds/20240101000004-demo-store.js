'use strict';

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    await queryInterface.bulkInsert('stores', [
      {
        id: 'b0000000-0000-0000-0000-000000000001',
        owner_id: '00000000-0000-0000-0000-000000000002',
        name: 'Demo Global Trading',
        slug: 'demo-global-trading',
        description: 'Your trusted source for quality electronics, fashion, and home goods. Global shipping to Africa and worldwide.',
        logo_url: 'https://oss.sokogate.com/image/demo-store-logo.png',
        banner_url: 'https://oss.sokogate.com/image/demo-store-banner.png',
        contact_email: 'seller@sokogate.com',
        contact_phone: '+8618800000002',
        is_verified: true,
        rating: 4.5,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('stores', null, {});
  },
};
