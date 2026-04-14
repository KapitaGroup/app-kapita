'use client'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import Introduction from '../components/Introduction'
import {auth} from '@/libs/firebase/config-client'
import {useAuthState} from 'react-firebase-hooks/auth'
import Controls from '../components/Controls'
import {FormProvider, useForm} from 'react-hook-form'
import type {ContactFormsCompletedType, ProfileType} from '@/utils/types'
import ProfileCreateSteps from './components/ProfileCreateSteps'
import StageStatus from '../components/StageStatus'
import {ProfileOnboardingStages} from '@/utils/lists'
import {formsCompletedHubspot} from '@/services/hubspot'

const PROFILE_STEPS = 3

export type CreateProfileForm = Pick<
  ProfileType,
  'investingFor' | 'personNumber' | 'phone' | 'organizationNumber' | 'name' | 'address' | 'postal' | 'city' | 'country' | 'organizationName'
> & {isEdit: boolean}
const Page = () => {
  const [user, isUserLoading] = useAuthState(auth)
  const methods = useForm<CreateProfileForm>({defaultValues: {isEdit: true}})
  const router = useRouter()
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(1)
  const [maxAllowedStep, setMaxAllowedStep] = useState(1)
  const [formStates, setFormStates] = useState<ContactFormsCompletedType>()

  useEffect(() => {
    if (isUserLoading) return
    const loggedIn = !isUserLoading && !!user?.uid
    if (!loggedIn) router.push('/')

    const formCheck = async () => {
      const response = await formsCompletedHubspot(user?.email)
      setFormStates(response)
    }
    formCheck()
  }, [isUserLoading, router, user?.uid, user?.email])

  if (isUserLoading) return

  const stageStates = [!!formStates?.profileCompleted, !!formStates?.needsAnalysisCompleted, !!formStates?.knowYourCustomerCompleted]

  if (!started)
    return <Introduction stages={ProfileOnboardingStages} stagesStates={stageStates} onStart={() => setStarted(true)} buttonLabel="start" />

  const onStepChange = (increase: boolean) => {
    if (increase) setMaxAllowedStep(prev => Math.max(step + 1, prev))
    setStep(prev => (increase ? Math.min(prev + 1, PROFILE_STEPS) : Math.max(prev - 1, 1)))
  }

  return (
    <section>
      <StageStatus stage={1} stageStates={stageStates} />
      <FormProvider {...methods}>
        <form className="mb-32 mt-24 flex min-h-[70vh] items-center max-content-width xl:mb-32 xl:mt-48 xl:min-h-[60vh]">
          <ProfileCreateSteps step={step} onNextStep={() => onStepChange(true)} formStates={formStates} />
        </form>
      </FormProvider>
      <Controls
        onStepChange={onStepChange}
        step={step}
        maxStep={maxAllowedStep}
        percentage={((maxAllowedStep - 1) / PROFILE_STEPS) * 100}
        progressLabelCode="profile"
      />
    </section>
  )
}
export default Page
