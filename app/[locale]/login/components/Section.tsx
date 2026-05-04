'use client'
import Logo from '@/components/Logo'
import {FormProvider, useForm} from 'react-hook-form'
import LoginOptions from './LoginOptions'
import PhoneVerify from './PhoneVerify'
import type {GoogleAuthCodesType, ProfileType} from '@/utils/types'

export type LoginForm = {
  isEmailSet: boolean
  isPhoneVerification: boolean
  isCreatingAccount: boolean
  emailVerificationCode: string
  password: string | null
  newPassword: string | null
  redirect?: string
  errors: {[key: string]: string}
  error?: 'required' | 'incorrect-email-format' | 'incorrect-phone-format' | 'wrong-code' | GoogleAuthCodesType
} & Pick<ProfileType, 'email' | 'emailVerified' | 'phone'>

const StepIndicator = ({step}: {step: 1 | 2}) => (
  <div className="flex items-center gap-3">
    <div
      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
        step === 1 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-500'
      }`}>
      1
    </div>
    <div className="h-px w-8 bg-neutral-200" />
    <div
      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
        step === 2 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-500'
      }`}>
      2
    </div>
  </div>
)

const Section = () => {
  const methods = useForm<LoginForm>()
  const watches = methods.watch()

  const showStepIndicator = watches.isEmailSet || watches.isPhoneVerification
  const currentStep: 1 | 2 = watches.isPhoneVerification ? 2 : 1

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-8" onSubmit={e => e.preventDefault()}>
        <Logo size="md" url="https://www.kapita.com/" />
        {showStepIndicator && <StepIndicator step={currentStep} />}
        {!watches.isPhoneVerification && <LoginOptions />}
        {watches.isPhoneVerification && <PhoneVerify />}
      </form>
    </FormProvider>
  )
}

export default Section
