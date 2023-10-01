import { APP_LANG } from '@config/env'
import asyncHandler from '@vscommerce/helpers/asyncHandler'
import { arrayFormatter } from '@vscommerce/helpers/Formatter'
import HttpResponse from '@vscommerce/modules/Response/HttpResponse'
import Authorization from '@middlewares/Authorization'
import { Request, Response, Router } from 'express'
import ProductService from './service'
import IsAdmin from '@middlewares/IsAdmin'
import multer from 'multer'
import fs from 'fs'

const dest = 'public/images/products/'
if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest)
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dest)
  },
  filename: function (req, file, cb) {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const extension = file.originalname.split('.').pop()
    cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`)
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: 200 * 1024, // 200 KB
  },
  fileFilter: (req, file, cb) => {
    const isImage = [
      'image/png',
      'image/jpg',
      'image/gif',
      'image/jpeg',
    ].includes(file.mimetype?.toLowerCase())

    if (isImage) {
      cb(null, true)
    } else {
      cb(null, false)
      const err = new Error('Only .png, .jpg, .gif and .jpeg format allowed!')
      err.name = 'ExtensionError'
      return cb(err)
    }
  },
})

const roleRouter = Router()

roleRouter.get(
  '/',
  Authorization,
  asyncHandler(async function findAll(req: Request, res: Response) {
    const data = await ProductService.findAll(req)

    const httpResponse = HttpResponse.get(data)
    res.status(200).json(httpResponse)
  })
)

roleRouter.get(
  '/:id',
  Authorization,
  asyncHandler(async function findById(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()
    const data = await ProductService.findById(id, { lang: defaultLang })

    const httpResponse = HttpResponse.get({ data })
    res.status(200).json(httpResponse)
  })
)

roleRouter.post(
  '/',
  Authorization,
  IsAdmin,
  upload.single('image'),
  asyncHandler(async function create(req: Request, res: Response) {
    const formData = req.getBody()

    const file = req.file as Express.Multer.File
    if (file) {
      const { path } = file
      formData.image = path.replace(/\\/g, '/').replace('public/', '')
    }

    const data = await ProductService.create(formData)
    const httpResponse = HttpResponse.created({ data })
    res.status(201).json(httpResponse)
  })
)

roleRouter.put(
  '/:id',
  Authorization,
  IsAdmin,
  upload.single('image'),
  asyncHandler(async function update(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()
    const formData = req.getBody()

    const file = req.file as Express.Multer.File
    if (file) {
      const { path } = file
      formData.image = path.replace(/\\/g, '/').replace('public/', '')
    }

    const data = await ProductService.update(id, formData, {
      lang: defaultLang,
    })

    const httpResponse = HttpResponse.updated({ data })
    res.status(200).json(httpResponse)
  })
)

roleRouter.put(
  '/restore/:id',
  Authorization,
  IsAdmin,
  asyncHandler(async function restore(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await ProductService.restore(id, { lang: defaultLang })

    const httpResponse = HttpResponse.updated({})
    res.status(200).json(httpResponse)
  })
)

roleRouter.delete(
  '/soft-delete/:id',
  Authorization,
  IsAdmin,
  asyncHandler(async function softDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await ProductService.softDelete(id, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

roleRouter.delete(
  '/force-delete/:id',
  Authorization,
  IsAdmin,
  asyncHandler(async function forceDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await ProductService.forceDelete(id, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

roleRouter.post(
  '/multiple/restore',
  Authorization,
  IsAdmin,
  asyncHandler(async function multipleRestore(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await ProductService.multipleRestore(arrayIds, { lang: defaultLang })

    const httpResponse = HttpResponse.updated({})
    res.status(200).json(httpResponse)
  })
)

roleRouter.post(
  '/multiple/soft-delete',
  Authorization,
  IsAdmin,
  asyncHandler(async function multipleSoftDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await ProductService.multipleSoftDelete(arrayIds, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

roleRouter.post(
  '/multiple/force-delete',
  Authorization,
  IsAdmin,
  asyncHandler(async function multipleForceDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await ProductService.multipleForceDelete(arrayIds, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

export default roleRouter
