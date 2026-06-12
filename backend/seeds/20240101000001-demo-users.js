'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    const passwordHash = await bcrypt.hash('Admin123!', 12);

    await queryInterface.bulkInsert('users', [
      {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'admin@sokogate.com',
        phone: '+8618800000001',
        password_hash: passwordHash,
        name: 'Admin',
        avatar_url: 'https://oss.sokogate.com/image/default-avatar.png',
        country_code: 'CN',
        role: 'admin',
        is_verified: true,
        cloth_size: null,
        onboarding_data: null,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        id: '00000000-0000-0000-0000-000000000002',
        email: 'seller@sokogate.com',
        phone: '+8618800000002',
        password_hash: passwordHash,
        name: 'Demo Seller',
        avatar_url: 'https://oss.sokogate.com/image/default-avatar.png',
        country_code: 'CN',
        role: 'seller',
        is_verified: true,
        cloth_size: null,
        onboarding_data: JSON.stringify({ companyName: 'Demo Trading Co., Ltd', businessType: 'manufacturer' }),
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        id: '00000000-0000-0000-0000-000000000003',
        email: 'buyer@sokogate.com',
        phone: '+233500000003',
        password_hash: passwordHash,
        name: 'Demo Buyer',
        avatar_url: 'https://oss.sokogate.com/image/default-avatar.png',
        country_code: 'GH',
        role: 'buyer',
        is_verified: true,
        cloth_size: JSON.stringify({ top: 'M', bottom: 'L', shoes: '42' }),
        onboarding_data: JSON.stringify({ referrer: 'friend', interests: ['electronics', 'fashion'] }),
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
