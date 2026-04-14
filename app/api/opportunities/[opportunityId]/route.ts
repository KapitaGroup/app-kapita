import {type LocaleType, routing} from '@/i18n/routing'
import {airtableClient} from '@/libs/airtable/airtable'
import {getLocalizedLabel} from '@/libs/airtable/helpers'
import {getCurrentUser} from '@/libs/firebase/config-admin'
import {userGuard} from '@/utils/apiGuards'
import {dataNotFound404, noUser400} from '@/utils/apiResponses'
import {numberArray} from '@/utils/numberArray'
import type {AirtableOpportunityType, OpportunityType} from '@/utils/types'

export const GET = async (request: Request, {params}: {params: {opportunityId: string}}) => {
  const currentUser = await getCurrentUser()
  const loginId = currentUser?.uid
  if (userGuard(loginId)) return noUser400()

  const locale = request.url.split('locale=')[1].slice(0, 2) ?? routing.defaultLocale

  const result = await airtableClient('Opportunities').find(params.opportunityId)

  const opportunity = map(result.fields as unknown as AirtableOpportunityType, locale as LocaleType)

  if (!opportunity) return dataNotFound404('Opportunities')
  else return Response.json(opportunity)
}

const map = (opportunity: AirtableOpportunityType, locale: LocaleType): Partial<OpportunityType> => ({
  id: opportunity['Id'],
  status: opportunity['Status'],
  image: opportunity['Cover image']?.[0]?.url,
  miniImage: opportunity['Cover image']?.[0]?.thumbnails?.small?.url,
  name: opportunity[getLocalizedLabel('Opportunity title', locale)] as string,
  company: opportunity['Company name'],
  headquarters: opportunity[getLocalizedLabel('Head quarter location', locale)] as string,
  investmentSector: opportunity['Sector'],
  investmentType: opportunity['Investment type'],
  investmentStage: opportunity['Investment Stage'],
  minInvestmentSize: opportunity['Minimal Ticket Size'],
  investmentTarget: opportunity['Investment target (SEK)'],
  returnRate: opportunity['Internal rate of return (IRR)'],
  riskFactor: opportunity['Risk factor'],
  memorandum: opportunity['Memorandum'],
  verifiedLink: opportunity['Verified link'],
  investors: opportunity['Investors']?.map((_, index) => ({
    name: opportunity['Name (from Investors)'][index],
    image: opportunity['Image (from Investors)'][index]?.url
  })),
  sections: numberArray(4).map(section => {
    const titleDescription = numberArray(4).map(iteration => ({
      [`title${iteration}`]: opportunity[getLocalizedLabel(`Section ${section} - Title ${iteration}`, locale)] as string,
      [`description${iteration}`]: opportunity[getLocalizedLabel(`Section ${section} - Description ${iteration}`, locale)] as string
    }))

    return {
      heading: opportunity[getLocalizedLabel(`Section ${section} - Heading`, locale)] as string,
      ...Object.assign({}, ...titleDescription)
    }
  })
})
