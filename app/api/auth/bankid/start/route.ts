import {cookies} from 'next/headers'
import {NextRequest, NextResponse} from 'next/server'
import {startBankIdSession} from '@/libs/signicat/restApi'

export const dynamic = 'force-dynamic'

const getEndUserIp = (request: NextRequest) => {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  return request.headers.get('x-real-ip') || '0.0.0.0'
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {redirect?: string}
    const redirect = body.redirect || '/onboarding'
    const secure = request.nextUrl.protocol === 'https:'

    const session = await startBankIdSession({endUserIp: getEndUserIp(request)})

    cookies().set('bankid_session_id', session.id, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 10 * 60
    })
    cookies().set('bankid_redirect', redirect, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 10 * 60
    })

    return NextResponse.json({
      success: true,
      qrData: session.idpData?.qrData,
      autoStartToken: session.idpData?.autoStartToken
    })
  } catch (error) {
    console.error('BankID session start failed', error instanceof Error ? error.message : error)
    return NextResponse.json({success: false, error: 'bankid-start-failed'}, {status: 500})
  }
}
