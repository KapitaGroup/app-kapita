'use client'
import Logo from '@/components/Logo'
import {FormProvider, useForm} from 'react-hook-form'
import LoginOptions from './LoginOptions'
import LoginEmail from './LoginEmail'
import CreateAccount from './CreateAccount'
import LoginPhone from './LoginPhone'
import type {GoogleAuthCodesType, ProfileType} from '@/utils/types'

export type LoginForm = {
  isEmailSet: boolean
  isPhoneLogin: boolean
  isCreatingAccount: boolean
  emailVerificationCode: string
  password: string | null
  newPassword: string | null
  errors: {[key: string]: string}
  error?: 'required' | 'incorrect-email-format' | 'incorrect-phone-format' | 'wrong-code' | GoogleAuthCodesType
} & Pick<ProfileType, 'email' | 'emailVerified' | 'phone'>

const Section = () => {
  const methods = useForm<LoginForm>()
  const watches = methods.watch()

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-8" onSubmit={e => e.preventDefault()}>
        <Logo size="md" url="https://www.kapita.com/" />
        {!watches.isEmailSet && !watches.isPhoneLogin && <LoginOptions />}
        {watches.isPhoneLogin && <LoginPhone />}
        {watches.isEmailSet && !watches.isPhoneLogin && (watches.isCreatingAccount ? <CreateAccount /> : <LoginEmail />)}
      </form>
    </FormProvider>
  )
}

export default Section
