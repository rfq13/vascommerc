import { APP_LANG } from '@config/env'
import asyncHandler from '@vscommerce/helpers/asyncHandler'
import { arrayFormatter } from '@vscommerce/helpers/Formatter'
import HttpResponse from '@vscommerce/modules/Response/HttpResponse'
import Authorization from '@middlewares/Authorization'
import { Request, Response, Router } from 'express'
import RoleService from './service'
import IsAdmin from '@middlewares/IsAdmin'

const roleRouter = Router()

roleRouter.get(
  '/role',
  Authorization,
  asyncHandler(async function findAll(req: Request, res: Response) {
    const data = await RoleService.findAll(req)

    const httpResponse = HttpResponse.get(data)
    res.status(200).json(httpResponse)
  })
)

roleRouter.get(
  '/role/:id',
  Authorization,
  asyncHandler(async function findById(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()
    const data = await RoleService.findById(id, { lang: defaultLang })

    const httpResponse = HttpResponse.get({ data })
    res.status(200).json(httpResponse)
  })
)

roleRouter.post(
  '/role',
  Authorization,
  IsAdmin,
  asyncHandler(async function create(req: Request, res: Response) {
    const formData = req.getBody()
    const data = await RoleService.create(formData)

    const httpResponse = HttpResponse.created({ data })
    res.status(201).json(httpResponse)
  })
)

roleRouter.put(
  '/role/:id',
  Authorization,
  IsAdmin,
  asyncHandler(async function update(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()
    const formData = req.getBody()

    const data = await RoleService.update(id, formData, { lang: defaultLang })

    const httpResponse = HttpResponse.updated({ data })
    res.status(200).json(httpResponse)
  })
)

roleRouter.put(
  '/role/restore/:id',
  Authorization,
  IsAdmin,
  asyncHandler(async function restore(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await RoleService.restore(id, { lang: defaultLang })

    const httpResponse = HttpResponse.updated({})
    res.status(200).json(httpResponse)
  })
)

roleRouter.delete(
  '/role/soft-delete/:id',
  Authorization,
  IsAdmin,
  asyncHandler(async function softDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await RoleService.softDelete(id, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

roleRouter.delete(
  '/role/force-delete/:id',
  Authorization,
  IsAdmin,
  asyncHandler(async function forceDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await RoleService.forceDelete(id, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

roleRouter.post(
  '/role/multiple/restore',
  Authorization,
  IsAdmin,
  asyncHandler(async function multipleRestore(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await RoleService.multipleRestore(arrayIds, { lang: defaultLang })

    const httpResponse = HttpResponse.updated({})
    res.status(200).json(httpResponse)
  })
)

roleRouter.post(
  '/role/multiple/soft-delete',
  Authorization,
  IsAdmin,
  asyncHandler(async function multipleSoftDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await RoleService.multipleSoftDelete(arrayIds, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

roleRouter.post(
  '/role/multiple/force-delete',
  Authorization,
  IsAdmin,
  asyncHandler(async function multipleForceDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await RoleService.multipleForceDelete(arrayIds, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

export default roleRouter
