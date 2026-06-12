const { Op } = require('sequelize');
const { User, Address } = require('../../common/database/models');
const { NotFoundError } = require('../../common/utils/errors');

async function getProfile(userId) {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password_hash'] },
  });
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
}

async function updateProfile(userId, data) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  await user.update(data);
  return user;
}

async function getAddresses(userId) {
  return Address.findAll({
    where: { user_id: userId },
    order: [['is_default', 'DESC'], ['created_at', 'DESC']],
  });
}

async function addAddress(userId, data) {
  if (data.is_default) {
    await Address.update(
      { is_default: false },
      { where: { user_id: userId } }
    );
  }
  return Address.create({ ...data, user_id: userId });
}

async function editAddress(userId, addressId, data) {
  const address = await Address.findOne({
    where: { id: addressId, user_id: userId },
  });
  if (!address) {
    throw new NotFoundError('Address not found');
  }
  if (data.is_default) {
    await Address.update(
      { is_default: false },
      { where: { user_id: userId, id: { [Op.ne]: addressId } } }
    );
  }
  await address.update(data);
  return address;
}

async function deleteAddress(userId, addressId) {
  const address = await Address.findOne({
    where: { id: addressId, user_id: userId },
  });
  if (!address) {
    throw new NotFoundError('Address not found');
  }
  await address.destroy();
  return { message: 'Address deleted' };
}

module.exports = {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  editAddress,
  deleteAddress,
};
