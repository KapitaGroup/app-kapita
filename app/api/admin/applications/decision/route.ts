import {NextRequest, NextResponse} from 'next/server'
import {auth} from '@/libs/firebase/config-admin'

export const dynamic = 'force-dynamic'

type DecisionPayload = {
  uid?: string
  applicationId?: string
  decision?: 'approved' | 'rejected'
  reviewedBy?: string
  reviewedAt?: string
}

export async function POST(request: NextRequest) {
  const expected = process.env.KAPITA_INTAKE_SECRET
  if (!expected) return NextResponse.json({error: 'intake_not_configured'}, {status: 503})

  const authHeader = request.headers.get('authorization') ?? ''
  const token = authHeader.replace(/^Bearer\s+/i, '').trim()
  if (token !== expected) return NextResponse.json({error: 'unauthorized'}, {status: 401})

  let body: DecisionPayload
  try {
    body = (await request.json()) as DecisionPayload
  } catch {
    return NextResponse.json({error: 'invalid_json'}, {status: 400})
  }

  if (!body.uid || (body.decision !== 'approved' && body.decision !== 'rejected')) {
    return NextResponse.json({error: 'invalid_payload'}, {status: 400})
  }

  try {
    const user = await auth.getUser(body.uid)
    const existing = (user.customClaims ?? {}) as Record<string, unknown>
    await auth.setCustomUserClaims(body.uid, {
      ...existing,
      applicationStatus: body.decision,
      applicationReviewedAt: body.reviewedAt,
      applicationReviewedBy: body.reviewedBy
    })
    // Force token re-issue so the user picks up the new claim on next refresh.
    await auth.revokeRefreshTokens(body.uid)
  } catch (err) {
    console.error('Decision callback failed', err instanceof Error ? err.message : err)
    return NextResponse.json({error: 'firebase_failed'}, {status: 500})
  }

  return NextResponse.json({success: true})
}
