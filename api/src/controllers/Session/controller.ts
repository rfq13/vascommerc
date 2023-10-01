import { APP_LANG } from '@config/env'
import asyncHandler from '@vscommerce/helpers/asyncHandler'
import HttpResponse from '@vscommerce/modules/Response/HttpResponse'
import Authorization from '@middlewares/Authorization'
import { Request, Response, Router } from 'express'
import SessionService from './service'

const sessionRouter = Router()
sessionRouter.get(
  '/session',
  Authorization,
  asyncHandler(async function findAll(req: Request, res: Response) {
    const data = await SessionService.findAll(req)

    const httpResponse = HttpResponse.get(data)
    res.status(200).json(httpResponse)
  })
)

sessionRouter.get(
  '/session/:id',
  Authorization,
  asyncHandler(async function findById(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()
    const data = await SessionService.findById(id, { lang: defaultLang })

    const httpResponse = HttpResponse.get({ data })
    res.status(200).json(httpResponse)
  })
)

sessionRouter.post(
  '/session',
  Authorization,
  asyncHandler(async function create(req: Request, res: Response) {
    const formData = req.getBody()
    const data = await SessionService.create(formData)

    const httpResponse = HttpResponse.created({ data })
    res.status(201).json(httpResponse)
  })
)

sessionRouter.delete(
  '/session/:id',
  Authorization,
  asyncHandler(async function forceDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await SessionService.delete(id, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

export default sessionRouter
