'use client'
import {useEffect, useRef, useState} from 'react'
import {useSearchParams} from 'next/navigation'
import {useTranslations} from 'next-intl'
import {useFormContext} from 'react-hook-form'
import QRCode from 'react-qr-code'
import Error from '@/components/form/Error'
import {signInWithSignicatToken} from '@/libs/firebase/auth'
import {useRouter} from '@/i18n/routing'
import {type LoginForm} from './Section'
import type {GoogleAuthCodesType} from '@/utils/types'

type StatusResponse = {
  success: boolean
  status?: string
  qrData?: string
  sbidStatus?: string
  customToken?: string
  redirect?: string
  error?: unknown
}

const POLL_INTERVAL_MS = 1500

const LoginOptions = () => {
  const [view, setView] = useState<'idle' | 'qr' | 'completing'>('idle')
  const [qrData, setQrData] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const t = useTranslations()
  const {setValue, watch} = useFormContext<LoginForm>()
  const {push} = useRouter()
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (pollTimer.current) clearTimeout(pollTimer.current)
    }
  }, [])

  const finishWithToken = async (customToken: string, redirect: string) => {
    const response = await signInWithSignicatToken(customToken)
    if (response.error || !response.user) {
      setValue('errors', {global: (response.error?.code ?? 'auth/signicat-login-failed') as GoogleAuthCodesType})
      setErrorCode('auth/signicat-login-failed')
      setView('idle')
      return
    }
    push(redirect || '/profile/create')
  }

  const pollStatus = async () => {
    if (!isMountedRef.current) return
    try {
      const response = await fetch('/api/auth/bankid/status', {cache: 'no-store'})
      const data = (await response.json()) as StatusResponse

      if (!data.success) {
        setErrorCode('auth/signicat-login-failed')
        setView('idle')
        return
      }

      if (data.status === 'SUCCESS' && data.customToken) {
        setView('completing')
        await finishWithToken(data.customToken, data.redirect || '/profile/create')
        return
      }

      if (data.status === 'ABORT' || data.status === 'ERROR') {
        setErrorCode('auth/signicat-login-failed')
        setView('idle')
        return
      }

      if (data.qrData) setQrData(data.qrData)

      if (isMountedRef.current) {
        pollTimer.current = setTimeout(pollStatus, POLL_INTERVAL_MS)
      }
    } catch {
      if (isMountedRef.current) {
        pollTimer.current = setTimeout(pollStatus, POLL_INTERVAL_MS)
      }
    }
  }

  const onStartBankId = async () => {
    setErrorCode(null)
    setValue('errors', {})
    setView('qr')
    setQrData(null)
    try {
      const redirect = searchParams.get('redirect') || '/profile/create'
      const response = await fetch('/api/auth/bankid/start', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({redirect})
      })
      const data = (await response.json()) as {success: boolean; qrData?: string}
      if (!data.success || !data.qrData) {
        setErrorCode('auth/signicat-login-failed')
        setView('idle')
        return
      }
      setQrData(data.qrData)
      pollTimer.current = setTimeout(pollStatus, POLL_INTERVAL_MS)
    } catch {
      setErrorCode('auth/signicat-login-failed')
      setView('idle')
    }
  }

  const onCancel = () => {
    if (pollTimer.current) clearTimeout(pollTimer.current)
    setView('idle')
    setQrData(null)
  }

  // Surface URL-driven errors (e.g. ?error=signicat-callback) once on mount
  useEffect(() => {
    const urlError = searchParams.get('error')
    if (urlError) setErrorCode(`auth/${urlError}`)
  }, [searchParams])

  if (view === 'qr' || view === 'completing') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4">
          <img src="/images/bankid-logo.svg" alt="BankID" className="h-12 w-auto" />
          <p className="text-center text-body text-neutral-600">{t('LoginPage.bankid-scan-instruction')}</p>

          <div className="flex h-[232px] w-[232px] items-center justify-center rounded-lg border border-neutral-200 bg-white p-4">
            {qrData ? (
              <QRCode value={qrData} size={200} level="L" />
            ) : (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-700" />
            )}
          </div>

          {view === 'completing' && (
            <p className="text-center text-body text-neutral-500">{t('LoginPage.bankid-completing')}</p>
          )}

          <button type="button" onClick={onCancel} className="text-body text-neutral-600 underline hover:text-neutral-900">
            {t('cancel')}
          </button>
        </div>
        <Error error={watch('errors')?.global || errorCode || undefined} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-h3 font-semibold text-neutral-900">{t('LoginPage.sign-in-to-account')}</h1>
        <p className="text-body text-neutral-500">{t('LoginPage.bankid-subtitle')}</p>
      </div>

      <button
        type="button"
        onClick={onStartBankId}
        className="flex w-full items-center gap-4 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-left transition-all hover:border-neutral-300 hover:bg-neutral-50">
        <img src="/images/bankid-logo.svg" alt="BankID" className="h-10 w-10" />
        <span className="text-base font-medium text-neutral-900">{t('LoginPage.login-with-swedish-bankid')}</span>
      </button>

      <Error error={watch('errors')?.global || errorCode || undefined} />
    </div>
  )
}

export default LoginOptions
