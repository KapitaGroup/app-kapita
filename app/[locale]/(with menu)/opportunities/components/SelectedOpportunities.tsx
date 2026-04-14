import {useTranslations} from 'next-intl'
import type {OpportunityType} from '@/utils/types'
import Card from './Card'

type Props = {
  opportunities: OpportunityType[]
}

const SelectedOpportunities = ({opportunities}: Props) => {
  const t = useTranslations()

  if (!opportunities.length) return null

  return (
    <div className="flex flex-col gap-y-6 xl:gap-y-4">
      <div className="flex flex-col gap-y-1 xl:gap-y-2">
        <h1 className="text-h2">{t('Menu.nav.opportunities')}</h1>
        <h1 className="text-h3">{t('OpportunitiesPage.description')}</h1>
      </div>
      <div className="flex flex-col gap-y-6">
        {opportunities.map((opportunity, i) => (
          <Card key={opportunity.id} {...opportunity} index={i} />
        ))}
      </div>
    </div>
  )
}

export default SelectedOpportunities
