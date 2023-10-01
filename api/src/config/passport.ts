// passport config for typescript
// Language: typescript

// Path: src/config/passport.ts
import { APP_LANG, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '@config/env'
// import google strategy
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as LocalStrategy } from 'passport-local'
// import { Strategy as OAuth2Strategy } from 'passport-oauth2'

import passport from 'passport'
import { TOptions } from 'i18next'
import { Op } from 'sequelize'
import User from '@database/entities/User'
import ResponseError from '@vscommerce/modules/Response/ResponseError'
import { i18nConfig } from './i18nextConfig'

function init(): void {
  // make passport use google strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/session/google',
      },
      (accessToken, refreshToken, profile, done) => {
        // do something with the profile
        done(null, profile)
      }
    )
  )

  // make passport use local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const i18nOpt: string | TOptions = { lng: APP_LANG }

      const getUser = await User.scope('withPassword').findOne({
        where: {
          [Op.or]: [
            {
              email: username,
            },
            {
              phone: username,
            },
          ],
        },
        attributes: [
          'id',
          'email',
          'password',
          'RoleId',
          'isActive',
          'fullName',
          'phone',
        ],
      })

      // check user account
      if (!getUser) {
        const message = 'Nomor Handphone, Email atau Kata Sandi salah'
        throw new ResponseError.NotFound(message)
      }

      if (!getUser.isActive) {
        const message = i18nConfig.t('errors.account_unactivated', i18nOpt)
        throw new ResponseError.BadRequest(message)
      }

      const matchPassword = await getUser.comparePassword(password)

      // compare password
      if (!matchPassword) {
        const message = i18nConfig.t('errors.incorrect_email_or_pass', i18nOpt)
        throw new ResponseError.BadRequest(message)
      }
      done(null, getUser)
    })
  )

  // serialize user
  passport.serializeUser((user, done) => {
    done(null, user)
  })

  // deserialize user
  passport.deserializeUser((user: any, done) => {
    done(null, user)
  })
}

// export passport
export default { init }
