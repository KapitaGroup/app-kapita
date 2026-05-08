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

const buildAutoStartUrl = (token: string, returnUrl?: string) => {
  // BankID universal link — works on iOS Safari, Android Chrome, and desktop
  // browsers (which will offer to open BankID for Windows/macOS).
  // `redirect=null` keeps the user in the current browser tab; on iOS Safari
  // we send them back to the current URL so the polling page is re-opened.
  const redirect = returnUrl ?? 'null'
  return `https://app.bankid.com/?autostarttoken=${encodeURIComponent(token)}&redirect=${encodeURIComponent(redirect)}`
}

const detectMobile = () => {
  if (typeof navigator === 'undefined') return false
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

const LoginOptions = () => {
  const [view, setView] = useState<'idle' | 'qr' | 'completing'>('idle')
  const [qrData, setQrData] = useState<string | null>(null)
  const [autoStartToken, setAutoStartToken] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const searchParams = useSearchParams()
  const t = useTranslations()
  const {setValue, watch} = useFormContext<LoginForm>()
  const {push} = useRouter()
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    setIsMobile(detectMobile())
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
    push(redirect || '/onboarding/welcome')
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
        await finishWithToken(data.customToken, data.redirect || '/onboarding/welcome')
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
    setAutoStartToken(null)
    try {
      const redirect = searchParams.get('redirect') || '/onboarding/welcome'
      const response = await fetch('/api/auth/bankid/start', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({redirect})
      })
      const data = (await response.json()) as {success: boolean; qrData?: string; autoStartToken?: string}
      if (!data.success || !data.qrData) {
        setErrorCode('auth/signicat-login-failed')
        setView('idle')
        return
      }
      setQrData(data.qrData)
      if (data.autoStartToken) setAutoStartToken(data.autoStartToken)

      // On mobile, auto-launch the BankID app so the user doesn't have to tap
      // an extra button. The browser will navigate them straight into BankID;
      // when they finish, BankID returns to this tab and polling completes.
      if (detectMobile() && data.autoStartToken) {
        const returnUrl = typeof window !== 'undefined' ? window.location.href : undefined
        window.location.href = buildAutoStartUrl(data.autoStartToken, returnUrl)
      }

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
    setAutoStartToken(null)
  }

  // Surface URL-driven errors (e.g. ?error=signicat-callback) once on mount
  useEffect(() => {
    const urlError = searchParams.get('error')
    if (urlError) setErrorCode(`auth/${urlError}`)
  }, [searchParams])

  const sameDeviceUrl = autoStartToken
    ? buildAutoStartUrl(autoStartToken, typeof window !== 'undefined' ? window.location.href : undefined)
    : null

  if (view === 'qr' || view === 'completing') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/bankid-logo.svg" alt="BankID" className="h-12 w-auto" />

          {isMobile ? (
            <>
              <p className="text-center text-body text-neutral-600">{t('LoginPage.bankid-mobile-instruction')}</p>
              {sameDeviceUrl ? (
                <a
                  href={sameDeviceUrl}
                  className="flex w-full items-center justify-center rounded-md bg-neutral-900 px-6 py-3 text-base font-medium text-white transition-all hover:bg-neutral-800">
                  {t('LoginPage.bankid-open-app')}
                </a>
              ) : (
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-700" />
              )}
            </>
          ) : (
            <>
              <p className="text-center text-body text-neutral-600">{t('LoginPage.bankid-scan-instruction')}</p>
              <div className="flex h-[232px] w-[232px] items-center justify-center rounded-lg border border-neutral-200 bg-white p-4">
                {qrData ? (
                  <QRCode value={qrData} size={200} level="L" />
                ) : (
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-700" />
                )}
              </div>
              {sameDeviceUrl && (
                <a href={sameDeviceUrl} className="text-sm text-neutral-600 underline hover:text-neutral-900">
                  {t('LoginPage.bankid-open-this-device')}
                </a>
              )}
            </>
          )}

          {view === 'completing' && (
            <p className="text-center text-body text-neutral-500">{t('LoginPage.bankid-completing')}</p>
          )}

          <button type="button" onClick={onCancel} className="text-body text-neutral-600 underline hover:text-neutral-900">
            {t('cancel')}
          </button>
        </div>
        <Error error={watch('errors')?.global || errorCode || ''} />
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/bankid-logo.svg" alt="BankID" className="h-10 w-10" />
        <span className="text-base font-medium text-neutral-900">{t('LoginPage.login-with-swedish-bankid')}</span>
      </button>

      <Error error={watch('errors')?.global || errorCode || ''} />
    </div>
  )
}

export default LoginOptions
