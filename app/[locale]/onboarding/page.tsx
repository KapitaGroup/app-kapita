'use client'
import {useEffect, useRef, useState} from 'react'
import {useTranslations} from 'next-intl'
import QRCode from 'react-qr-code'
import StepHeader from './components/StepHeader'
import {signInWithSignicatToken} from '@/libs/firebase/auth'
import {useRouter} from '@/i18n/routing'

type StatusResponse = {
  success: boolean
  status?: string
  qrData?: string
  customToken?: string
  redirect?: string
  error?: unknown
}

const POLL_INTERVAL_MS = 1500
const NEXT_STEP = '/onboarding/basic'

const detectMobile = () => {
  if (typeof navigator === 'undefined') return false
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

const Page = () => {
  const t = useTranslations('Onboarding.bankid')
  const router = useRouter()
  const [view, setView] = useState<'idle' | 'qr' | 'completing'>('idle')
  const [qrData, setQrData] = useState<string | null>(null)
  const [autoStartToken, setAutoStartToken] = useState<string | null>(null)
  const [errorVisible, setErrorVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
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

  const finish = async (customToken: string) => {
    const response = await signInWithSignicatToken(customToken)
    if (response.error || !response.user) {
      setErrorVisible(true)
      setView('idle')
      return
    }
    router.push(NEXT_STEP)
  }

  const poll = async () => {
    if (!isMountedRef.current) return
    try {
      const response = await fetch('/api/auth/bankid/status', {cache: 'no-store'})
      const data = (await response.json()) as StatusResponse
      if (!data.success) {
        setErrorVisible(true)
        setView('idle')
        return
      }
      if (data.status === 'SUCCESS' && data.customToken) {
        setView('completing')
        await finish(data.customToken)
        return
      }
      if (data.status === 'ABORT' || data.status === 'ERROR') {
        setErrorVisible(true)
        setView('idle')
        return
      }
      if (data.qrData) setQrData(data.qrData)
      if (isMountedRef.current) pollTimer.current = setTimeout(poll, POLL_INTERVAL_MS)
    } catch {
      if (isMountedRef.current) pollTimer.current = setTimeout(poll, POLL_INTERVAL_MS)
    }
  }

  const onStart = async () => {
    setErrorVisible(false)
    setView('qr')
    setQrData(null)
    setAutoStartToken(null)
    try {
      const response = await fetch('/api/auth/bankid/start', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({redirect: NEXT_STEP})
      })
      const data = (await response.json()) as {success: boolean; qrData?: string; autoStartToken?: string}
      if (!data.success || !data.qrData) {
        setErrorVisible(true)
        setView('idle')
        return
      }
      setQrData(data.qrData)
      if (data.autoStartToken) setAutoStartToken(data.autoStartToken)
      pollTimer.current = setTimeout(poll, POLL_INTERVAL_MS)
    } catch {
      setErrorVisible(true)
      setView('idle')
    }
  }

  const onCancel = () => {
    if (pollTimer.current) clearTimeout(pollTimer.current)
    setView('idle')
    setQrData(null)
    setAutoStartToken(null)
  }

  const sameDeviceUrl = autoStartToken
    ? `https://app.bankid.com/?autostarttoken=${encodeURIComponent(autoStartToken)}&redirect=null`
    : null

  return (
    <div className="flex flex-col gap-10">
      <StepHeader current={1} title={t('title')} subtitle={t('subtitle')} />

      {view === 'idle' ? (
        <button
          type="button"
          onClick={onStart}
          className="flex w-full max-w-md items-center justify-center gap-3 rounded-md bg-neutral-900 px-6 py-3.5 text-white transition-colors hover:bg-neutral-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/bankid-logo.svg" alt="BankID" className="h-6 w-6 invert" />
          <span className="text-button">{t('cta')}</span>
        </button>
      ) : (
        <div className="flex flex-col items-start gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/bankid-logo.svg" alt="BankID" className="h-10 w-auto" />
          {isMobile ? (
            <>
              <p className="text-body text-neutral-600">{t('mobile-instruction')}</p>
              {sameDeviceUrl ? (
                <a
                  href={sameDeviceUrl}
                  className="flex w-full max-w-md items-center justify-center rounded-md bg-neutral-900 px-6 py-3.5 text-button text-white transition-colors hover:bg-neutral-800">
                  {t('open-app')}
                </a>
              ) : (
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-700" />
              )}
            </>
          ) : (
            <>
              <p className="text-body text-neutral-600">{t('scan-instruction')}</p>
              <div className="flex h-[232px] w-[232px] items-center justify-center rounded-lg border border-neutral-200 bg-white p-4">
                {qrData ? (
                  <QRCode value={qrData} size={200} level="L" />
                ) : (
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-700" />
                )}
              </div>
              {sameDeviceUrl && (
                <a href={sameDeviceUrl} className="text-description text-neutral-600 underline hover:text-neutral-900">
                  {t('open-this-device')}
                </a>
              )}
            </>
          )}

          {view === 'completing' && <p className="text-body text-neutral-500">{t('completing')}</p>}

          <button type="button" onClick={onCancel} className="text-description text-neutral-600 underline hover:text-neutral-900">
            {t('cancel')}
          </button>
        </div>
      )}

      {errorVisible && <p className="text-description text-warning">{t('error')}</p>}
    </div>
  )
}

export default Page
