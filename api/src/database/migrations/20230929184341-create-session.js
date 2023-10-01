'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sessions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      UserId: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      otp: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      token: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      ipAddress: {
        type: Sequelize.STRING,
      },
      device: {
        type: Sequelize.STRING,
      },
      platform: {
        type: Sequelize.STRING,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Sessions')
  },
}
