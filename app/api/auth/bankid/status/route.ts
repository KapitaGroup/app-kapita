import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import {auth} from '@/libs/firebase/config-admin'
import {getBankIdSession, signicatUidFor} from '@/libs/signicat/restApi'

export const dynamic = 'force-dynamic'

const SIGNICAT_ISSUER = 'signicat-rest'

export async function GET() {
  const sessionId = cookies().get('bankid_session_id')?.value
  if (!sessionId) return NextResponse.json({success: false, error: 'no-session'}, {status: 400})

  let session
  try {
    session = await getBankIdSession(sessionId)
  } catch (error) {
    console.error('BankID session poll failed', error)
    return NextResponse.json({success: false, error: 'bankid-poll-failed'}, {status: 500})
  }

  const status = session.status

  if (status !== 'SUCCESS') {
    return NextResponse.json({
      success: true,
      status,
      qrData: session.idpData?.qrData,
      sbidStatus: session.idpData?.sbidStatus,
      error: session.error
    })
  }

  const subject = session.subject || {}
  // Signicat sometimes returns `nin` as an object like `{value, type}`
  // depending on the provider response shape — normalise to a plain string so
  // downstream consumers and Firebase custom claims stay typed correctly.
  const extractString = (raw: unknown): string | undefined => {
    if (typeof raw === 'string') return raw
    if (raw && typeof raw === 'object') {
      const obj = raw as Record<string, unknown>
      if (typeof obj.value === 'string') return obj.value
      if (typeof obj.nin === 'string') return obj.nin
    }
    return undefined
  }
  const ninString = extractString(subject.nin)
  const sub = subject.sub || ninString
  if (!sub) {
    return NextResponse.json({success: false, error: 'bankid-missing-subject'}, {status: 500})
  }

  try {
    const uid = signicatUidFor(SIGNICAT_ISSUER, sub)
    const displayName = subject.name || [subject.firstName, subject.lastName].filter(Boolean).join(' ') || undefined

    const userData: {displayName?: string; email?: string; emailVerified?: boolean} = {displayName}
    if (subject.email) {
      userData.email = subject.email.toLowerCase()
      userData.emailVerified = true
    }

    try {
      await auth.getUser(uid)
      await auth.updateUser(uid, userData)
    } catch {
      await auth.createUser({uid, ...userData})
    }

    const customClaims: {signicat: boolean; bankid: boolean; signicatSub: string; personalNumber?: string} = {
      signicat: true,
      bankid: true,
      signicatSub: sub
    }
    if (ninString) customClaims.personalNumber = ninString

    const customToken = await auth.createCustomToken(uid, customClaims)
    const redirect = cookies().get('bankid_redirect')?.value || '/onboarding'

    cookies().delete('bankid_session_id')
    cookies().delete('bankid_redirect')

    return NextResponse.json({success: true, status: 'SUCCESS', customToken, redirect})
  } catch (error) {
    console.error('BankID Firebase user provisioning failed', error)
    return NextResponse.json({success: false, error: 'bankid-firebase-failed'}, {status: 500})
  }
}
