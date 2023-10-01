import { OAUTH_CLIENT_ID, OAUTH_REDIRECT_URL } from '../constant'

function getGoogleAuthUrl(): string {
  const root = 'https://accounts.google.com/o/oauth2/v2/auth'

  const params = {
    client_id: OAUTH_CLIENT_ID,
    redirect_uri: OAUTH_REDIRECT_URL,
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
    include_granted_scopes: true,
  }

  const url = new URL(root)

  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key]),
  )

  return url.toString()
}

export default getGoogleAuthUrl
