import 'server-only'
import crypto from 'crypto'

const TOKEN_URL = 'https://api.signicat.com/auth/open/connect/token'
const SESSIONS_URL = 'https://api.signicat.com/auth/rest/sessions'

type CachedToken = {accessToken: string; expiresAt: number}
let cachedToken: CachedToken | null = null

const getApiCredentials = () => {
  const clientId = process.env.SIGNICAT_API_CLIENT_ID
  const clientSecret = process.env.SIGNICAT_API_CLIENT_SECRET
  if (!clientId) throw new Error('SIGNICAT_API_CLIENT_ID is missing')
  if (!clientSecret) throw new Error('SIGNICAT_API_CLIENT_SECRET is missing')
  return {clientId, clientSecret}
}

const getAccessToken = async () => {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) return cachedToken.accessToken

  const {clientId, clientSecret} = getApiCredentials()
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({grant_type: 'client_credentials'}),
    cache: 'no-store'
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Signicat token request failed: ${response.status} ${text}`)
  }

  const data = (await response.json()) as {access_token: string; expires_in: number}
  cachedToken = {accessToken: data.access_token, expiresAt: Date.now() + data.expires_in * 1000}
  return data.access_token
}

export type SignicatSubject = {
  sub?: string
  name?: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  // Signicat returns nin as either a bare string or {value, type} depending on
  // the provider — keep the type loose and normalise at the call site.
  nin?: string | {value?: string; type?: string}
  email?: string
}

export type SignicatSessionStatus = 'CREATED' | 'WAITING_FOR_USER' | 'SUCCESS' | 'ABORT' | 'ERROR' | string

export type SignicatSession = {
  id: string
  status?: SignicatSessionStatus
  subject?: SignicatSubject
  idpData?: {
    autoStartToken?: string
    qrData?: string
    sbidStatus?: string
  }
  error?: {code?: string; message?: string}
}

export const startBankIdSession = async ({endUserIp}: {endUserIp: string}): Promise<SignicatSession> => {
  const accessToken = await getAccessToken()

  const response = await fetch(SESSIONS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      allowedProviders: ['sbid'],
      flow: 'headless',
      requestedAttributes: ['sub', 'name', 'firstName', 'lastName', 'dateOfBirth', 'nin'],
      additionalParameters: {
        sbid_flow: 'QR',
        sbid_end_user_ip: endUserIp
      }
    }),
    cache: 'no-store'
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Signicat session create failed: ${response.status} ${text}`)
  }

  return (await response.json()) as SignicatSession
}

export const getBankIdSession = async (sessionId: string): Promise<SignicatSession> => {
  const accessToken = await getAccessToken()
  const response = await fetch(`${SESSIONS_URL}/${encodeURIComponent(sessionId)}`, {
    headers: {Authorization: `Bearer ${accessToken}`},
    cache: 'no-store'
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Signicat session fetch failed: ${response.status} ${text}`)
  }

  return (await response.json()) as SignicatSession
}

export const signicatUidFor = (issuer: string, subject: string) =>
  `sig-${crypto.createHash('sha256').update(`${issuer}:${subject}`).digest('hex')}`

export const cancelBankIdSession = async (sessionId: string) => {
  const accessToken = await getAccessToken()
  await fetch(`${SESSIONS_URL}/${encodeURIComponent(sessionId)}/cancel`, {
    method: 'POST',
    headers: {Authorization: `Bearer ${accessToken}`},
    cache: 'no-store'
  }).catch(() => {})
}
