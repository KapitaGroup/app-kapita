import {useTranslations} from 'next-intl'
import Card from './Card'
import type {OpportunityType} from '@/utils/types'

type Props = {
  opportunities: OpportunityType[]
}
const Opportunities = ({opportunities}: Props) => {
  const t = useTranslations('OpportunitiesPage')

  if (!opportunities.length) return null

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-h3">{t('title')}</h1>
        <p className="pb-2 text-description">
          {t('opportunities-count', {count: opportunities.length})}
        </p>
      </div>
      <div className="flex flex-col gap-y-6">
        {opportunities.map((opportunity, i) => (
          <Card key={opportunity.id} {...opportunity} index={i} />
        ))}
      </div>
    </div>
  )
}

export default Opportunities
