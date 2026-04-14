import type {OpportunityType} from '@/utils/types'
import Attribute from '../../components/Attribute'
import {useTranslations} from 'next-intl'
import {numberFormatter} from '@/utils/numberFormatting'

type Props = OpportunityType
const Attributes = ({
  investmentType,
  investmentSector,
  minInvestmentSize,
  investmentStage,
  investmentTarget,
  returnRate,
  riskFactor
}: Props) => {
  const t = useTranslations()

  return (
    <div className="flex flex-col gap-y-2 xl:flex-row xl:gap-x-8">
      <div className="flex w-full flex-col gap-y-2">
        <Attribute
          label={t('attributes.type.title')}
          value={!!investmentType ? t(`attributes.type.options.${investmentType}`) : ''}
          info="type"
        />
        <Attribute
          label={t('attributes.stage.title')}
          value={!!investmentStage ? t(`attributes.stage.options.${investmentStage}`) : ''}
          info="stage"
        />
        <Attribute label={t('attributes.sector.title')} value={investmentSector} info="minTicketSize" />
      </div>
      <div className="flex w-full flex-col gap-y-2">
        <Attribute label={t('attributes.target.title')} value={numberFormatter(investmentTarget)} info="investmentTarget" />
        <Attribute label={t('attributes.minimal-ticket-size.title')} value={numberFormatter(minInvestmentSize)} info="minTicketSize" />
        <Attribute label={t('attributes.return-rate.title')} value={`${(returnRate ?? 0) * 100} %`} info="returnRate" />
        <Attribute
          label={t('attributes.risk-factor.title')}
          value={!!riskFactor ? t(`attributes.risk-factor.options.${riskFactor}`) : ''}
          info="riskFactor"
        />
      </div>
    </div>
  )
}

export default Attributes
