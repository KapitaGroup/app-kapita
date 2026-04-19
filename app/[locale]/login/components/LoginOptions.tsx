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
  const [isNextLoginLoading, setIsNextLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
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

  const onNextClick = async () => {
    setIsNextLoginLoading(true)
    const email = getValues('email')

    if (!email) {
      setValue('errors', {email: 'required'})
      setIsNextLoginLoading(false)
      return
    }

    const isValid = isEmailValid(email)
    if (!isValid) {
      setValue('errors', {email: 'incorrect-email-format'})
      setIsNextLoginLoading(false)
      return
    }

    setValue('errors', {})
    const profileExists = await checkProfileExists({email})
    setValue('isCreatingAccount', !profileExists)
    setValue('isEmailSet', true)
    setIsNextLoginLoading(false)
  }

  return (
    <>
      <Title title="log-in-create-account" />
      <SectionContainer>
        <div>
          <Input name="email" label={t('email')} onEnter={onNextClick} />
        </div>
        <Button
          text={t('next')}
          variant="outlined"
          icon={<ArrowIcon />}
          iconPosition="end"
          onClick={onNextClick}
          loading={isNextLoginLoading}
        />
        <Error error={loginError} />
      </SectionContainer>
    </>
  )
}

export default LoginOptions
