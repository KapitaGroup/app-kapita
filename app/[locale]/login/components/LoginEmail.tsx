'use client'
import Input from '@/components/form/Input'
import Title from './Title'
import Button from '@/components/Button'
import {useTranslations} from 'next-intl'
import {useFormContext} from 'react-hook-form'
import {type LoginForm} from './Section'
import {signInWithEmail} from '@/libs/firebase/auth'
import {useSearchParams} from 'next/navigation'
import SectionContainer from './SectionContainer'
import {useEffect, useState} from 'react'
import {useRouter} from '@/i18n/routing'
import type {GoogleAuthCodesType} from '@/utils/types'
import {sendPasswordResetEmail} from 'firebase/auth'
import {auth} from '@/libs/firebase/config-client'
import Error from '@/components/form/Error'

const LoginEmail = () => {
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [isResetEmailSent, setIsResetEmailSent] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const searchParams = useSearchParams()
  const {push} = useRouter()
  const t = useTranslations()
  const {watch, reset, setFocus, setValue} = useFormContext<LoginForm>()
  const watches = watch()

  useEffect(() => {
    setFocus('password')
  }, [setFocus])

  const onLogin = async () => {
    if (!watches.password) {
      setValue('errors', {password: 'auth/invalid-credential'})
      return
    }

    setIsLoggingIn(true)
    const response = await signInWithEmail(watches.email, watches.password)

    if (!!response.error) {
      setValue('errors', {global: response.error.code as GoogleAuthCodesType})
      setIsLoggingIn(false)
      return
    }

    setIsLoggingIn(false)
    if (!!response.user) push(searchParams.get('redirect') || '/')
  }

  const onResetPassword = async () => {
    if (!watches.email) return

    setIsResettingPassword(true)
    try {
      await sendPasswordResetEmail(auth, watches.email)
      setIsResetEmailSent(true)
    } catch (error) {
      console.log('Error occurred.', error)
      setIsResettingPassword(false)
    }
  }

  return (
    <>
      <Title title="welcome-back" />
      <SectionContainer>
        {!!watches.email && <Input name="email" label={t('email')} disabled />}
        {!!watches.phone && <Input name="phone" label={t('phone')} disabled />}
        <Input name="password" label={t('password')} type="password" onEnter={onLogin} />
        {watches.errors.global === 'auth/invalid-credential' &&
          (isResetEmailSent ? (
            <p className="pb-[13px] pt-3 text-body">{t('email-sent')}</p>
          ) : (
            <Button
              text={t('LoginPage.forgot-password')}
              variant="link"
              onClick={onResetPassword}
              fluid={false}
              loading={isResettingPassword}
              iconPosition="end"
              className="flex min-h-6 items-center"
            />
          ))}
        <Error error={watch('errors')?.global} />
        <Button text={t('login')} variant="outlined" onClick={onLogin} loading={isLoggingIn} />
        <Button text={t('cancel')} variant="link" onClick={reset} />
      </SectionContainer>
    </>
  )
}

export default LoginEmail
