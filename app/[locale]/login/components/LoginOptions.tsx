'use client'
import {useEffect, useState} from 'react'
import {useSearchParams} from 'next/navigation'
import {useTranslations} from 'next-intl'
import {useFormContext} from 'react-hook-form'
import Button from '@/components/Button'
import Error from '@/components/form/Error'
import SectionContainer from './SectionContainer'
import Title from './Title'
import {signInWithSignicatToken} from '@/libs/firebase/auth'
import {type LoginForm} from './Section'
import type {GoogleAuthCodesType} from '@/utils/types'

const LoginOptions = () => {
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const searchParams = useSearchParams()
  const t = useTranslations()
  const {setValue, watch} = useFormContext<LoginForm>()

  useEffect(() => {
    const completeSignicatLogin = async () => {
      if (searchParams.get('signicat') !== 'complete') return

      setIsLoginLoading(true)
      const tokenResponse = await fetch('/api/auth/signicat/firebase-token')
      const tokenPayload = (await tokenResponse.json()) as {success: boolean; customToken?: string; redirect?: string; error?: string}

      if (!tokenPayload.success || !tokenPayload.customToken) {
        setValue('errors', {global: 'auth/signicat-login-failed'})
        setIsLoginLoading(false)
        return
      }

      const response = await signInWithSignicatToken(tokenPayload.customToken)

      if (response.error || !response.user) {
        setValue('errors', {global: (response.error?.code ?? 'auth/signicat-login-failed') as GoogleAuthCodesType})
        setIsLoginLoading(false)
        return
      }

      setValue('email', response.user.email ?? '')
      setValue('phone', response.user.phoneNumber ?? '')
      setValue('emailVerified', response.user.emailVerified)
      setValue('redirect', tokenPayload.redirect ?? '/')
      setValue('isCreatingAccount', false)
      setValue('isPhoneVerification', true)
      setIsLoginLoading(false)
    }

    completeSignicatLogin()
  }, [searchParams, setValue])

  const onLoginClick = () => {
    setIsLoginLoading(true)
    const redirect = searchParams.get('redirect') || '/'
    window.location.href = `/api/auth/signicat/start?redirect=${encodeURIComponent(redirect)}`
  }

  return (
    <>
      <Title title="log-in-create-account" />
      <SectionContainer>
        <Button
          text={t('LoginPage.continue-with-signicat')}
          variant="outlined"
          onClick={onLoginClick}
          loading={isLoginLoading}
        />
        <Error error={watch('errors')?.global} />
      </SectionContainer>
    </>
  )
}

export default LoginOptions
