'use client'
import {useTranslations} from 'next-intl'
import Button from '@/components/Button'
import ArrowIcon from '@/icons/ArrowIcon'
import GoogleIcon from '@/icons/GoogleIcon'
import Input from '@/components/form/Input'
import {signInWithMicrosoft, signInWithGoogle, signOut, signInWithApple, signInWithFacebook} from '@/libs/firebase/auth'
import {useSearchParams} from 'next/navigation'
import {useEffect, useState} from 'react'
import {useFormContext} from 'react-hook-form'
import {type LoginForm} from './Section'
import Title from './Title'
import SectionContainer from './SectionContainer'
import {useRouter} from '@/i18n/routing'
import {isEmailValid} from '@/utils/stringValidations'
import {checkProfileExists} from '@/data/checkProfileExists'
import {useProfileCreate} from '@/hooks/useProfileCreate'
import type {AirtableImageType} from '@/utils/types'
import AppleIcon from '@/icons/AppleIcon'
import FacebookIcon from '@/icons/FacebookIcon'
import MicrosoftIcon from '@/icons/MicrosoftIcon'
import {type User} from 'firebase/auth'
import Error from '@/components/form/Error'

const LoginOptions = () => {
  const [isAppleLoginLoading, setIsAppleLoginLoading] = useState(false)
  const [isFacebookLoginLoading, setIsFacebookLoginLoading] = useState(false)
  const [isGoogleLoginLoading, setIsGoogleLoginLoading] = useState(false)
  const [isMicrosoftLoginLoading, setIsMicrosoftLoginLoading] = useState(false)
  const [isNextLoginLoading, setIsNextLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const searchParams = useSearchParams()
  const {push} = useRouter()
  const t = useTranslations()
  const {setFocus, setValue, getValues, reset} = useFormContext<LoginForm>()
  const createProfile = useProfileCreate()

  useEffect(() => {
    setFocus('email')
  }, [setFocus])

  useEffect(() => {
    const emailParam = searchParams.get('email')

    if (!!emailParam) {
      setValue('email', emailParam)
    }
  }, [searchParams, setValue])

  const loginProcess = async (firebaseUser: User) => {
    const user = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      name: firebaseUser.displayName ?? '',
      photoURL: firebaseUser.photoURL ?? '',
      emailVerified: firebaseUser.emailVerified
    }

    const profileAlreadyExists = await checkProfileExists({loginId: user.uid})
    if (profileAlreadyExists) {
      push(searchParams.get('redirect') || '/')
      setIsGoogleLoginLoading(false)
      return
    }

    const hubspotContactInfoResult = await fetch(`/api/contact/${user.email!}`)
    const hubspotContactInfo = await hubspotContactInfoResult.json()
    if (!!hubspotContactInfo?.email) localStorage.setItem('user-data-exists', 'true')
    else {
      const contactCreateResult = await fetch(`/api/contact`, {
        method: 'POST',
        body: JSON.stringify({
          email: user.email!,
          name: user.name ?? ''
        })
      })

      if (!contactCreateResult.ok) {
        console.error(await contactCreateResult.json())
        signOut()
        reset()
        setIsGoogleLoginLoading(false)
        return
      }
    }

    const profile = {
      loginId: user.uid,
      image: !!user.photoURL ? [{url: user.photoURL} as AirtableImageType] : [],
      name: user.name ?? '',
      email: user.email!,
      emailVerified: user.emailVerified
    }

    await createProfile.mutateAsync(profile)

    push(searchParams.get('redirect') || '/profile')
  }

  const onAppleLogin = async () => {
    setIsAppleLoginLoading(true)

    const result = await signInWithApple()

    if (result.error || !result.user) {
      console.error('Error happened while logging in!', result.error)

      if (result.error.code === 'auth/account-exists-with-different-credential')
        setLoginError('auth/account-exists-with-different-credential')

      setIsAppleLoginLoading(false)
      return
    }
    setValue('errors', {})
    setLoginError('')

    loginProcess(result.user)
  }

  const onFacebookLogin = async () => {
    setIsFacebookLoginLoading(true)
    const result = await signInWithFacebook()

    if (result.error || !result.user) {
      console.error('Error happened while logging in!', result.error)

      if (result.error.code === 'auth/account-exists-with-different-credential')
        setLoginError('auth/account-exists-with-different-credential')

      setIsFacebookLoginLoading(false)
      return
    }
    setValue('errors', {})
    setLoginError('')

    loginProcess(result.user)
  }

  const onGoogleLogin = async () => {
    setIsGoogleLoginLoading(true)
    const result = await signInWithGoogle()

    if (result.error || !result.user) {
      console.error('Error happened while logging in!', result.error)

      if (result.error.code === 'auth/account-exists-with-different-credential')
        setLoginError('auth/account-exists-with-different-credential')

      setIsGoogleLoginLoading(false)
      return
    }
    setValue('errors', {})
    setLoginError('')

    loginProcess(result.user)
  }

  const onMicrosoftLogin = async () => {
    setIsMicrosoftLoginLoading(true)

    const result = await signInWithMicrosoft()

    if (result.error || !result.user) {
      console.error('Error happened while logging in!', result.error)

      if (result.error.code === 'auth/account-exists-with-different-credential')
        setLoginError('auth/account-exists-with-different-credential')

      setIsMicrosoftLoginLoading(false)
      return
    }
    setValue('errors', {})
    setLoginError('')

    loginProcess(result.user)
  }

  const onNextClick = async () => {
    setIsNextLoginLoading(true)
    const email = getValues('email')

    if (!email) {
      setValue('errors', {email: 'required'})
      setIsNextLoginLoading(false)
      return
    }

    const isValid = isEmailValid(email)

    if (!isValid) {
      setValue('errors', {email: 'incorrect-email-format'})
      setIsNextLoginLoading(false)
      return
    }

    setValue('errors', {})

    const profileExists = await checkProfileExists({email})

    setValue('isCreatingAccount', !profileExists)
    setValue('isEmailSet', true)
    setIsNextLoginLoading(false)
  }

  return (
    <>
      <Title title="log-in-create-account" />
      <SectionContainer>
        <div>
          <Input name="email" label={t('email')} onEnter={onNextClick} />
        </div>
        <Button
          text={t('next')}
          variant="outlined"
          icon={<ArrowIcon />}
          iconPosition="end"
          onClick={onNextClick}
          loading={isNextLoginLoading}
        />
        <div className="flex items-center gap-x-2">
          <span className="w-full border-t-[1px] border-neutral-300" />
          {t('or')}
          <span className="w-full border-t-[1px] border-neutral-300" />
        </div>
        <div className="flex gap-x-[10px]">
          <Button text="" variant="outlined" icon={<AppleIcon />} onClick={onAppleLogin} loading={isAppleLoginLoading} />
          <Button text="" variant="outlined" icon={<FacebookIcon />} onClick={onFacebookLogin} loading={isFacebookLoginLoading} />
          <Button text="" variant="outlined" icon={<GoogleIcon />} onClick={onGoogleLogin} loading={isGoogleLoginLoading} />
          <Button text="" variant="outlined" icon={<MicrosoftIcon />} onClick={onMicrosoftLogin} loading={isMicrosoftLoginLoading} />
        </div>
        <Error error={loginError} />
      </SectionContainer>
    </>
  )
}

export default LoginOptions
