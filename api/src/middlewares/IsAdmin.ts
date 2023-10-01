import ConstRole from '@vscommerce/constants/ConstRole'
import { NextFunction, Request, Response } from 'express'
import _ from 'lodash'
import PermissionAccess from './PermissionAccess'
import User, { UserLoginAttributes } from '@database/entities/User'
import { QueryTypes } from 'sequelize'
import ResponseError from '@vscommerce/modules/Response/ResponseError'

async function CheckPermission(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> {
  const url = req.originalUrl
  let urlPath = url.split('?')[0]

  Object.keys(req.params).forEach((key) => {
    urlPath = urlPath.replace(req.params[key], '')
  })

  urlPath = urlPath.replace(/\/$/, '')

  // jika urlPath mengandung uuid, replace dengan ':id'
  urlPath = urlPath.replace(/([a-f0-9]{8}(-[a-f0-9]{4}){4}[a-f0-9]{8})/g, ':id')

  const method = req.method

  const user = req.getState('userLogin')

  if (_.isEmpty(user)) {
    throw new ResponseError.Unauthorized('Unauthorized!')
  }

  const query = `SELECT * FROM UserPermissions WHERE UserId = '${user.uid}' AND PermissionId = (SELECT id FROM Permissions WHERE method = '${method}' AND path LIKE '${urlPath}%' LIMIT 1)  LIMIT 1`

  let isNeedCheck = false

  const regex = /(renteds|new-user|minimum-balance-report|report|my-profile)/g
  ;[
    urlPath.includes('rent') && urlPath.includes('report'),
    urlPath.includes('trx') && urlPath.includes('report'),
    regex.test(urlPath),
  ].forEach((item) => (isNeedCheck = !item))

  if (`${urlPath}/${user.uid}` === `/user/${user.uid}` && method === 'GET') {
    isNeedCheck = false
  }

  const getPer = isNeedCheck
    ? await User.sequelize?.query(query, {
        type: QueryTypes.SELECT,
      })
    : ['no need check']

  if (_.isEmpty(getPer)) {
    throw new ResponseError.Forbidden('Forbidden!')
  }

  next()
  return undefined
}

async function IsAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> {
  const userLogin = req.getState('userLogin') as UserLoginAttributes
  if (userLogin.role === ConstRole.ID_SUPER_ADMIN) next()
  else {
    void (await PermissionAccess([ConstRole.ID_ADMIN])(req, res, next))

    return await CheckPermission(req, res, next)
  }
}

export default IsAdmin
