import asyncHandler from '@vscommerce/helpers/asyncHandler'
import { formatDateTime } from '@vscommerce/helpers/Date'
import HttpResponse from '@vscommerce/modules/Response/HttpResponse'
import Express, { Request, Response } from 'express'
import vscommerce from './vscommerce'

const route = Express.Router()

route.use('/', vscommerce)

route.get('/', async function (req: Request, res: Response) {
  const buildResponse = HttpResponse.get({
    message: 'VSCommerce API',
    healthStatus: '/health',
  })
  return res.json(buildResponse)
})

// Get Health Server
route.get(
  '/health',
  asyncHandler(async function getServerHealth(req: Request, res: Response) {
    const startUsage = process.cpuUsage()

    const status = {
      uptime: process.uptime(),
      message: 'Ok',
      timezone: 'ID',
      date: formatDateTime(new Date()),
      node: process.version,
      memory: process.memoryUsage,
      platform: process.platform,
      cpuUsage: process.cpuUsage(startUsage),
    }

    const httpResponse = HttpResponse.get({
      message: 'Server Uptime',
      data: status,
    })
    res.status(200).json(httpResponse)
  })
)

export default route
