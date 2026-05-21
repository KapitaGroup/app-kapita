'use client'
import {FormProvider, useForm} from 'react-hook-form'
import LoginOptions from './LoginOptions'
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

const Section = () => {
  const methods = useForm<LoginForm>()

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-8" onSubmit={e => e.preventDefault()}>
        <LoginOptions />
      </form>
    </FormProvider>
  )
}

export default Section
