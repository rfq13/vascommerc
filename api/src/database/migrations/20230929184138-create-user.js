'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      fullName: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING('20'),
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      RoleId: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        references: {
          model: 'Roles',
          key: 'id',
        },
      },
      tokenVerify: {
        type: Sequelize.TEXT,
      },
      isActive: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      isBlocked: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    })
    await queryInterface.addConstraint('Users', {
      type: 'unique',
      fields: ['email', 'phone'],
      name: 'UNIQUE_USERS',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users')
  },
}
