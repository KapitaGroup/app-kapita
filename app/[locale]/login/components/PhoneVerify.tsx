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
import PhoneInput from '@/components/form/PhoneInput'
import type {LoginForm} from './Section'
import type {GoogleAuthCodesType} from '@/utils/types'

const PhoneVerify = () => {
  const {push} = useRouter()
  const t = useTranslations()
  const searchParams = useSearchParams()
  const {watch, setValue} = useFormContext<LoginForm>()

  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [otp, setOtp] = useState('')
  const [dial, setDial] = useState('+46') // default Sweden
  const [number, setNumber] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [globalError, setGlobalError] = useState('')
  const verificationIdRef = useRef<string | null>(null)

  const fullPhone = `${dial}${number.replace(/[\s-]/g, '')}`

  const onSendCode = async () => {
    setPhoneError('')
    setGlobalError('')

    const cleanedNumber = number.replace(/[\s-]/g, '')
    if (!cleanedNumber || cleanedNumber.length < 6) {
      setPhoneError('incorrect-phone-format')
      return
    }

    setIsSending(true)
    setValue('phone', fullPhone)

    const {verificationId, error} = await sendPhoneLink(fullPhone)

    if (error || !verificationId) {
      const code = (error?.code ?? 'auth/unknown') as GoogleAuthCodesType
      setGlobalError(code)
      setIsSending(false)
      return
    }

    verificationIdRef.current = verificationId
    setStep('otp')
    setIsSending(false)
  }

  const onVerifyOtp = async () => {
    setGlobalError('')
    if (!otp || otp.length < 4 || !verificationIdRef.current) {
      setGlobalError('wrong-code')
      return
    }
    setIsVerifying(true)

    const {success, error} = await verifyAndLinkPhone(verificationIdRef.current, otp)

    if (!success || error) {
      setGlobalError((error?.code ?? 'auth/invalid-verification-code') as string)
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
            <PhoneInput
              label={t('phone')}
              dial={dial}
              onDialChange={setDial}
              number={number}
              onNumberChange={setNumber}
              onEnter={onSendCode}
              error={phoneError ? t(`Errors.${phoneError}`) : ''}
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
              {t('LoginPage.code-sent-to')} <span className="font-medium text-neutral-900">{fullPhone}</span>
            </p>
            <Input
              name="otp"
              label={t('LoginPage.type-verification')}
              type="tel"
              onEnter={onVerifyOtp}
              onChange={e => setOtp((e.target as HTMLInputElement).value.replace(/[^0-9]/g, ''))}
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
                setGlobalError('')
                setStep('phone')
              }}
            />
          </>
        )}

        <Error error={globalError} />
      </SectionContainer>
    </>
  )
}

export default PhoneVerify
