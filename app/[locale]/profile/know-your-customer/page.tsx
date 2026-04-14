// 'use client'
// import {useRouter, useSearchParams} from 'next/navigation'
// import {useEffect, useState} from 'react'
// import Introduction from '../components/Introduction'
// import {existsProfile} from '@/services/profile'
// import {auth} from '@/libs/firebase/config-client'
// import {useAuthState} from 'react-firebase-hooks/auth'
// import Controls from '../components/Controls'
// import type {ProfileType} from '@/utils/types'
// import StageStatus from '../components/StageStatus'
// import {FormProvider, useForm} from 'react-hook-form'
// // import KnowYourCustomerSteps from './components/KnowYourCustomerSteps'

// export const KNOW_YOUR_CUSTOMER_STEPS = 12

//export type NeedsAnalysisForm = Pick<
//   ProfileType,
//   | 'investerType'
//   | 'primaryInvestmentTarget'
//   | 'placementHorizon'
//   | 'placementType'
//   | 'investmentSectors'
//   | 'investmentStages'
//   | 'portfolioSize'
//   | 'averageInvestmentSize'
//   | 'riskTolerance'
//   | 'nextInvestmentTimeframe'
//   | 'investmentStrategy'
//   | 'investmentOverview'
// > & {isEdit: boolean}
const Page = () => {
  return null
  //   const [user, isUserLoading] = useAuthState(auth)
  //   const methods = useForm<NeedsAnalysisForm>({defaultValues: {isEdit: true}})
  //   const router = useRouter()
  //   const searchParams = useSearchParams()
  //   const email = searchParams.get('email')
  //   const [started, setStarted] = useState(false)
  //   const [step, setStep] = useState(1)
  //   const [maxAllowedStep, setMaxAllowedStep] = useState(1)

  //   useEffect(() => {
  //     const fetch = async () => {
  //       if (isUserLoading) return

  //       const emailExists = !!email
  //       const profileExists = await existsProfile({email})
  //       const loggedIn = !isUserLoading && !!user?.uid

  //       if ((emailExists && (loggedIn || profileExists)) || (!emailExists && !loggedIn)) router.push('/')
  //     }
  //     fetch()
  //   }, [email, isUserLoading, router, user?.uid])

  //   if (isUserLoading) return

  //   if (!!email && !started)
  //     return <Introduction stages={[]} onStart={() => setStarted(true)} buttonLabel="WizardPage.start-know-your-customer" />

  //   const onStepChange = (increase: boolean) => {
  //     if (increase) setMaxAllowedStep(prev => Math.max(step + 1, prev))
  //     setStep(prev => Math.max(Math.min(prev + (increase ? 1 : -1), KNOW_YOUR_CUSTOMER_STEPS), 1))
  //   }

  //   return (
  //     <section>
  //       {/* TODO fix stages statuses */}
  //       {!email && <StageStatus stage={3} stageStates={[false, false, false]} />}
  //       <FormProvider {...methods}>
  //         <form className="mb-32 mt-24 flex min-h-[70vh] items-center max-content-width xl:mb-32 xl:mt-48 xl:min-h-[60vh]">
  //           <KnowYourCustomerSteps step={step} onNextStep={() => onStepChange(true)} email={email} />
  //         </form>
  //       </FormProvider>
  //       <Controls
  //         onStepChange={onStepChange}
  //         step={step}
  //         maxStep={maxAllowedStep}
  //         percentage={((maxAllowedStep - 1) / KNOW_YOUR_CUSTOMER_STEPS) * 100}
  //         progressLabelCode="profile"
  //         // progressLabelCode="know-your-customer"
  //       />
  //     </section>
  //   )
}
export default Page
