const { Logistics } = require('../../common/database/models');

async function addLogistics(userId, data) {
  return Logistics.create({ ...data, user_id: userId });
}

async function getLogistics(userId) {
  return Logistics.findAll({ where: { user_id: userId } });
}

async function getPriceList() {
  // Mock: return placeholder pricing
  return [
    { id: 1, name: 'Standard Shipping (18-25 days)', price: 1500, currency: 'USD' },
    { id: 2, name: 'Express Shipping (10-15 days)', price: 3500, currency: 'USD' },
    { id: 3, name: 'Premium Shipping (5-8 days)', price: 6500, currency: 'USD' },
  ];
}

async function getChannels() {
  return [
    { id: 1, name: 'DHL Express', code: 'DHL' },
    { id: 2, name: 'FedEx', code: 'FEDEX' },
    { id: 3, name: 'UPS', code: 'UPS' },
    { id: 4, name: 'Sea Freight', code: 'SEA' },
    { id: 5, name: 'Air Freight', code: 'AIR' },
  ];
}

module.exports = {
  addLogistics,
  getLogistics,
  getPriceList,
  getChannels,
};
