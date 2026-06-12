'use strict';

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    const categories = [
      // Level 0: Top-level categories
      { id: 'a0000000-0000-0000-0000-000000000001', parent_id: null, name: 'Electronics', slug: 'electronics', icon_url: 'icon-electronics', sort_order: 1, is_active: true },
      { id: 'a0000000-0000-0000-0000-000000000002', parent_id: null, name: 'Fashion', slug: 'fashion', icon_url: 'icon-fashion', sort_order: 2, is_active: true },
      { id: 'a0000000-0000-0000-0000-000000000003', parent_id: null, name: 'Home & Kitchen', slug: 'home-kitchen', icon_url: 'icon-home', sort_order: 3, is_active: true },
      { id: 'a0000000-0000-0000-0000-000000000004', parent_id: null, name: 'Health & Beauty', slug: 'health-beauty', icon_url: 'icon-beauty', sort_order: 4, is_active: true },
      // Level 1: Sub-categories of Electronics
      { id: 'a0000000-0000-0000-0000-000000000011', parent_id: 'a0000000-0000-0000-0000-000000000001', name: 'Mobile Phones', slug: 'mobile-phones', icon_url: null, sort_order: 1, is_active: true },
      { id: 'a0000000-0000-0000-0000-000000000012', parent_id: 'a0000000-0000-0000-0000-000000000001', name: 'Laptops & Computers', slug: 'laptops-computers', icon_url: null, sort_order: 2, is_active: true },
      { id: 'a0000000-0000-0000-0000-000000000013', parent_id: 'a0000000-0000-0000-0000-000000000001', name: 'Audio & Headphones', slug: 'audio-headphones', icon_url: null, sort_order: 3, is_active: true },
      // Level 1: Sub-categories of Fashion
      { id: 'a0000000-0000-0000-0000-000000000021', parent_id: 'a0000000-0000-0000-0000-000000000002', name: "Men's Clothing", slug: 'mens-clothing', icon_url: null, sort_order: 1, is_active: true },
      { id: 'a0000000-0000-0000-0000-000000000022', parent_id: 'a0000000-0000-0000-0000-000000000002', name: "Women's Clothing", slug: 'womens-clothing', icon_url: null, sort_order: 2, is_active: true },
      { id: 'a0000000-0000-0000-0000-000000000023', parent_id: 'a0000000-0000-0000-0000-000000000002', name: 'Shoes', slug: 'shoes', icon_url: null, sort_order: 3, is_active: true },
      // Level 1: Sub-categories of Home & Kitchen
      { id: 'a0000000-0000-0000-0000-000000000031', parent_id: 'a0000000-0000-0000-0000-000000000003', name: 'Kitchen Appliances', slug: 'kitchen-appliances', icon_url: null, sort_order: 1, is_active: true },
      { id: 'a0000000-0000-0000-0000-000000000032', parent_id: 'a0000000-0000-0000-0000-000000000003', name: 'Furniture', slug: 'furniture', icon_url: null, sort_order: 2, is_active: true },
      // Level 2: Sub-sub categories
      { id: 'a0000000-0000-0000-0000-000000000111', parent_id: 'a0000000-0000-0000-0000-000000000011', name: 'Smartphones', slug: 'smartphones', icon_url: null, sort_order: 1, is_active: true },
      { id: 'a0000000-0000-0000-0000-000000000112', parent_id: 'a0000000-0000-0000-0000-000000000011', name: 'Accessories', slug: 'phone-accessories', icon_url: null, sort_order: 2, is_active: true },
      { id: 'a0000000-0000-0000-0000-000000000211', parent_id: 'a0000000-0000-0000-0000-000000000021', name: 'T-Shirts', slug: 't-shirts', icon_url: null, sort_order: 1, is_active: true },
    ];

    await queryInterface.bulkInsert('categories', categories.map((c) => ({
      ...c,
      created_at: now,
      updated_at: now,
    })));
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
