import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const customToken = cookies().get('signicat_firebase_token')?.value
  const redirect = cookies().get('signicat_redirect')?.value || '/'

  cookies().delete('signicat_firebase_token')
  cookies().delete('signicat_redirect')

  if (!customToken) return NextResponse.json({success: false, error: 'Missing Signicat token'}, {status: 400})

  return NextResponse.json({success: true, customToken, redirect})
}
