'use client'
import {useTranslations} from 'next-intl'
import Button from '@/components/Button'
import Input from '@/components/form/Input'
import {useSearchParams} from 'next/navigation'
import {useEffect, useState} from 'react'
import {useFormContext, useWatch} from 'react-hook-form'
import {type LoginForm} from './Section'
import Title from './Title'
import SectionContainer from './SectionContainer'
import {isEmailValid} from '@/utils/stringValidations'

const LoginOptions = () => {
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [isCreateLoading, setIsCreateLoading] = useState(false)
  const searchParams = useSearchParams()
  const t = useTranslations()
  const {control, setFocus, setValue, getValues} = useFormContext<LoginForm>()

  // Auto-clear validation errors as soon as the user starts typing
  const watchedEmail = useWatch({control, name: 'email'})
  useEffect(() => {
    if (!!watchedEmail) setValue('errors', {})
  }, [watchedEmail, setValue])

  useEffect(() => {
    setFocus('email')
  }, [setFocus])

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (!!emailParam) setValue('email', emailParam)
  }, [searchParams, setValue])

  const validateEmail = () => {
    const email = getValues('email')?.trim()
    if (!email) {
      setValue('errors', {email: 'required'})
      setFocus('email')
      return null
    }
    if (!isEmailValid(email)) {
      setValue('errors', {email: 'incorrect-email-format'})
      setFocus('email')
      return null
    }
    setValue('errors', {})
    return email
  }

  // Existing users → straight to password screen
  const onLoginClick = () => {
    const email = validateEmail()
    if (!email) return

    setIsLoginLoading(true)
    setValue('isCreatingAccount', false)
    setValue('isEmailSet', true)
  }

  // New users → create-account flow (Firebase rejects duplicate emails)
  const onCreateClick = () => {
    const email = validateEmail()
    if (!email) return

    setIsCreateLoading(true)
    setValue('isCreatingAccount', true)
    setValue('isEmailSet', true)
  }

  return (
    <>
      <Title title="log-in-create-account" />
      <SectionContainer>
        <div>
          <Input name="email" label={t('email')} type="email" autoComplete="email" onEnter={onLoginClick} />
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
      </SectionContainer>
    </>
  )
}

export default LoginOptions
