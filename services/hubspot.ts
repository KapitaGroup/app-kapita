'use server'
import {getCurrentUser} from '@/libs/firebase/config-admin'
import {HubspotContactPropertyList} from '@/utils/lists'
import type {ProfileType} from '@/utils/types'

const BASE_URL = 'https://api.hubapi.com/'

export const fetchHubspotContact = async (email: string) => {
  if (!email) return

  return await fetch(
    `${BASE_URL}crm/v3/objects/contacts/${decodeURIComponent(email)}?&idProperty=email&properties=${HubspotContactPropertyList.join(',')}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`
      }
    }
  )
}

export const formsCompletedHubspot = async (email?: string | null) => {
  if (!email) return

  const response = await fetch(
    `${BASE_URL}crm/v3/objects/contacts/${decodeURIComponent(email)}?&idProperty=email&properties=profile_completed,needs_analysis_completed,know_your_customer_completed`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`
      }
    }
  )

  if (!response.ok) {
    console.error('Failed to get Contact forms.')
    return
  }

  const body = await response.json()

  const result = {
    email: body.properties.email as string,
    profileCompleted: hubspotBoolean(body.properties.profile_completed),
    needsAnalysisCompleted: hubspotBoolean(body.properties.needs_analysis_completed),
    knowYourCustomerCompleted: hubspotBoolean(body.properties.know_your_customer_completed)
  }

  return result
}

type Props = Pick<ProfileType, 'name' | 'personNumber' | 'phone' | 'address' | 'postal' | 'city' | 'country'>
export const onboardingUpdateProfileHubspot = async (email: string, profile: Props) => {
  if (!email) return

  const response = await fetch(`${BASE_URL}crm/v3/objects/contacts/${decodeURIComponent(email)}?idProperty=email`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`
    },
    body: JSON.stringify({
      properties: {
        profile_completed: true,
        personnummer: profile.personNumber,
        firstname: profile.name?.split(' ')?.[0],
        lastname: profile.name?.split(' ')?.[1],
        phone: profile.phone,
        address: profile.address,
        zip: profile.postal,
        city: profile.city,
        country: profile.country
      }
    })
  })

  if (!response.ok) {
    console.error(response)
    return {message: 'Could not save Hubspot Profile values.'}
  }

  return true
}

export const onboardingUpdateNeedsAnalysisHubspot = async (
  email: string | null,
  needsAnalysis: Pick<
    ProfileType,
    | 'investerType'
    | 'primaryInvestmentTarget'
    | 'placementHorizon'
    | 'placementType'
    | 'investmentSectors'
    | 'investmentStages'
    | 'portfolioSize'
    | 'averageInvestmentSize'
    | 'riskTolerance'
    | 'nextInvestmentTimeframe'
    | 'investmentStrategy'
    | 'investmentOverview'
  >
) => {
  let profileEmail: string | undefined | null = email
  if (!profileEmail) {
    profileEmail = (await getCurrentUser())?.email
    if (!profileEmail) return
  }

  try {
    const response = await fetch(`${BASE_URL}crm/v3/objects/contacts/${decodeURIComponent(profileEmail)}?idProperty=email`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`
      },
      body: JSON.stringify({
        properties: {
          profile_completed: true,
          needs_analysis_completed: true,
          primary_investment_target: needsAnalysis.primaryInvestmentTarget,
          investor_type: needsAnalysis.investerType,
          placement_horizon: listToHubspotString(needsAnalysis.placementHorizon),
          placement_type: listToHubspotString(needsAnalysis.placementType),
          investment_sectors: listToHubspotString(needsAnalysis.investmentSectors),
          investment_stages: listToHubspotString(needsAnalysis.investmentStages),
          portfolio_size_aum: needsAnalysis.portfolioSize,
          average_investment_size: needsAnalysis.averageInvestmentSize,
          risk_tolerance: needsAnalysis.riskTolerance,
          timeframe_for_the_next_investment: needsAnalysis.nextInvestmentTimeframe,
          investment_strategy: listToHubspotString(needsAnalysis.investmentStrategy),
          your_current_investment_overview: needsAnalysis.investmentOverview
        }
      })
    })

    if (!response.ok) {
      console.error(response)
      return {message: 'Could not save Hubspot Needs Analysis values.'}
    }

    return true
  } catch (error) {
    console.error('Hubspot error!', error)
  }
}

const hubspotBoolean = (value?: string | boolean) => value === true || value === 'true'
const listToHubspotString = (list?: string[]) => list?.join(';') ?? ''
