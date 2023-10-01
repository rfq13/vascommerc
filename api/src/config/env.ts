/* eslint-disable prettier/prettier */
import 'dotenv/config'

function validateBoolean(value: string | boolean | number | any): boolean {
  const invalidValues = [
    null,
    undefined,
    '',
    false,
    0,
    'false',
    '0',
    'null',
    'undefined',
  ]

  if (invalidValues.includes(value)) {
    return false
  }

  return true
}

// node env
export const NODE_ENV = process.env.NODE_ENV ?? 'development'

// app
export const CLIENT_URL = process.env.CLIENT_URL
export const APP_URL = process.env.APP_URL
export const APP_KEY = process.env.APP_KEY
export const APP_NAME = process.env.APP_NAME ?? 'expresso'
export const APP_LANG = process.env.APP_LANG ?? 'id'
export const APP_PORT = Number(process.env.APP_PORT) ?? 3011
export const TCP_PORT = Number(process.env.TCP_PORT) ?? 3000

// axios
export const AXIOS_TIMEOUT = process.env.AXIOS_TIMEOUT ?? '5m'

// rate limit request
export const RATE_LIMIT = Number(process.env.RATE_LIMIT) ?? 100

// otp
export const SECRET_OTP: any = process.env.SECRET_OTP
export const EXPIRED_OTP = process.env.EXPIRED_OTP ?? '5m'

// jwt access
export const JWT_SECRET: any = process.env.JWT_SECRET

export const JWT_ACCESS_TOKEN_EXPIRED = process.env.JWT_ACCESS_TOKEN_EXPIRED ?? '1d'
export const JWT_REFRESH_TOKEN_EXPIRED =
  process.env.JWT_REFRESH_TOKEN_EXPIRED ?? '7d'

// url staging
export const URL_CLIENT_STAGING =
  process.env.URL_CLIENT_STAGING ?? 'https://sandbox.example.com'
export const URL_SERVER_STAGING =
  process.env.URL_SERVER_STAGING ?? 'https://api.sandbox.example.com'

// url production
export const URL_CLIENT_PRODUCTION =
  process.env.URL_CLIENT_PRODUCTION ?? 'https://example.com'
export const URL_SERVER_PRODUCTION =
  process.env.URL_SERVER_PRODUCTION ?? 'https://api.example.com'

// database
export const DB_CONNECTION = process.env.DB_CONNECTION ?? 'mysql'
export const DB_HOST = process.env.DB_HOST ?? '127.0.0.1'
export const DB_PORT = Number(process.env.DB_PORT) ?? 3306
export const DB_DATABASE = process.env.DB_DATABASE ?? 'VSCommerce'
export const DB_USERNAME = process.env.DB_USERNAME ?? 'root'
export const DB_PASSWORD = process.env.DB_PASSWORD ?? 'root'
export const DB_SYNC = validateBoolean(process.env.DB_SYNC) ?? false
export const DB_TIMEZONE = process.env.DB_TIMEZONE ?? '+07:00' // for mysql = +07:00, for postgres = Asia/Jakarta
// smtp
export const MAIL_DRIVER = process.env.MAIL_DRIVER ?? 'smtp'
export const MAIL_HOST = process.env.MAIL_HOST ?? 'smtp.mailtrap.io'
export const MAIL_PORT = Number(process.env.MAIL_PORT) ?? 2525
export const MAIL_AUTH_TYPE = process.env.MAIL_AUTH_TYPE ?? undefined
export const MAIL_USERNAME = process.env.MAIL_USERNAME ?? undefined
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD ?? undefined
export const MAIL_ENCRYPTION = process.env.MAIL_ENCRYPTION ?? undefined

// smtp mailgun
export const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY ?? undefined
export const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN ?? undefined

// smtp google OAuth
export const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID ?? undefined
export const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET ?? undefined
export const OAUTH_REDIRECT_URL = process.env.OAUTH_REDIRECT_URL ?? undefined
export const OAUTH_REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN ?? undefined

// redis
export const REDIS_HOST = process.env.REDIS_HOST ?? '127.0.0.1'
export const REDIS_PORT = Number(process.env.REDIS_PORT) ?? 6379
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD ?? undefined

// firebase
export const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY ?? undefined
export const FIREBASE_AUTH_DOMAIN =
  process.env.FIREBASE_AUTH_DOMAIN ?? undefined
export const FIREBASE_DATABASE_URL =
  process.env.FIREBASE_DATABASE_URL ?? undefined
export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID ?? undefined
export const FIREBASE_STORAGE_BUCKET =
  process.env.FIREBASE_STORAGE_BUCKET ?? undefined
export const FIREBASE_MESSAGING_SENDER_ID =
  process.env.FIREBASE_MESSAGING_SENDER_ID ?? undefined
export const FIREBASE_APP_ID = process.env.FIREBASE_APP_ID ?? undefined
export const FIREBASE_MEASUREMENT_ID =
  process.env.FIREBASE_MEASUREMENT_ID ?? undefined

// GOOGLE
export const GOOGLE_CLIENT_ID: any = process.env.GOOGLE_CLIENT_ID ?? undefined
export const GOOGLE_CLIENT_SECRET: any =
  process.env.GOOGLE_CLIENT_SECRET ?? undefined

export const MIDTRANS_MODE: any = process.env.MIDTRANS_MODE ?? 'SANDBOX'

export const MIDTRANS_SERVER_KEY: any =
  MIDTRANS_MODE === 'PRODUCTION'
    ? process.env.MIDTRANS_SERVER_KEY_PROD
    : process.env.MIDTRANS_SERVER_KEY_SAND ?? undefined
export const MIDTRANS_CLIENT_KEY: any =
  MIDTRANS_MODE === 'PRODUCTION'
    ? process.env.MIDTRANS_CLIENT_KEY_PROD
    : process.env.MIDTRANS_CLIENT_KEY_SAND ?? undefined
export const MIDTRANS_METHOD: any = process.env.MIDTRANS_METHOD ?? undefined

export const TAPTALK_API_KEY: any = process.env.TAPTALK_API_KEY ?? undefined

export const TAPTALK_BASE_URL: any = process.env.TAPTALK_BASE_URL ?? undefined

export const QONTAK_BASE_URL: any = process.env.QONTAK_BASE_URL ?? undefined
export const QONTAK_CLIENT_ID: any = process.env.QONTAK_CLIENT_ID ?? undefined
export const QONTAK_SECRET: any = process.env.QONTAK_SECRET ?? undefined
export const QONTAK_PASSWORD: any = process.env.QONTAK_PASSWORD ?? undefined
export const QONTAK_USERNAME: any = process.env.QONTAK_USERNAME ?? undefined
export const QONTAK_WA_CHANNELID: any =
  process.env.QONTAK_WA_CHANNELID ?? undefined
export const QONTAK_WA_TEMPLATE_ID: any =
  process.env.QONTAK_WA_TEMPLATE_ID ?? undefined
export const QONTAK_AUTH_TOKEN: any = process.env.QONTAK_AUTH_TOKEN ?? undefined

export const SCHEDULE_URL: any = process.env.SCHEDULE_URL ?? undefined

export const DUMMY_EMAIL: any = process.env.DUMMY_EMAIL ?? undefined
export const DUMMY_PASSWORD: any = process.env.DUMMY_PASSWORD ?? undefined

export const MIN_POWER: any = process.env.MIN_POWER ?? undefined

export const YUKK_CLIENT_ID: any = process.env.YUKK_CLIENT_ID ?? undefined
export const YUKK_CLIENT_SECRET: any =
  process.env.YUKK_CLIENT_SECRET ?? undefined
export const YUKK_CHANNEL_ID: any = process.env.YUKK_CHANNEL_ID ?? undefined
