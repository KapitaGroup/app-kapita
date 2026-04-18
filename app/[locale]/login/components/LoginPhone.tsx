'use client'
import {useRef, useState} from 'react'
import {useTranslations} from 'next-intl'
import {useSearchParams} from 'next/navigation'
import {useFormContext} from 'react-hook-form'
import {type ConfirmationResult} from 'firebase/auth'
import {sendPhoneOtp, verifyPhoneOtp} from '@/libs/firebase/auth'
import {checkProfileExists} from '@/data/checkProfileExists'
import {useProfileCreate} from '@/hooks/useProfileCreate'
import {useRouter} from '@/i18n/routing'
import SectionContainer from './SectionContainer'
import Title from './Title'
import Input from '@/components/form/Input'
import Button from '@/components/Button'
import Error from '@/components/form/Error'
import type {LoginForm} from './Section'
import type {GoogleAuthCodesType} from '@/utils/types'

const LoginPhone = () => {
  const {push} = useRouter()
  const t = useTranslations()
  const searchParams = useSearchParams()
  const {watch, reset, setValue, getValues} = useFormContext<LoginForm>()
  const createProfile = useProfileCreate()

  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [otp, setOtp] = useState('')
  const confirmationRef = useRef<ConfirmationResult | null>(null)

  const onSendCode = async () => {
    const phone = getValues('phone')
    if (!phone) {
      setValue('errors', {phone: 'required'})
      return
    }
    setValue('errors', {})
    setIsSending(true)

    const {confirmationResult, error} = await sendPhoneOtp(phone)

    if (error || !confirmationResult) {
      setValue('errors', {global: (error?.code ?? 'auth/unknown') as GoogleAuthCodesType})
      setIsSending(false)
      return
    }

    confirmationRef.current = confirmationResult
    setStep('otp')
    setIsSending(false)
  }

  const onVerifyOtp = async () => {
    if (!otp || !confirmationRef.current) {
      setValue('errors', {otp: 'required'})
      return
    }
    setValue('errors', {})
    setIsVerifying(true)

    const {user, error} = await verifyPhoneOtp(confirmationRef.current, otp)

    if (error || !user) {
      setValue('errors', {global: (error?.code ?? 'auth/invalid-verification-code') as GoogleAuthCodesType})
      setIsVerifying(false)
      return
    }

    const profileAlreadyExists = await checkProfileExists({loginId: user.uid})
    if (profileAlreadyExists) {
      push(searchParams.get('redirect') || '/')
      return
    }

    await createProfile.mutateAsync({
      loginId: user.uid,
      name: user.displayName ?? '',
      email: user.email ?? '',
      phone: getValues('phone') ?? '',
      emailVerified: user.emailVerified
    })

    push(searchParams.get('redirect') || '/profile/create')
  }

  return (
    <>
      {/* Invisible reCAPTCHA container required by Firebase phone auth */}
      <div id="recaptcha-container" />

      <Title title="log-in-create-account" />
      <SectionContainer>
        {step === 'phone' && (
          <>
            <Input
              name="phone"
              label={t('phone')}
              placeholder="+1 234 567 8900"
              onEnter={onSendCode}
            />
            <Button
              text={t('LoginPage.send-code')}
              variant="outlined"
              onClick={onSendCode}
              loading={isSending}
            />
          </>
        )}

        {step === 'otp' && (
          <>
            <p className="text-body text-neutral-500">
              {t('LoginPage.code-sent-to')} <span className="font-medium text-neutral-900">{watch('phone')}</span>
            </p>
            <Input
              name="otp"
              label={t('LoginPage.type-verification')}
              type="tel"
              onEnter={onVerifyOtp}
              onChange={e => setOtp((e.target as HTMLInputElement).value)}
            />
            <Button
              text={t('LoginPage.verify-phone')}
              variant="outlined"
              onClick={onVerifyOtp}
              loading={isVerifying}
            />
            <Button
              text={t('LoginPage.resend-code')}
              variant="link"
              onClick={() => {
                confirmationRef.current = null
                setOtp('')
                setStep('phone')
              }}
            />
          </>
        )}

        <Error error={watch('errors')?.global} />
        <Button text={t('cancel')} variant="link" onClick={reset} />
      </SectionContainer>
    </>
  )
}

export default LoginPhone
