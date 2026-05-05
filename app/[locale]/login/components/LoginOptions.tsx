'use client'
import {useEffect, useState} from 'react'
import {useSearchParams} from 'next/navigation'
import {useTranslations} from 'next-intl'
import {useFormContext} from 'react-hook-form'
import Error from '@/components/form/Error'
import {signInWithSignicatToken} from '@/libs/firebase/auth'
import {useRouter} from '@/i18n/routing'
import {type LoginForm} from './Section'
import type {GoogleAuthCodesType} from '@/utils/types'

type Method = 'sbid' | 'freja-eid'

const FrejaIcon = () => (
  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1B1A66] text-[10px] font-bold tracking-tight text-white">
    FREJA
  </div>
)

const BankIDIcon = () => (
  <div className="flex h-10 w-10 shrink-0 items-center justify-center">
    <svg viewBox="0 0 40 40" width="40" height="40" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="2" y="6" width="36" height="28" rx="4" fill="#235971" />
      <text x="20" y="22" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontWeight="700" fontSize="9" fill="#fff" letterSpacing="0.5">
        Bank
      </text>
      <text x="20" y="31" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontWeight="700" fontStyle="italic" fontSize="9" fill="#fff">
        ID
      </text>
    </svg>
  </div>
)

const LoginOptions = () => {
  const [loadingMethod, setLoadingMethod] = useState<Method | null>(null)
  const searchParams = useSearchParams()
  const t = useTranslations()
  const {setValue, watch} = useFormContext<LoginForm>()
  const {push} = useRouter()

  useEffect(() => {
    const completeSignicatLogin = async () => {
      if (searchParams.get('signicat') !== 'complete') return

      setLoadingMethod('sbid')
      const tokenResponse = await fetch('/api/auth/signicat/firebase-token')
      const tokenPayload = (await tokenResponse.json()) as {success: boolean; customToken?: string; redirect?: string; error?: string}

      if (!tokenPayload.success || !tokenPayload.customToken) {
        setValue('errors', {global: 'auth/signicat-login-failed'})
        setLoadingMethod(null)
        return
      }

      const response = await signInWithSignicatToken(tokenPayload.customToken)

      if (response.error || !response.user) {
        setValue('errors', {global: (response.error?.code ?? 'auth/signicat-login-failed') as GoogleAuthCodesType})
        setLoadingMethod(null)
        return
      }

      const redirectPath = tokenPayload.redirect || '/profile/create'
      push(redirectPath)
    }

    completeSignicatLogin()
  }, [searchParams, setValue, push])

  const onMethodClick = (method: Method) => {
    setLoadingMethod(method)
    const redirect = searchParams.get('redirect') || '/profile/create'
    window.location.href = `/api/auth/signicat/start?method=${method}&redirect=${encodeURIComponent(redirect)}`
  }

  const isBusy = loadingMethod !== null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-h3 font-semibold text-neutral-900">{t('LoginPage.sign-in-to-account')}</h1>
        <p className="text-body text-neutral-500">{t('LoginPage.choose-sign-in-method')}</p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => onMethodClick('freja-eid')}
          disabled={isBusy}
          className="flex w-full items-center gap-4 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-left transition-all hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60">
          {loadingMethod === 'freja-eid' ? (
            <div className="h-10 w-10 shrink-0 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-700" />
          ) : (
            <FrejaIcon />
          )}
          <span className="text-base font-medium text-neutral-900">{t('LoginPage.login-with-freja')}</span>
        </button>

        <button
          type="button"
          onClick={() => onMethodClick('sbid')}
          disabled={isBusy}
          className="flex w-full items-center gap-4 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-left transition-all hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60">
          {loadingMethod === 'sbid' ? (
            <div className="h-10 w-10 shrink-0 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-700" />
          ) : (
            <BankIDIcon />
          )}
          <span className="text-base font-medium text-neutral-900">{t('LoginPage.login-with-swedish-bankid')}</span>
        </button>

        <Error error={watch('errors')?.global} />
      </div>
    </div>
  )
}

export default LoginOptions
