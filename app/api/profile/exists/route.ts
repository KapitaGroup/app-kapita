import {airtableClient} from '@/libs/airtable/airtable'
import type {ProfileType} from '@/utils/types'

export const PUT = async (request: Request) => {
  try {
    const data = (await request.json()) as Pick<ProfileType, 'loginId' | 'email'>

    if (!data.loginId && !data.email) return Response.json(false)

    const profiles = await airtableClient('Profiles')
      .select({
        fields: ['id'],
        filterByFormula: `OR(loginId="${data.loginId}",email="${data.email?.toLowerCase()}")`
      })
      .firstPage()
    const exists = !!profiles?.[0]?.fields.id

    return Response.json(exists)
  } catch (error) {
    console.error('Error checking profile existence:', error)
    return Response.json(false, {status: 500})
  }
}
