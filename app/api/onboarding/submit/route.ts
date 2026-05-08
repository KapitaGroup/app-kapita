import {NextRequest, NextResponse} from 'next/server'
import {auth} from '@/libs/firebase/config-admin'

export const dynamic = 'force-dynamic'

type Submission = {
  phone: string
  email: string
  investmentExperience: string
  minInvestment: string
  portfolioSize: string
  acceptedTerms: boolean
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization') ?? ''
  const idToken = authHeader.replace(/^Bearer\s+/i, '').trim()
  if (!idToken) return NextResponse.json({error: 'unauthorized'}, {status: 401})

  let decoded
  try {
    decoded = await auth.verifyIdToken(idToken)
  } catch {
    return NextResponse.json({error: 'invalid_token'}, {status: 401})
  }

  let body: Submission
  try {
    body = (await request.json()) as Submission
  } catch {
    return NextResponse.json({error: 'invalid_json'}, {status: 400})
  }

  if (!body.phone || !body.email) return NextResponse.json({error: 'missing_fields'}, {status: 400})
  if (!body.acceptedTerms) return NextResponse.json({error: 'terms_required'}, {status: 400})

  const user = await auth.getUser(decoded.uid)
  const claims = (user.customClaims ?? {}) as {personalNumber?: string; signicatSub?: string}

  // Derive name from BankID-provided displayName
  const fullName = (user.displayName || '').trim()
  const [firstName, ...rest] = fullName.split(/\s+/)
  const lastName = rest.join(' ') || firstName

  const intakeUrl = (process.env.BACKOFFICE_URL || 'https://backoffice.kapita.com').replace(/\/$/, '')
  const intakeSecret = process.env.KAPITA_INTAKE_SECRET
  if (!intakeSecret) {
    console.error('KAPITA_INTAKE_SECRET is not configured')
    return NextResponse.json({error: 'intake_not_configured'}, {status: 503})
  }

  try {
    const intakeRes = await fetch(`${intakeUrl}/api/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${intakeSecret}`
      },
      body: JSON.stringify({
        kapitaUid: decoded.uid,
        accountType: 'personal',
        firstName: firstName || 'Unknown',
        lastName: lastName || '',
        email: body.email.toLowerCase(),
        phone: body.phone,
        personalNumber: claims.personalNumber,
        investmentExperience: body.investmentExperience,
        minInvestment: body.minInvestment,
        portfolioSize: body.portfolioSize,
        acceptedTerms: body.acceptedTerms
      }),
      cache: 'no-store'
    })

    if (!intakeRes.ok) {
      const text = await intakeRes.text()
      console.error('Intake submission failed', intakeRes.status, text)
      return NextResponse.json({error: 'intake_failed'}, {status: 502})
    }
  } catch (err) {
    console.error('Intake submission error', err instanceof Error ? err.message : err)
    return NextResponse.json({error: 'intake_failed'}, {status: 502})
  }

  // Mark this Firebase user as having a pending application so middleware can
  // gate the rest of the app until BackOffice approves.
  await auth.setCustomUserClaims(decoded.uid, {
    ...(user.customClaims ?? {}),
    applicationStatus: 'pending'
  })

  return NextResponse.json({success: true})
}
