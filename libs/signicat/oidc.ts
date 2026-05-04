import 'server-only'
import crypto from 'crypto'

export type SignicatUserInfo = {
  sub: string
  email?: string
  email_verified?: boolean
  name?: string
  given_name?: string
  family_name?: string
  phone_number?: string
}

export const getSignicatAuthority = () => {
  const authority = process.env.SIGNICAT_AUTHORITY?.replace(/\/$/, '')
  if (!authority) throw new Error('SIGNICAT_AUTHORITY is missing')
  return authority.endsWith('/auth/open') ? authority : `${authority}/auth/open`
}

export const getSignicatClientConfig = () => {
  const clientId = process.env.SIGNICAT_CLIENT_ID
  const clientSecret = process.env.SIGNICAT_CLIENT_SECRET

  if (!clientId) throw new Error('SIGNICAT_CLIENT_ID is missing')
  if (!clientSecret) throw new Error('SIGNICAT_CLIENT_SECRET is missing')

  return {clientId, clientSecret}
}

export const randomBase64Url = (bytes = 32) => crypto.randomBytes(bytes).toString('base64url')

export const sha256Base64Url = (value: string) => crypto.createHash('sha256').update(value).digest('base64url')

export const getRedirectUri = (origin: string) => `${origin}/api/auth/signicat/callback`

export const signicatUidFor = (issuer: string, subject: string) =>
  `sig-${crypto.createHash('sha256').update(`${issuer}:${subject}`).digest('hex')}`

export const exchangeCodeForTokens = async ({
  code,
  codeVerifier,
  redirectUri
}: {
  code: string
  codeVerifier: string
  redirectUri: string
}) => {
  const authority = getSignicatAuthority()
  const {clientId, clientSecret} = getSignicatClientConfig()

  const response = await fetch(`${authority}/connect/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Signicat token exchange failed: ${response.status} ${error}`)
  }

  return (await response.json()) as {
    access_token: string
    id_token?: string
    token_type: string
    expires_in: number
  }
}

export const getUserInfo = async (accessToken: string) => {
  const response = await fetch(`${getSignicatAuthority()}/connect/userinfo`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Signicat userinfo failed: ${response.status} ${error}`)
  }

  return (await response.json()) as SignicatUserInfo
}
