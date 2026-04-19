'use client'
import {useRef, useState} from 'react'
import {useTranslations} from 'next-intl'
import {useSearchParams} from 'next/navigation'
import {useFormContext} from 'react-hook-form'
import {sendPhoneLink, verifyAndLinkPhone} from '@/libs/firebase/auth'
import {useRouter} from '@/i18n/routing'
import SectionContainer from './SectionContainer'
import Title from './Title'
import Input from '@/components/form/Input'
import Button from '@/components/Button'
import Error from '@/components/form/Error'
import type {LoginForm} from './Section'
import type {GoogleAuthCodesType} from '@/utils/types'

const PhoneVerify = () => {
  const {push} = useRouter()
  const t = useTranslations()
  const searchParams = useSearchParams()
  const {watch, setValue, getValues} = useFormContext<LoginForm>()

  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [otp, setOtp] = useState('')
  const verificationIdRef = useRef<string | null>(null)

  const onSendCode = async () => {
    const phone = getValues('phone')
    if (!phone) {
      setValue('errors', {phone: 'required'})
      return
    }
    setValue('errors', {})
    setIsSending(true)

    const {verificationId, error} = await sendPhoneLink(phone)

    if (error || !verificationId) {
      setValue('errors', {global: (error?.code ?? 'auth/unknown') as GoogleAuthCodesType})
      setIsSending(false)
      return
    }

    verificationIdRef.current = verificationId
    setStep('otp')
    setIsSending(false)
  }

  const onVerifyOtp = async () => {
    if (!otp || !verificationIdRef.current) {
      setValue('errors', {otp: 'required'})
      return
    }
    setValue('errors', {})
    setIsVerifying(true)

    const {success, error} = await verifyAndLinkPhone(verificationIdRef.current, otp)

    if (!success || error) {
      setValue('errors', {global: (error?.code ?? 'auth/invalid-verification-code') as GoogleAuthCodesType})
      setIsVerifying(false)
      return
    }

    const isNewUser = watch('isCreatingAccount')
    push(isNewUser ? '/profile/create' : (searchParams.get('redirect') || '/'))
  }

  return (
    <>
      {/* Invisible reCAPTCHA container required by Firebase phone auth */}
      <div id="recaptcha-container" />

      <Title title="verify-account" />
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
                verificationIdRef.current = null
                setOtp('')
                setStep('phone')
              }}
            />
          </>
        )}

        <Error error={watch('errors')?.global} />
      </SectionContainer>
    </>
  )
}

export default PhoneVerify
