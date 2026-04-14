import {useTranslations} from 'next-intl'
import {useFormContext} from 'react-hook-form'
import {type ProfileForm} from '../page'
import RadioField from './RadioField'
import {
  InvesterTypeList,
  PlacementHorizonList,
  PrimaryInvestmentTargetList,
  PlacementTypeList,
  InvestmentSectorList,
  InvestmentStrategyList,
  PortfolioSizeList,
  AverageInvestmentSizeList,
  RiskToleranceList,
  NextInvestmentTimeframeList,
  InvestmentStageList,
  InvestmentOverviewList
} from '@/utils/lists'
import BadgeField from './BadgeField'

const InvestmentActivity = () => {
  const t = useTranslations()
  const {watch} = useFormContext<ProfileForm>()
  const watches = watch()

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="text-h4">{t('ProfilePage.titles.investment-activity')}</h1>
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <RadioField
          name="primaryInvestmentTarget"
          translationCode="primary-investment-target"
          label={t('attributes.primary-investment-target.title')}
          options={PrimaryInvestmentTargetList}
        />
        <RadioField
          name="investerType"
          translationCode="invester-type"
          label={t('attributes.invester-type.title')}
          options={InvesterTypeList}
        />
        <BadgeField
          name="placementHorizon"
          translationCode="placement-horizon"
          label={t('attributes.placement-horizon.title')}
          list={PlacementHorizonList}
          selectedList={watches.placementHorizon}
        />
        <BadgeField
          name="placementType"
          translationCode="placement-type"
          label={t('attributes.placement-type.title')}
          list={PlacementTypeList}
          selectedList={watches.placementType}
        />
        <BadgeField
          name="investmentSectors"
          translationCode="sector"
          label={t('attributes.sector.title2')}
          list={InvestmentSectorList}
          selectedList={watches.investmentSectors}
        />
        <BadgeField
          name="investmentStages"
          translationCode="stage"
          label={t('attributes.stage.title2')}
          list={InvestmentStageList}
          selectedList={watches.investmentStages}
        />
        <RadioField
          name="portfolioSize"
          translationCode="portfolio-size"
          label={t('attributes.portfolio-size.title')}
          options={PortfolioSizeList}
        />
        <RadioField
          name="averageInvestmentSize"
          translationCode="average-investment-size"
          label={t('attributes.average-investment-size.title')}
          options={AverageInvestmentSizeList}
        />
        <RadioField
          name="riskTolerance"
          translationCode="risk-factor"
          label={t('attributes.risk-factor.title2')}
          options={RiskToleranceList}
        />
        <RadioField
          name="nextInvestmentTimeframe"
          translationCode="next-investment-timeframe"
          label={t('attributes.next-investment-timeframe.title')}
          options={NextInvestmentTimeframeList}
        />
        <BadgeField
          name="investmentStrategy"
          translationCode="investment-strategy"
          label={t('attributes.investment-strategy.title')}
          list={InvestmentStrategyList}
          selectedList={watches.investmentStrategy}
        />
        <RadioField
          name="investmentOverview"
          translationCode="investment-overview"
          label={t('attributes.investment-overview.title')}
          options={InvestmentOverviewList}
        />
      </div>
    </div>
  )
}

export default InvestmentActivity
