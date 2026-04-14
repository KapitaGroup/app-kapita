'use server'
import {airtableClient} from '@/libs/airtable/airtable'
import {getCurrentUser} from '@/libs/firebase/config-admin'
import {ProfileType} from '@/utils/types'
import {onboardingUpdateProfileHubspot} from './hubspot'

export const existsProfile = async ({email, loginId}: {email?: string | null; loginId?: string | null}) => {
  if (!loginId && !email) return false

  const profiles = await airtableClient('Profiles')
    .select({
      fields: ['email'],
      filterByFormula: `OR(loginId="${loginId}",email="${email?.toLowerCase()}")`
    })
    .firstPage()
  const exists = !!profiles?.[0]?.fields.email

  return exists
}

export const getProfile = async () => {
  const loginId = (await getCurrentUser())?.uid
  if (!loginId) return

  const profiles = await airtableClient('Profiles')
    .select({
      fields: [
        'id',
        'loginId',
        'image',
        'progress',
        'wizardCompleted',
        'organizationNumber',
        'organizationName',
        'investingFor',
        'email',
        'emailVerified',
        'created'
      ],
      filterByFormula: `loginId='${loginId}'`
    })
    .firstPage()
  const profile = profiles?.[0]?.fields as unknown as ProfileType

  return profile
}

export const onboardingUpdateProfile = async (
  profile: Pick<
    ProfileType,
    | 'investingFor'
    | 'personNumber'
    | 'organizationNumber'
    | 'phone'
    | 'name'
    | 'organizationName'
    | 'address'
    | 'postal'
    | 'city'
    | 'country'
  >
) => {
  const loginId = (await getCurrentUser())?.uid
  if (!loginId) return

  const existingProfile = (
    await airtableClient('Profiles')
      .select({fields: ['id', 'email'], filterByFormula: `loginId='${loginId}'`})
      .firstPage()
  )?.[0]

  if (!existingProfile?.id || !existingProfile?.fields?.email) {
    console.error('Profile does not exist for this update!')
    return
  }

  await airtableClient('Profiles').update(existingProfile?.id, {
    progress: 100,
    investingFor: profile.investingFor,
    organizationNumber: profile.organizationNumber,
    organizationName: profile.organizationName
  })

  await onboardingUpdateProfileHubspot(existingProfile?.fields?.email as string, {
    name: profile.name,
    personNumber: profile.personNumber,
    phone: profile.phone,
    address: profile.address,
    postal: profile.postal,
    city: profile.city,
    country: profile.country
  })
}
