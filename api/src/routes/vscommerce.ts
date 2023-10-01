import Express from 'express'

import authRoute from '@controllers/Auth/controller'
import permissionRoute from '@controllers/Permission/controller'
import productRoute from '@controllers/Product/controller'
import roleRoute from '@controllers/Role/controller'
import sessionRoute from '@controllers/Session/controller'
import userRoute from '@controllers/User/controller'
import Authorization from '@middlewares/Authorization'
import asyncHandler from '@vscommerce/helpers/asyncHandler'
import User from '@database/entities/User'
import HttpResponse from '@vscommerce/modules/Response/HttpResponse'

const route = Express.Router()

route.use('/auth', authRoute)
route.use('/permission', permissionRoute)
route.use('/product', productRoute)
route.use('/role', roleRoute)
route.use('/session', sessionRoute)
route.use('/user', userRoute)

route.get(
  '/report',
  Authorization,
  asyncHandler(async function findAll(req, res) {
    // dapatkan total user, total product, total user aktif, total product aktif dari database dalam 1 query

    const data = await User?.sequelize?.query(
      `
        SELECT
          (SELECT COUNT(*) FROM users WHERE deletedAt IS NULL) AS total_user,
            (SELECT COUNT(*) FROM products WHERE deletedAt IS NULL) AS total_product,
            (SELECT COUNT(*) FROM users WHERE isActive = true AND deletedAt IS NULL) AS total_user_active,
            (SELECT COUNT(*) FROM products WHERE status = true AND deletedAt IS NULL) AS total_product_active
        `,
      {
        type: 'SELECT',
      }
    )

    const httpResponse = HttpResponse.get({ data: data?.length ? data[0] : {} })

    res.status(httpResponse.code).json(httpResponse)
  })
)

export default route
