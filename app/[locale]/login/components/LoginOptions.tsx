'use client'
import {useEffect, useState} from 'react'
import {useSearchParams} from 'next/navigation'
import {useTranslations} from 'next-intl'
import {useFormContext} from 'react-hook-form'
import Image from 'next/image'
import Error from '@/components/form/Error'
import {signInWithSignicatToken} from '@/libs/firebase/auth'
import {useRouter} from '@/i18n/routing'
import {type LoginForm} from './Section'
import type {GoogleAuthCodesType} from '@/utils/types'

const LoginOptions = () => {
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const searchParams = useSearchParams()
  const t = useTranslations()
  const {setValue, watch} = useFormContext<LoginForm>()
  const {push} = useRouter()

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

      // Redirect directly to profile creation or the intended destination
      const redirectPath = tokenPayload.redirect || '/profile/create'
      push(redirectPath)
    }

    completeSignicatLogin()
  }, [searchParams, setValue, push])

  const onLoginClick = () => {
    setIsLoginLoading(true)
    const redirect = searchParams.get('redirect') || '/profile/create'
    window.location.href = `/api/auth/signicat/start?redirect=${encodeURIComponent(redirect)}`
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-h3 font-semibold text-neutral-900">{t('LoginPage.sign-in-to-account')}</h1>
      <p className="text-body text-neutral-600">{t('LoginPage.choose-sign-in-method')}</p>
      
      <div className="flex flex-col gap-4">
        {/* BankID Button */}
        <button
          onClick={onLoginClick}
          disabled={isLoginLoading}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#1E3A5F] px-6 py-4 text-white transition-all hover:bg-[#2A4A75] active:bg-[#152A45] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoginLoading ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.5 7C11.5 7 8.5 7 8.5 10V22C8.5 25 11.5 25 11.5 25H20.5C20.5 25 23.5 25 23.5 22V10C23.5 7 20.5 7 20.5 7H11.5Z"
                  fill="white"
                />
                <path d="M13 11H19" stroke="#1E3A5F" strokeWidth="2" strokeLinecap="round" />
                <path d="M13 16H19" stroke="#1E3A5F" strokeWidth="2" strokeLinecap="round" />
                <path d="M13 21H19" stroke="#1E3A5F" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-lg font-semibold">{t('LoginPage.login-with-bankid')}</span>
            </>
          )}
        </button>
        
        <Error error={watch('errors')?.global} />
      </div>
    </div>
  )
}

export default LoginOptions
