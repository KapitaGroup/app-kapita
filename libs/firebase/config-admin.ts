import 'server-only'
import {cookies} from 'next/headers'
import {initializeApp, getApps, cert} from 'firebase-admin/app'
import {SessionCookieOptions, getAuth} from 'firebase-admin/auth'

export const firebaseApp =
  getApps().find(app => app.name === 'admin') ||
  initializeApp(
    {
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
        clientEmail: process.env.CLIENT_EMAIL!,
        privateKey: process.env.PRIVATE_KEY!.replace(/\\n/g, '\n')
      })
    },
    'admin'
  )
export const auth = getAuth(firebaseApp)

export const isUserAuthenticated = async (session: string | undefined = undefined) => {
  const _session = session ?? (await getSession())
  if (!_session) return false

  try {
    const isRevoked = !(await auth.verifySessionCookie(_session, true))
    return !isRevoked
  } catch (error) {
    console.error(error)
    return false
  }
}

export const getCurrentUser = async () => {
  const session = await getSession()

  if (!(await isUserAuthenticated(session))) {
    return null
  }

  const decodedIdToken = await auth.verifySessionCookie(session!)
  const currentUser = await auth.getUser(decodedIdToken.uid)

  return currentUser
}

const getSession = async () => {
  try {
    return cookies().get('__session')?.value
  } catch {
    return undefined
  }
}

export const createSessionCookie = async (
  idToken: string,
  sessionCookieOptions: SessionCookieOptions
) => auth.createSessionCookie(idToken, sessionCookieOptions)

export const revokeAllSessions = async (session: string) => {
  const decodedIdToken = await auth.verifySessionCookie(session)

  return await auth.revokeRefreshTokens(decodedIdToken.sub)
}
