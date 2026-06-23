'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'google_id', {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: true,
      comment: 'Google OAuth2 subject identifier',
    });

    await queryInterface.addIndex('users', ['google_id'], {
      name: 'idx_users_google_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('users', 'idx_users_google_id');
    await queryInterface.removeColumn('users', 'google_id');
  },
};
