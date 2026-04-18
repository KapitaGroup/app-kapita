import {airtableClient} from '@/libs/airtable/airtable'
import type {AirtableVerificationsType} from '@/utils/types'
import {type LocaleType, routing} from '@/i18n/routing'
import {getTranslations} from 'next-intl/server'
import EmailVerification from '@/emails/EmailVerification'
import {resend} from '@/libs/resend/resend'

export const PUT = async (request: Request) => {
  try {
    const {id, code} = (await request.json()) as {id: string; code: string}

    const result = await airtableClient('Verifications').find(id)

    const verification = result.fields as unknown as AirtableVerificationsType

    if (!verification) return Response.json('Verification not found!', {status: 400})

    const isVerified = verification.Code === code && new Date(verification['Valid until']).getTime() >= new Date().getTime()

    if (isVerified) {
      await airtableClient('Verifications').destroy(id)
    }

    return Response.json({verified: isVerified}, {status: 200})
  } catch (error) {
    console.error('PUT /api/verifications error:', error)
    return Response.json({message: 'Internal server error'}, {status: 500})
  }
}

export const POST = async (request: Request) => {
  try {
    const {email} = (await request.json()) as {email: string}

    if (!email) return Response.json('Could not verify an email!', {status: 400})

    const emailExists = await airtableClient('Profiles')
      .select({fields: ['email'], filterByFormula: `AND(email='${email}',emailVerified=TRUE())`})
      .firstPage()

    if (!!emailExists?.[0]?.fields?.email) return Response.json('Could not verify an email!', {status: 400})

    const code = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
    const fiveDays = 5 * 24 * 60 * 60 * 1000
    const validUntil = new Date(new Date().getTime() + fiveDays).toISOString()

    const data = {
      Code: code,
      Channel: 'email',
      'Valid until': validUntil
    } as Pick<AirtableVerificationsType, 'Code' | 'Channel'> & {'Valid until': string}

    const response = await airtableClient('Verifications').create(data)

    const locale = (request.url?.split('locale=')?.[1]?.slice(0, 2) ?? routing.defaultLocale) as LocaleType
    const t = await getTranslations({locale, namespace: 'Emails.email-verification'})

    const {error} = await resend.emails.send({
      from: 'Kapita <noreply@kapita.com>',
      to: [email],
      subject: t('subject'),
      react: EmailVerification({
        locale,
        title: t('title'),
        description: t('description'),
        code,
        footer: t('footer')
      })
    })

    if (error) {
      console.error('Resend error:', error?.message)
      return Response.json({message: error?.message}, {status: 400})
    }

    return Response.json({id: response.id}, {status: 200})
  } catch (error) {
    console.error('POST /api/verifications error:', error)
    return Response.json({message: String(error)}, {status: 500})
  }
}
