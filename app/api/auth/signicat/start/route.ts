import {cookies} from 'next/headers'
import {NextRequest, NextResponse} from 'next/server'
import {getRedirectUri, getSignicatAuthority, getSignicatClientConfig, randomBase64Url, sha256Base64Url} from '@/libs/signicat/oidc'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authority = getSignicatAuthority()
    const {clientId} = getSignicatClientConfig()
    const origin = request.nextUrl.origin
    const secure = request.nextUrl.protocol === 'https:'
    const redirectUri = getRedirectUri(origin)
    
    console.log('Signicat OAuth flow starting:', {
      origin,
      redirectUri,
      authority,
      clientId: clientId.substring(0, 8) + '...'
    })
    const state = randomBase64Url()
    const nonce = randomBase64Url()
    const codeVerifier = randomBase64Url(64)
    const redirectPath = request.nextUrl.searchParams.get('redirect') || '/'
    
    // BankID authentication - use urn:signicat:oidc:method:sbid for Swedish BankID
    const acrValues = process.env.SIGNICAT_ACR_VALUES || 'urn:signicat:oidc:method:sbid'

    const authorizeUrl = new URL(`${authority}/connect/authorize`)
    authorizeUrl.searchParams.set('client_id', clientId)
    authorizeUrl.searchParams.set('redirect_uri', redirectUri)
    authorizeUrl.searchParams.set('response_type', 'code')
    
    // Use environment variable or safe default (openid is always required)
    // For BankID, we need openid profile to get user information
    const requestedScope = process.env.SIGNICAT_SCOPE || 'openid profile'
    authorizeUrl.searchParams.set('scope', requestedScope)
    
    console.log('Signicat BankID OAuth flow:', {
      scopes: requestedScope,
      acrValues,
      redirectUri
    })
    
    authorizeUrl.searchParams.set('code_challenge', sha256Base64Url(codeVerifier))
    authorizeUrl.searchParams.set('code_challenge_method', 'S256')
    authorizeUrl.searchParams.set('response_mode', 'query')
    authorizeUrl.searchParams.set('state', state)
    authorizeUrl.searchParams.set('nonce', nonce)
    authorizeUrl.searchParams.set('acr_values', acrValues)
    
    // Optional: Add UI locales for Swedish
    authorizeUrl.searchParams.set('ui_locales', 'sv')

    const cookieOptions = {
      httpOnly: true,
      secure,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 10 * 60
    }

    cookies().set('signicat_state', state, cookieOptions)
    cookies().set('signicat_nonce', nonce, cookieOptions)
    cookies().set('signicat_code_verifier', codeVerifier, cookieOptions)
    cookies().set('signicat_redirect', redirectPath, cookieOptions)

    return NextResponse.redirect(authorizeUrl)
  } catch (error) {
    console.error('Unable to start Signicat login', error)
    return NextResponse.redirect(new URL('/login?error=signicat-config', request.nextUrl.origin))
  }
}
