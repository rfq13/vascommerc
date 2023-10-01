import asyncHandler from '@vscommerce/helpers/asyncHandler'
import HttpResponse from '@vscommerce/modules/Response/HttpResponse'
import Authorization from '@middlewares/Authorization'
import { Request, Response, Router } from 'express'
import PermissionService from './service'
import IsAdmin from '@middlewares/IsAdmin'

const permissionRouter = Router()
permissionRouter.get(
  '/permission',
  Authorization,
  IsAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const data = await PermissionService.findAll(req)
    const httpResponse = HttpResponse.get(data)
    res.status(200).json(httpResponse)
  })
)

permissionRouter.put(
  '/permission/:id',
  Authorization,
  IsAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const data = await PermissionService.update(req)
    const httpResponse = HttpResponse.updated({ data })
    res.status(201).json(httpResponse)
  })
)

permissionRouter.post(
  '/permission',
  Authorization,
  IsAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const data = await PermissionService.createPermissions(req)
    const httpResponse = HttpResponse.created({ data })
    res.status(201).json(httpResponse)
  })
)

export default permissionRouter
