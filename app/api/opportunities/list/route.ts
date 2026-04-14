import {type LocaleType, routing} from '@/i18n/routing'
import {airtableClient} from '@/libs/airtable/airtable'
import {getLocalizedLabel} from '@/libs/airtable/helpers'
import {getCurrentUser} from '@/libs/firebase/config-admin'
import {userGuard} from '@/utils/apiGuards'
import {dataNotFound404, noUser400} from '@/utils/apiResponses'
import type {AirtableOpportunityType, OpportunityType} from '@/utils/types'

export const GET = async (request: Request) => {
  const currentUser = await getCurrentUser()
  const loginId = currentUser?.uid
  if (userGuard(loginId)) return noUser400()

  const locale = (request.url.split('locale=')[1].slice(0, 2) ?? routing.defaultLocale) as LocaleType

  const result = await airtableClient('Opportunities')
    .select({
      fields: [
        'Id',
        'Selected opportunity',
        'Status',
        'Cover image',
        getLocalizedLabel('Opportunity title', locale),
        'Company name',
        'Sector',
        'Investment type',
        'Investment Stage',
        'Minimal Ticket Size'
      ],
      filterByFormula: 'Publish=TRUE()',
      sort: [{field: 'Created time', direction: 'desc'}]
    })
    .all()
  const opportunities = result?.map(opportunity => map(opportunity.fields as unknown as AirtableOpportunityType, locale as LocaleType))

  if (!opportunities) return dataNotFound404('Opportunities')
  else return Response.json(opportunities)
}

const map = (opportunity: AirtableOpportunityType, locale: LocaleType): Partial<OpportunityType> => ({
  id: opportunity['Id'],
  selected: opportunity['Selected opportunity'],
  status: opportunity['Status'],
  image: opportunity['Cover image']?.[0]?.url,
  miniImage: opportunity['Cover image']?.[0]?.thumbnails?.small?.url,
  name: opportunity[getLocalizedLabel('Opportunity title', locale)] as string,
  company: opportunity['Company name'],
  investmentSector: opportunity['Sector'],
  investmentType: opportunity['Investment type'],
  investmentStage: opportunity['Investment Stage'],
  minInvestmentSize: opportunity['Minimal Ticket Size']
})
