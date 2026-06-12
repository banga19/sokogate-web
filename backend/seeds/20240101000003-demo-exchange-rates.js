'use strict';

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    const rates = [
      { base: 'USD', target: 'XOF', rate: 611.50 },
      { base: 'USD', target: 'XAF', rate: 611.50 },
      { base: 'USD', target: 'GHS', rate: 15.20 },
      { base: 'USD', target: 'KES', rate: 145.00 },
      { base: 'USD', target: 'NGN', rate: 1550.00 },
      { base: 'USD', target: 'ZWL', rate: 322.00 },
      { base: 'USD', target: 'EUR', rate: 0.93 },
      { base: 'USD', target: 'GBP', rate: 0.79 },
      { base: 'USD', target: 'CNY', rate: 7.24 },
      { base: 'USD', target: 'SLL', rate: 21000.00 },
      { base: 'USD', target: 'GNF', rate: 8600.00 },
      { base: 'USD', target: 'CDF', rate: 2800.00 },
      { base: 'USD', target: 'ZAR', rate: 18.50 },
      { base: 'USD', target: 'MAD', rate: 10.05 },
    ];

    const rows = rates.map((r) => ({
      id: require('uuid').v4(),
      base_currency: r.base,
      target_currency: r.target,
      rate: r.rate,
      updated_at: now,
    }));

    await queryInterface.bulkInsert('exchange_rates', rows);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('exchange_rates', null, {});
  },
};
