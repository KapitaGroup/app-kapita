'use client'
import {useTranslations} from 'next-intl'
import Step from '../../components/Step'
import {useFormContext} from 'react-hook-form'
import RadioField from '@/app/[locale]/(with menu)/profile/components/RadioField'
import {useRouter} from 'next/navigation'
import BadgeField from '@/app/[locale]/(with menu)/profile/components/BadgeField'
import {
  AverageInvestmentSizeList,
  InvesterTypeList,
  InvestmentOverviewList,
  InvestmentSectorList,
  InvestmentStageList,
  InvestmentStrategyList,
  NextInvestmentTimeframeList,
  PlacementHorizonList,
  PlacementTypeList,
  PortfolioSizeList,
  PrimaryInvestmentTargetList,
  RiskToleranceList
} from '@/utils/lists'
import {type NeedsAnalysisForm} from '../page'
import {onboardingUpdateNeedsAnalysisHubspot} from '@/services/hubspot'
import {useState} from 'react'
import type {ContactFormsCompletedType} from '@/utils/types'

type Props = {
  step: number
  onNextStep: () => void
  email: string | null
  formStates?: ContactFormsCompletedType
}
const NeedsAnalysisSteps = ({step, onNextStep, email}: Props) => {//, formStates
  const t = useTranslations()
  const {watch} = useFormContext<NeedsAnalysisForm>()
  const watches = watch()
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const baseStepNumber = !email ? 3 : 0

  const onSave = async () => {
    try {
      setSaving(true)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {isEdit, ...needsAnalysis} = watches
      await onboardingUpdateNeedsAnalysisHubspot(email, needsAnalysis)

      if (!!email) {
// !!FIX THE + in the email handling!
        router.push(`/login?email=${email}`)
        return
      }

      // if (formStates?.knowYourCustomerCompleted)
      router.push('/')
      // else router.push('/profile/know-your-customer')
    } catch (error) {
      console.error('Error while saving Needs Analysis.', error)
    } finally {
      setSaving(false)
    }
  }

  switch (step) {
    case 1:
      return (
        <Step number={baseStepNumber + 1} onOk={onNextStep} titleCode={`needs-analysis-${step}`} okDisabled={!watches.investerType}>
          <RadioField name="investerType" translationCode="invester-type" options={InvesterTypeList} />
        </Step>
      )
    case 2:
      return (
        <Step
          number={baseStepNumber + 2}
          onOk={onNextStep}
          titleCode={`needs-analysis-${step}`}
          okDisabled={!watches.primaryInvestmentTarget}
        >
          <RadioField name="primaryInvestmentTarget" translationCode="primary-investment-target" options={PrimaryInvestmentTargetList} />
        </Step>
      )
    case 3:
      return (
        <Step
          number={baseStepNumber + 3}
          onOk={onNextStep}
          titleCode={`needs-analysis-${step}`}
          okDisabled={!watches.placementHorizon?.length}
        >
          <BadgeField
            name="placementHorizon"
            translationCode="placement-horizon"
            label={t('choose-one-or-more')}
            list={PlacementHorizonList}
            selectedList={watches.placementHorizon}
          />
        </Step>
      )
    case 4:
      return (
        <Step
          number={baseStepNumber + 4}
          onOk={onNextStep}
          titleCode={`needs-analysis-${step}`}
          okDisabled={!watches.placementType?.length}
        >
          <BadgeField
            name="placementType"
            translationCode="placement-type"
            label={t('choose-one-or-more')}
            list={PlacementTypeList}
            selectedList={watches.placementType}
          />
        </Step>
      )
    case 5:
      return (
        <Step
          number={baseStepNumber + 5}
          onOk={onNextStep}
          titleCode={`needs-analysis-${step}`}
          okDisabled={!watches.investmentSectors?.length}
        >
          <BadgeField
            name="investmentSectors"
            translationCode="sector"
            label={t('choose-one-or-more')}
            list={InvestmentSectorList}
            selectedList={watches.investmentSectors}
          />
        </Step>
      )
    case 6:
      return (
        <Step
          number={baseStepNumber + 6}
          onOk={onNextStep}
          titleCode={`needs-analysis-${step}`}
          okDisabled={!watches.investmentStages?.length}
        >
          <BadgeField
            name="investmentStages"
            translationCode="stage"
            label={t('choose-one-or-more')}
            list={InvestmentStageList}
            selectedList={watches.investmentStages}
          />
        </Step>
      )
    case 7:
      return (
        <Step number={baseStepNumber + 7} onOk={onNextStep} titleCode={`needs-analysis-${step}`} okDisabled={!watches.portfolioSize}>
          <RadioField name="portfolioSize" translationCode="portfolio-size" options={PortfolioSizeList} />
        </Step>
      )
    case 8:
      return (
        <Step
          number={baseStepNumber + 8}
          onOk={onNextStep}
          titleCode={`needs-analysis-${step}`}
          okDisabled={!watches.averageInvestmentSize}
        >
          <RadioField name="averageInvestmentSize" translationCode="average-investment-size" options={AverageInvestmentSizeList} />
        </Step>
      )
    case 9:
      return (
        <Step number={baseStepNumber + 9} onOk={onNextStep} titleCode={`needs-analysis-${step}`} okDisabled={!watches.riskTolerance}>
          <RadioField name="riskTolerance" translationCode="risk-factor" options={RiskToleranceList} />
        </Step>
      )
    case 10:
      return (
        <Step
          number={baseStepNumber + 10}
          onOk={onNextStep}
          titleCode={`needs-analysis-${step}`}
          okDisabled={!watches.nextInvestmentTimeframe}
        >
          <RadioField name="nextInvestmentTimeframe" translationCode="next-investment-timeframe" options={NextInvestmentTimeframeList} />
        </Step>
      )
    case 11:
      return (
        <Step
          number={baseStepNumber + 11}
          onOk={onNextStep}
          titleCode={`needs-analysis-${step}`}
          okDisabled={!watches.investmentStrategy?.length}
        >
          <BadgeField
            name="investmentStrategy"
            translationCode="investment-strategy"
            label={t('choose-one-or-more')}
            list={InvestmentStrategyList}
            selectedList={watches.investmentStrategy}
          />
        </Step>
      )
    case 12:
      return (
        <Step
          number={baseStepNumber + 12}
          onOk={onSave}
          titleCode={`needs-analysis-${step}`}
          okDisabled={!watches.investmentOverview || saving}
          loading={saving}
        >
          <RadioField name="investmentOverview" translationCode="investment-overview" options={InvestmentOverviewList} />
        </Step>
      )
    default:
      return <p>This step is undefined!</p>
  }
}

export default NeedsAnalysisSteps
