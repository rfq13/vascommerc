'use strict'

const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const chalk = require('chalk')
const _ = require('lodash')
const ConstRole = require('../../@vscommerce/constants/ConstRole')

const salt = 10
const defaultPassword = '12345678'

console.log(
  `${chalk.green('[server]')} ${chalk.blue('Seed')} ${chalk.green(
    'your default password: '
  )}`,
  { defaultPassword }
)

const data = [
  {
    fullName: 'Super Admin',
    email: 'super.admin@mail.com',
    RoleId: ConstRole.ID_SUPER_ADMIN,
    phone: '6281234567890',
  },
  {
    fullName: 'Admin',
    email: 'admin@mail.com',
    RoleId: ConstRole.ID_ADMIN,
    phone: '6281234567891',
  },
  {
    fullName: 'Test User',
    email: 'test.user@mail.com',
    RoleId: ConstRole.ID_USER,
    phone: '6281234567892',
  },
]

const formData = []

if (!_.isEmpty(data)) {
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i]

    formData.push({
      ...item,
      id: uuidv4(),
      isActive: true,
      password: bcrypt.hashSync(String(defaultPassword), salt),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', formData)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  },
}
