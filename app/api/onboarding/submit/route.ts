import {NextRequest, NextResponse} from 'next/server'
import {auth} from '@/libs/firebase/config-admin'

export const dynamic = 'force-dynamic'

type Submission = {
  firstName?: string
  lastName?: string
  personalNumber?: string
  address?: string
  postalCode?: string
  city?: string
  phone?: string
  email?: string
  investorType?: 'private' | 'company' | ''
  experience?: string
  focus?: string
  typicalInvestment?: string
  portfolioSize?: string
  riskAccepted?: boolean[]
  responsibilityAccepted?: boolean[]
  termsAccepted?: boolean
}

const allTrue = (arr: unknown): boolean =>
  Array.isArray(arr) && arr.length > 0 && arr.every(v => v === true)

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

  if (
    !body.address?.trim() ||
    !body.postalCode?.trim() ||
    !body.city?.trim() ||
    !body.phone?.trim() ||
    !body.email?.trim() ||
    !body.investorType
  ) {
    return NextResponse.json({error: 'missing_fields'}, {status: 400})
  }
  if (!body.experience || !body.focus || !body.typicalInvestment || !body.portfolioSize) {
    return NextResponse.json({error: 'missing_profile'}, {status: 400})
  }
  if (!allTrue(body.riskAccepted) || !allTrue(body.responsibilityAccepted) || body.termsAccepted !== true) {
    return NextResponse.json({error: 'terms_required'}, {status: 400})
  }

  const user = await auth.getUser(decoded.uid)
  const claims = (user.customClaims ?? {}) as {personalNumber?: string; signicatSub?: string}

  const bankIdFullName = (user.displayName || '').trim()
  const [bankIdFirst, ...bankIdRest] = bankIdFullName.split(/\s+/)
  const firstName = body.firstName?.trim() || bankIdFirst || 'Unknown'
  const lastName = body.lastName?.trim() || bankIdRest.join(' ') || ''
  const personalNumber = body.personalNumber?.trim() || claims.personalNumber

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
        accountType: body.investorType === 'company' ? 'company' : 'personal',
        firstName,
        lastName,
        email: body.email.toLowerCase(),
        phone: body.phone,
        personalNumber,
        address: body.address,
        postalCode: body.postalCode,
        city: body.city,
        investorType: body.investorType,
        experience: body.experience,
        focus: body.focus,
        typicalInvestment: body.typicalInvestment,
        portfolioSize: body.portfolioSize,
        riskAccepted: body.riskAccepted,
        responsibilityAccepted: body.responsibilityAccepted,
        termsAccepted: body.termsAccepted
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

  await auth.setCustomUserClaims(decoded.uid, {
    ...(user.customClaims ?? {}),
    applicationStatus: 'pending'
  })

  return NextResponse.json({success: true})
}
