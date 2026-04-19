'use client'
import {useTranslations} from 'next-intl'
import Button from '@/components/Button'
import ArrowIcon from '@/icons/ArrowIcon'
import Input from '@/components/form/Input'
import {useSearchParams} from 'next/navigation'
import {useEffect, useState} from 'react'
import {useFormContext} from 'react-hook-form'
import {type LoginForm} from './Section'
import Title from './Title'
import SectionContainer from './SectionContainer'
import {isEmailValid} from '@/utils/stringValidations'
import {checkProfileExists} from '@/data/checkProfileExists'
import Error from '@/components/form/Error'

const LoginOptions = () => {
  const [isNextLoading, setIsNextLoading] = useState(false)
  const [isLoginLoading, setIsLoginLoading] = useState(false)
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

  // Checks if account exists and routes to login or create account
  const onNextClick = async () => {
    const email = validateEmail()
    if (!email) return

    setIsNextLoading(true)
    setValue('errors', {})
    const profileExists = await checkProfileExists({email})
    setValue('isCreatingAccount', !profileExists)
    setValue('isEmailSet', true)
    setIsNextLoading(false)
  }

  // Skips the profile check — goes straight to the password screen
  const onLoginClick = () => {
    const email = validateEmail()
    if (!email) return

    setIsLoginLoading(true)
    setValue('errors', {})
    setValue('isCreatingAccount', false)
    setValue('isEmailSet', true)
    setIsLoginLoading(false)
  }

  return (
    <>
      <Title title="log-in-create-account" />
      <SectionContainer>
        <div>
          <Input name="email" label={t('email')} onEnter={onNextClick} />
        </div>
        <Button
          text={t('login')}
          variant="outlined"
          onClick={onLoginClick}
          loading={isLoginLoading}
        />
        <div className="flex items-center gap-x-2">
          <span className="w-full border-t-[1px] border-neutral-300" />
          {t('or')}
          <span className="w-full border-t-[1px] border-neutral-300" />
        </div>
        <Button
          text={t('LoginPage.create-new-account')}
          variant="link"
          icon={<ArrowIcon />}
          iconPosition="end"
          onClick={onNextClick}
          loading={isNextLoading}
          fluid={false}
          className="flex items-center justify-center gap-1"
        />
        {!!emailError && (
          <Error error={emailError} />
        )}
      </SectionContainer>
    </>
  )
}

export default LoginOptions
