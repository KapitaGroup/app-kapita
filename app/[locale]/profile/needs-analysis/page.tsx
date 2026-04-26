'use client'
import {useSearchParams} from 'next/navigation'
import {useRouter} from '@/i18n/routing'
import {useEffect, useState} from 'react'
import Introduction from '../components/Introduction'
import {existsProfile} from '@/services/profile'
import {auth} from '@/libs/firebase/config-client'
import {useAuthState} from 'react-firebase-hooks/auth'
import Controls from '../components/Controls'
import type {ContactFormsCompletedType, ProfileType} from '@/utils/types'
import StageStatus from '../components/StageStatus'
import {FormProvider, useForm} from 'react-hook-form'
import NeedsAnalysisSteps from './components/NeedsAnalysisSteps'
import {formsCompletedHubspot} from '@/services/hubspot'

const NEEDS_ANALYSIS_STEPS = 12

export type NeedsAnalysisForm = Pick<
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
> & {isEdit: boolean}
const Page = () => {
  const [user, isUserLoading] = useAuthState(auth)
  const methods = useForm<NeedsAnalysisForm>({defaultValues: {isEdit: true}})
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email')
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(1)
  const [maxAllowedStep, setMaxAllowedStep] = useState(1)
  const [formStates, setFormStates] = useState<ContactFormsCompletedType>()

  useEffect(() => {
    const fetch = async () => {
      if (isUserLoading) return

      const emailParamExists = !!emailParam
      const profileExists = await existsProfile({email: emailParam})
      const loggedIn = !isUserLoading && !!user?.uid

      if ((emailParamExists && (loggedIn || profileExists)) || (!emailParamExists && !loggedIn)) router.push('/')

      const response = await formsCompletedHubspot(user?.email)
      setFormStates(response)
    }
    fetch()
  }, [emailParam, isUserLoading, router, user?.uid, user?.email])

  if (isUserLoading) return

  const stageStates = [!!formStates?.profileCompleted, !!formStates?.needsAnalysisCompleted, !!formStates?.knowYourCustomerCompleted]

  if (!!emailParam && !started)
    return <Introduction stages={[]} onStart={() => setStarted(true)} buttonLabel="WizardPage.start-needs-analysis" />

  const onStepChange = (increase: boolean) => {
    if (increase) setMaxAllowedStep(prev => Math.max(step + 1, prev))
    setStep(prev => Math.max(Math.min(prev + (increase ? 1 : -1), NEEDS_ANALYSIS_STEPS), 1))
  }

  return (
    <section>
      {!emailParam && <StageStatus stage={2} stageStates={stageStates} />}
      <FormProvider {...methods}>
        <form className="mb-32 mt-24 flex min-h-[70vh] items-center max-content-width xl:mb-32 xl:mt-48 xl:min-h-[60vh]">
          <NeedsAnalysisSteps step={step} onNextStep={() => onStepChange(true)} email={emailParam} formStates={formStates} />
        </form>
      </FormProvider>
      <Controls
        onStepChange={onStepChange}
        step={step}
        maxStep={maxAllowedStep}
        percentage={((maxAllowedStep - 1) / NEEDS_ANALYSIS_STEPS) * 100}
        progressLabelCode="needs-analysis"
      />
    </section>
  )
}
export default Page
