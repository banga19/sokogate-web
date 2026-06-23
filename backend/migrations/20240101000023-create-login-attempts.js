'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('login_attempts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      identifier: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Email or IP address used for the attempt',
      },
      attempt_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'email or ip',
      },
      attempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      locked_until: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Account locked until this timestamp',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('login_attempts', ['identifier', 'attempt_type'], {
      name: 'idx_login_attempts_identifier_type',
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('login_attempts', 'idx_login_attempts_identifier_type');
    await queryInterface.dropTable('login_attempts');
  },
};
