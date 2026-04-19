'use client'
import {useTranslations} from 'next-intl'
import Button from '@/components/Button'
import Input from '@/components/form/Input'
import {useSearchParams} from 'next/navigation'
import {useEffect, useState} from 'react'
import {useFormContext} from 'react-hook-form'
import {type LoginForm} from './Section'
import Title from './Title'
import SectionContainer from './SectionContainer'
import {isEmailValid} from '@/utils/stringValidations'
import Error from '@/components/form/Error'

const LoginOptions = () => {
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [isCreateLoading, setIsCreateLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const searchParams = useSearchParams()
  const t = useTranslations()
  const {setFocus, setValue, getValues} = useFormContext<LoginForm>()

  useEffect(() => {
    setFocus('email')
  }, [setFocus])

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (!!emailParam) setValue('email', emailParam)
  }, [searchParams, setValue])

  const validateEmail = () => {
    const email = getValues('email')
    if (!email) {
      setEmailError('required')
      return null
    }
    if (!isEmailValid(email)) {
      setEmailError('incorrect-email-format')
      return null
    }
    setEmailError('')
    return email
  }

  // Existing users → go directly to password screen
  const onLoginClick = () => {
    const email = validateEmail()
    if (!email) return

    setIsLoginLoading(true)
    setValue('errors', {})
    setValue('isCreatingAccount', false)
    setValue('isEmailSet', true)
    setIsLoginLoading(false)
  }

  // New users → go directly to create-account flow (Firebase will reject if email already exists)
  const onCreateClick = () => {
    const email = validateEmail()
    if (!email) return

    setIsCreateLoading(true)
    setValue('errors', {})
    setValue('isCreatingAccount', true)
    setValue('isEmailSet', true)
    setIsCreateLoading(false)
  }

  return (
    <>
      <Title title="log-in-create-account" />
      <SectionContainer>
        <div>
          <Input name="email" label={t('email')} onEnter={onLoginClick} />
        </div>
        <Button
          text={t('login')}
          variant="outlined"
          onClick={onLoginClick}
          loading={isLoginLoading}
        />
        <div className="flex items-center gap-x-2 py-1">
          <span className="w-full border-t-[1px] border-neutral-300" />
          <span className="text-sm text-neutral-500">{t('or')}</span>
          <span className="w-full border-t-[1px] border-neutral-300" />
        </div>
        <Button
          text={t('LoginPage.create-new-account')}
          variant="outlined"
          onClick={onCreateClick}
          loading={isCreateLoading}
        />
        {!!emailError && <Error error={emailError} />}
      </SectionContainer>
    </>
  )
}

export default LoginOptions
