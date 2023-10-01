'use strict'

const _ = require('lodash')
const { v4: uuidv4 } = require('uuid')
// const {
//   default: ConstPermission,
// } = require('@vscommerce/constants/ConstPermission')

const data = [
  {
    name: 'Get User',
    path: '/user',
    method: 'GET',
  },
  {
    name: 'Disable User',
    path: '/user/soft-delete',
    method: 'DELETE',
  },
  {
    name: 'Restore User',
    path: '/user/restore',
    method: 'PUT',
  },
  {
    name: 'Get Permission',
    path: '/permission',
    method: 'GET',
  },
  {
    name: 'Update Permission',
    path: '/permission',
    method: 'PUT',
  },
]

const formData = []

if (!_.isEmpty(data)) {
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i]

    formData.push({
      ...item,
      id: item?.id || uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Permissions', formData)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Permissions', null, {})
  },
}
