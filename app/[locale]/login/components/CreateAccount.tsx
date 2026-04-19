import SectionContainer from './SectionContainer'
import Title from './Title'
import {useLocale, useTranslations} from 'next-intl'
import {useFormContext} from 'react-hook-form'
import {LoginForm} from './Section'
import Input from '@/components/form/Input'
import Button from '@/components/Button'
import VerifiedIcon from '@/icons/VerifiedIcon'
import {useEffect, useRef, useState} from 'react'
import {createAccountWithEmail, signOut} from '@/libs/firebase/auth'
import type {GoogleAuthCodesType} from '@/utils/types'
import {useProfileCreate} from '@/hooks/useProfileCreate'
import toast, {Toaster} from 'react-hot-toast'
import Error from '@/components/form/Error'

const CreateAccount = () => {
  const t = useTranslations()
  const {watch, getValues, reset, setFocus, setValue} = useFormContext<LoginForm>()
  const [verificationId, setVerificationId] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const createProfile = useProfileCreate()
  const locale = useLocale()
  const hasSentRef = useRef(false)

  useEffect(() => {
    if (hasSentRef.current) return
    hasSentRef.current = true

    const sendVerification = async () => {
      const response = await toast.promise(
        fetch(`/api/verifications?locale=${locale}`, {
          method: 'POST',
          body: JSON.stringify({email: getValues('email')})
        }),
        {
          loading: t('Emails.notifications.sending'),
          success: <b>{t('Emails.notifications.sent')}</b>,
          error: <b>{t('Emails.notifications.error')}</b>
        }
      )

      const {id} = (await response.json()) as {id: string}

      if (!id) return

      setVerificationId(id)
      setTimeout(() => setFocus('emailVerificationCode'), 100)
    }

    sendVerification()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onCreateAccount = async () => {
    const watches = watch()
    if (!watches.email || !watches.password) {
      setValue('errors', {password: 'required'})
      return
    }
    setValue('errors', {})

    setIsCreatingAccount(true)
    const result = await createAccountWithEmail(watches.email, watches.password)

    if (!!result.error) {
      setValue('errors', {global: result.error.code as GoogleAuthCodesType})
      setIsCreatingAccount(false)
      return
    }

    if (!result.user) {
      setIsCreatingAccount(false)
      return
    }

    const hubspotContactInfoResult = await fetch(`/api/contact/${watches.email}`)
    const hubspotContactInfo = await hubspotContactInfoResult.json()
    if (!!hubspotContactInfo?.email) localStorage.setItem('user-data-exists', 'true')
    else {
      const contactCreateResult = await fetch(`/api/contact`, {
        method: 'POST',
        body: JSON.stringify({
          email: watches.email,
          name: result.user.displayName ?? '',
          phone: watches.phone
        })
      })

      if (!contactCreateResult.ok) {
        console.error(await contactCreateResult.json())
        signOut()
        reset()
        setIsCreatingAccount(false)
        return
      }
    }

    const profile = {
      loginId: result.user.uid,
      name: result.user.displayName ?? '',
      email: watches.email,
      emailVerified: watches.emailVerified
    }

    await createProfile.mutateAsync(profile)

    setValue('isPhoneVerification', true)
  }

  const onVerification = async () => {
    const watches = watch()
    if (!watches.emailVerificationCode) {
      setValue('errors', {emailVerificationCode: 'required'})
      return
    }
    setValue('errors', {})
    setIsVerifying(true)

    const response = await fetch(`/api/verifications`, {
      method: 'PUT',
      body: JSON.stringify({id: verificationId, code: watches.emailVerificationCode})
    })

    const {verified} = (await response.json()) as {verified: boolean}

    setValue('emailVerified', verified)
    if (!verified) {
      setValue('errors', {emailVerificationCode: 'wrong-code'})
      setIsVerifying(false)
      return
    }

    setTimeout(() => setFocus('password'), 100)
    setIsVerifying(false)
  }

  return (
    <>
      <Toaster />
      <Title title="create-account" />
      <SectionContainer>
        <Input
          name="email"
          label={t('email')}
          icon={watch('emailVerified') ? <VerifiedIcon className="text-primary-800" /> : undefined}
          disabled={true}
        />
        {!watch('emailVerified') && verificationId && (
          <>
            <Input name="emailVerificationCode" label={t('LoginPage.type-verification')} type="tel" onEnter={onVerification} />
            <Button text={t('LoginPage.verify-email')} variant="outlined" onClick={onVerification} loading={isVerifying} />
          </>
        )}
        {watch('emailVerified') && (
          <>
            <Input name="password" label={t('LoginPage.choose-password')} type="password" onEnter={onCreateAccount} />
            <Button
              text={t('LoginPage.create-account')}
              variant="outlined"
              onClick={onCreateAccount}
              loading={isCreatingAccount}
              disabled={isCreatingAccount}
            />
          </>
        )}
        <Error error={watch('errors')?.global} />
        <div className="flex h-10 items-center justify-center">
          <Button text={t('cancel')} variant="link" onClick={reset} />
        </div>
      </SectionContainer>
    </>
  )
}

export default CreateAccount
