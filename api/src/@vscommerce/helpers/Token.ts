/* eslint-disable import/no-duplicates */
import {
  JWT_ACCESS_TOKEN_EXPIRED,
  JWT_SECRET,
  JWT_REFRESH_TOKEN_EXPIRED,
} from '@config/env'
import { Request } from 'express'
import { IncomingHttpHeaders } from 'http'
import jwt, {
  JsonWebTokenError,
  JwtPayload,
  NotBeforeError,
  TokenExpiredError,
} from 'jsonwebtoken'
import _ from 'lodash'
import ms from 'ms'
import { logErrServer } from './Formatter'
import UserService from '@controllers/User/service'
import User from '@database/entities/User'
import ResponseError from '@vscommerce/modules/Response/ResponseError'

interface PayloadAccessToken {
  accessToken: string
  expiresIn: number
}

type DtoVerifyAccessToken =
  | {
      data: null
      message: string
    }
  | {
      data: string | JwtPayload
      message: string
    }
  | undefined

/**
 *
 * @param payload
 * @returns
 */
function generateAccessToken(
  payload: any,
  refresh: boolean = false,
  customexpiresIn: string = JWT_ACCESS_TOKEN_EXPIRED
): PayloadAccessToken {
  const getMilliSecondExpires = ms(customexpiresIn)
  const expiresIn = Number(getMilliSecondExpires) / 1000

  if (refresh) {
    delete payload.exp
  }

  const accessToken = jwt.sign(
    JSON.parse(JSON.stringify(payload)),
    JWT_SECRET,
    { expiresIn }
  )

  return { accessToken, expiresIn }
}

// generate refresh token
function generateRefreshToken(payload: any): string {
  const getMilliSecondExpires = ms(JWT_REFRESH_TOKEN_EXPIRED)
  const expiresIn = Number(getMilliSecondExpires) / 1000

  const refreshToken = jwt.sign(
    JSON.parse(JSON.stringify(payload)),
    JWT_SECRET,
    { expiresIn }
  )

  return refreshToken
}

/**
 *
 * @param headers
 * @returns
 */
function getToken(headers: IncomingHttpHeaders): string | null | any {
  if (headers?.authorization) {
    const parted = headers.authorization.split(' ')

    // Check Bearer xxx || JWT xxx
    if (parted[0] === 'Bearer' || parted[0] === 'JWT') {
      if (parted.length === 2) {
        return parted[1]
      }
    }

    return null
  }

  return null
}

/**
 *
 * @param req
 * @returns
 */
function currentToken(req: Request): string {
  const getCookie = req.getCookies()
  const getHeaders = req.getHeaders()

  let curToken = ''

  if (!_.isEmpty(getCookie.token)) {
    curToken = getCookie.token
  } else {
    curToken = getToken(getHeaders)
  }

  return curToken
}

/**
 *
 * @param token
 * @returns
 */
function verifyAccessToken(token: string): DtoVerifyAccessToken {
  try {
    if (!token) {
      return { data: null, message: 'Unauthorized!' }
    }

    const data = jwt.verify(token, JWT_SECRET)
    return { data, message: 'Token is verify' }
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      console.log(logErrServer('JWT Expired Error:', err.message))
      return { data: null, message: `JWT Expired Error: ${err.message}` }
    }

    if (err instanceof JsonWebTokenError) {
      console.log(logErrServer('JWT Token Error:', err.message))
      return { data: null, message: `JWT Token Error: ${err.message}` }
    }

    if (err instanceof NotBeforeError) {
      console.log(logErrServer('JWT Not Before Error:', err.message))
      return { data: null, message: `JWT Not Before Error: ${err.message}` }
    }
  }
}

// get current user
async function currentUser(
  req: Request,
  withPassword?: boolean,
  customNotFound?: string
): Promise<User> {
  const curToken = currentToken(req)
  const verifyToken = verifyAccessToken(curToken)

  const userToken = verifyToken?.data as any

  let errHandler = 'Unauthorized' as keyof typeof ResponseError

  if (customNotFound) {
    errHandler = 'NotFound'
  }

  if (!_.isEmpty(userToken?.uid)) {
    const getUser = await User.scope(
      withPassword ? 'withPassword' : ''
    ).findOne({
      where: { id: userToken.uid },
    })

    if (!getUser) {
      throw new ResponseError[errHandler](customNotFound || 'Unauthorized!')
    }

    return getUser
  }

  throw new ResponseError[errHandler](customNotFound || 'Unauthorized!')
}

export {
  generateAccessToken,
  getToken,
  currentToken,
  verifyAccessToken,
  generateRefreshToken,
  currentUser,
}
