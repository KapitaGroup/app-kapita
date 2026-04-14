import {type ProfileForm} from '@/app/[locale]/(with menu)/profile/page'
import {airtableClient} from '@/libs/airtable/airtable'
import {getCurrentUser} from '@/libs/firebase/config-admin'
import {userGuard} from '@/utils/apiGuards'
import {dataNotFound404, noUser400} from '@/utils/apiResponses'
import {fetchHubspotContact} from '@/utils/hubspotContact'
import {calculateProgress} from '@/utils/progressCalculator'
import type {ProfileType} from '@/utils/types'

export const GET = async () => {
  const loginId = (await getCurrentUser())?.uid
  if (!loginId) return noUser400()

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

  if (!profile) return dataNotFound404('Profile')

  const hubspotContactInfoResult = await fetchHubspotContact(profile.email)
  if (!hubspotContactInfoResult.ok) return Response.json(profile)
  const hubspotData = await hubspotContactInfoResult.json()
  const hubspotContactInfo = hubspotData.properties

  const hubspotStringToList = (string: string) => string?.split(';') ?? []

  const mergedProfile = {
    ...profile,
    // organizationNumber: '', //todo
    // organizationName: '', //todo
    hubspotId: hubspotData.id,
    personNumber: hubspotContactInfo.personnummer,
    name: `${hubspotContactInfo.firstname ?? ''} ${hubspotContactInfo.lastname ?? ''}`.trim(),
    phone: hubspotContactInfo.phone,
    address: hubspotContactInfo.address,
    postal: hubspotContactInfo.zip,
    city: hubspotContactInfo.city,
    country: hubspotContactInfo.country,
    primaryInvestmentTarget: hubspotContactInfo.primary_investment_target,
    investerType: hubspotContactInfo.investor_type,
    placementHorizon: hubspotStringToList(hubspotContactInfo.placement_horizon),
    placementType: hubspotStringToList(hubspotContactInfo.placement_type),
    investmentSectors: hubspotStringToList(hubspotContactInfo.investment_sectors),
    investmentStages: hubspotStringToList(hubspotContactInfo.investment_stages),
    portfolioSize: hubspotContactInfo.portfolio_size_aum,
    averageInvestmentSize: hubspotContactInfo.average_investment_size,
    riskTolerance: hubspotContactInfo.risk_tolerance,
    nextInvestmentTimeframe: hubspotContactInfo.timeframe_for_the_next_investment,
    investmentStrategy: hubspotStringToList(hubspotContactInfo.investment_strategy),
    investmentOverview: hubspotContactInfo.your_current_investment_overview
  }

  return Response.json(mergedProfile)
}

export const POST = async (request: Request) => {
  const currentUser = await getCurrentUser()
  const loginId = currentUser?.uid
  if (!loginId) return noUser400()

  const profileExists = await airtableClient('Profiles')
    .select({fields: ['id'], filterByFormula: `id='${loginId}'`})
    .firstPage()
  if (!!profileExists?.[0]?.fields?.id) return Response.json(true)

  const profile = await request.json()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {name, isEdit, errors, ...rest} = profile as ProfileForm
  await airtableClient('Profiles').create({...rest, email: rest.email.toLowerCase(), progress: calculateProgress(profile)})

  return Response.json(true)
}

const listToHubspotString = (list?: string[]) => list?.join(';') ?? ''

export const PUT = async (request: Request) => {
  const currentUser = await getCurrentUser()
  const loginId = currentUser?.uid
  if (userGuard(loginId)) return noUser400()

  const profileExists = await airtableClient('Profiles')
    .select({fields: ['id', 'email'], filterByFormula: `loginId='${loginId}'`})
    .firstPage()

  if (!profileExists?.[0]?.id) return dataNotFound404('Profile')

  const profile = (await request.json()) as ProfileForm

  const imageToUpload = !!profile.imageToUpload ? {image: []} : {}

  const profileToUpdate = {
    ...imageToUpload,
    progress: calculateProgress(profile),
    investingFor: profile.investingFor,
    organizationNumber: profile.organizationNumber,
    organizationName: profile.organizationName,
    wizardCompleted: profile.wizardCompleted
  }

  await airtableClient('Profiles').update(profileExists?.[0]?.id, profileToUpdate)

  if (!!profile.imageToUpload) {
    await fetch(`https://content.airtable.com/v0/${process.env.AIRTABLE_BASE}/${profile.id}/image/uploadAttachment`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contentType: 'image/png',
        filename: 'profileImage.png',
        file: profile.imageToUpload
      })
    })
  }

  const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${profile.email}?idProperty=email`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`
    },
    body: JSON.stringify({
      properties: {
        personnummer: profile.personNumber,
        firstname: profile.name?.split(' ')?.[0],
        lastname: profile.name?.split(' ')?.[1],
        phone: profile.phone,
        address: profile.address,
        zip: profile.postal,
        city: profile.city,
        country: profile.country,
        primary_investment_target: profile.primaryInvestmentTarget,
        investor_type: profile.investerType,
        placement_horizon: listToHubspotString(profile.placementHorizon),
        placement_type: listToHubspotString(profile.placementType),
        investment_sectors: listToHubspotString(profile.investmentSectors),
        investment_stages: listToHubspotString(profile.investmentStages),
        portfolio_size_aum: profile.portfolioSize,
        average_investment_size: profile.averageInvestmentSize,
        risk_tolerance: profile.riskTolerance,
        timeframe_for_the_next_investment: profile.nextInvestmentTimeframe,
        investment_strategy: listToHubspotString(profile.investmentStrategy),
        your_current_investment_overview: profile.investmentOverview
      }
    })
  })

  if (!response.ok) {
    console.error(response)
    return Response.json({message: 'Could not save Hubspot values.'}, {status: 400})
  }

  return Response.json(true)
}

export const DELETE = async () => {
  const currentUser = await getCurrentUser()
  const loginId = currentUser?.uid
  if (userGuard(loginId)) return noUser400()

  const profileExists = await airtableClient('Profiles')
    .select({fields: ['id', 'email'], filterByFormula: `loginId='${loginId}'`})
    .firstPage()

  if (!profileExists?.[0]?.id) return dataNotFound404('Profile')

  await airtableClient('Profiles').destroy(profileExists?.[0]?.id)

  // todo delete hubspot contact?

  return Response.json(true)
}
