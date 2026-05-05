import {cookies} from 'next/headers'
import {NextRequest, NextResponse} from 'next/server'
import {auth} from '@/libs/firebase/config-admin'
import {exchangeCodeForTokens, getRedirectUri, getSignicatAuthority, getUserInfo, signicatUidFor} from '@/libs/signicat/oidc'

export const dynamic = 'force-dynamic'

const clearSignicatFlowCookies = () => {
  cookies().delete('signicat_state')
  cookies().delete('signicat_nonce')
  cookies().delete('signicat_code_verifier')
}

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin
  const secure = request.nextUrl.protocol === 'https:'
  const loginUrl = new URL('/login', origin)

  try {
    const error = request.nextUrl.searchParams.get('error')
    if (error) {
      loginUrl.searchParams.set('error', error)
      return NextResponse.redirect(loginUrl)
    }

    const code = request.nextUrl.searchParams.get('code')
    const state = request.nextUrl.searchParams.get('state')
    const expectedState = cookies().get('signicat_state')?.value
    const codeVerifier = cookies().get('signicat_code_verifier')?.value
    const redirectPath = cookies().get('signicat_redirect')?.value || '/'

    if (!code || !state || !expectedState || state !== expectedState || !codeVerifier) {
      loginUrl.searchParams.set('error', 'signicat-state')
      return NextResponse.redirect(loginUrl)
    }

    const tokens = await exchangeCodeForTokens({
      code,
      codeVerifier,
      redirectUri: getRedirectUri(origin)
    })
    const userInfo = await getUserInfo(tokens.access_token)

    console.log('BankID user info received:', {
      sub: userInfo.sub,
      hasEmail: !!userInfo.email,
      hasName: !!userInfo.name,
      hasPersonalNumber: !!userInfo.signicat_national_id
    })

    if (!userInfo.sub) {
      loginUrl.searchParams.set('error', 'signicat-user')
      return NextResponse.redirect(loginUrl)
    }

    const issuer = getSignicatAuthority()
    const fallbackUid = signicatUidFor(issuer, userInfo.sub)
    let uid = fallbackUid

    // Try to find existing user by email or personal number
    if (userInfo.email) {
      try {
        uid = (await auth.getUserByEmail(userInfo.email.toLowerCase())).uid
      } catch {
        uid = fallbackUid
      }
    }

    const userData: {displayName?: string; email?: string; emailVerified?: boolean} = {
      displayName: userInfo.name || userInfo.given_name && userInfo.family_name ? `${userInfo.given_name} ${userInfo.family_name}` : undefined
    }

    if (userInfo.email) {
      userData.email = userInfo.email.toLowerCase()
      userData.emailVerified = userInfo.email_verified ?? true
    }

    const customClaims: {signicat: boolean; signicatSub: string; bankid: boolean; personalNumber?: string} = {
      signicat: true,
      signicatSub: userInfo.sub,
      bankid: true
    }

    if (userInfo.signicat_national_id) {
      customClaims.personalNumber = userInfo.signicat_national_id
    }

    try {
      await auth.getUser(uid)
      await auth.updateUser(uid, userData)
    } catch {
      await auth.createUser({
        uid,
        ...userData
      })
    }

    const customToken = await auth.createCustomToken(uid, customClaims)

    clearSignicatFlowCookies()
    cookies().set('signicat_firebase_token', customToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 60
    })
    cookies().set('signicat_redirect', redirectPath, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 60
    })

    const completeUrl = new URL('/login', origin)
    completeUrl.searchParams.set('signicat', 'complete')
    return NextResponse.redirect(completeUrl)
  } catch (error) {
    console.error('Signicat callback failed', error)
    clearSignicatFlowCookies()
    loginUrl.searchParams.set('error', 'signicat-callback')
    return NextResponse.redirect(loginUrl)
  }
}
