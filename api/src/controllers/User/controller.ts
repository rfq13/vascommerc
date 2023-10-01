import { APP_LANG } from '@config/env'
import asyncHandler from '@vscommerce/helpers/asyncHandler'
import { arrayFormatter } from '@vscommerce/helpers/Formatter'
import HttpResponse from '@vscommerce/modules/Response/HttpResponse'
import Authorization from '@middlewares/Authorization'
import { Request, Response, Router } from 'express'
import UserService from './service'
import IsAdmin from '@middlewares/IsAdmin'

const userRouter = Router()
userRouter.get(
  '/:id',
  Authorization,
  IsAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { lang, attributes } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()
    const user = req.state as any
    const roleId = user.userLogin.role

    const data = await UserService.findById(
      id,
      {
        lang: defaultLang,
        attributes,
      },
      roleId
    )

    const httpResponse = HttpResponse.get({ data })
    res.status(200).json(httpResponse)
  })
)

userRouter.get(
  '/',
  Authorization,
  IsAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const data = await UserService.findAll(req)
    const httpResponse = HttpResponse.get(data)
    res.status(200).json(httpResponse)
  })
)

userRouter.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const formData = req.getBody()
    const data = await UserService.create(formData)

    const httpResponse = HttpResponse.created({ data })
    res.status(201).json(httpResponse)
  })
)

userRouter.put(
  '/:id',
  Authorization,
  asyncHandler(async (req: Request, res: Response) => {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()
    const formData = req.getBody()

    const data = await UserService.update(id, formData, { lang: defaultLang })

    const httpResponse = HttpResponse.updated({ data })
    res.status(200).json(httpResponse)
  })
)

userRouter.put(
  '/restore/:id',
  Authorization,
  IsAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await UserService.restore(id, { lang: defaultLang })

    const httpResponse = HttpResponse.updated({})
    res.status(200).json(httpResponse)
  })
)

userRouter.delete(
  '/soft-delete/:id',
  Authorization,
  IsAdmin,
  asyncHandler(async function softDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await UserService.softDelete(id, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

userRouter.delete(
  '/force-delete/:id',
  Authorization,
  IsAdmin,
  asyncHandler(async function forceDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await UserService.forceDelete(id, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

userRouter.post(
  '/multiple/restore',
  Authorization,
  IsAdmin,
  asyncHandler(async function multipleRestore(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await UserService.multipleRestore(arrayIds, { lang: defaultLang })

    const httpResponse = HttpResponse.updated({})
    res.status(200).json(httpResponse)
  })
)

userRouter.post(
  '/multiple/soft-delete',
  Authorization,
  IsAdmin,
  asyncHandler(async function multipleSoftDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await UserService.multipleSoftDelete(arrayIds, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

userRouter.post(
  '/multiple/force-delete',
  Authorization,
  IsAdmin,
  asyncHandler(async function multipleForceDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await UserService.multipleForceDelete(arrayIds, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

export default userRouter
