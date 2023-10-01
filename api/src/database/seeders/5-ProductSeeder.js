'use strict'

const { v4 } = require('uuid')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Products',
      [
        'Kopi Luwak',
        'Espresso',
        'Cappuccino',
        'Americano',
        'Cafe Latte',
        'Mocha',
        'Caramel Macchiato',
        'Flat White',
        'Cafe au Lait',
        'Cafe Breve',
        'Irish Coffee',
        'Cafe Bombon',
        'Cafe con Hielo',
        'Cafe Cortado',
        'Cafe con Leche',
        'Cafe Cubano',
        'Cafe de Olla',
      ].map((product) => {
        return {
          id: v4(),
          name: product,
          price: 10000,
          image:
            'https://www.caffesociety.co.uk/assets/recipe-images/flat-white.jpg',
          status: true,
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ve',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      })
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {})
  },
}
