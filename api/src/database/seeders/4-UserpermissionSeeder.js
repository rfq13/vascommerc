'use strict'

const { v4 } = require('uuid')
const ConstRole = require('../../@vscommerce/constants/ConstRole')
const { Sequelize } = require('sequelize')

const getIdUser = async (qi) => {
  const users = await qi.sequelize.query(
    `SELECT id FROM Users WHERE RoleId = '${ConstRole.ID_SUPER_ADMIN}' or RoleId = '${ConstRole.ID_ADMIN}'`,
    {
      type: Sequelize.QueryTypes.SELECT,
      raw: true,
    }
  )

  return users
}

const getpermissions = async (qi) => {
  const permissions = await qi.sequelize.query(`SELECT id FROM Permissions`, {
    type: Sequelize.QueryTypes.SELECT,
    raw: true,
  })

  return permissions
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await getIdUser(queryInterface)
    const permissions = await getpermissions(queryInterface)

    const permissionsUser = []
    users.forEach((user) => {
      permissions.forEach((permission) => {
        permissionsUser.push({
          id: v4(),
          UserId: user.id,
          PermissionId: permission.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      })
    })

    await queryInterface.bulkInsert('UserPermissions', permissionsUser)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('UserPermissions', null, {})
  },
}
