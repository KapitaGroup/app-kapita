'use client'
import {useTranslations} from 'next-intl'
import Logo from '@/components/Logo'
import {FormProvider, useForm} from 'react-hook-form'
import type {ProfileType} from '@/utils/types'
import Input from '@/components/form/Input'
import Button from '@/components/Button'
import {useRouter} from '@/i18n/routing'
import Title from '../components/Title'
import {useSearchParams} from 'next/navigation'
import {confirmPasswordReset, verifyPasswordResetCode} from 'firebase/auth'
import {auth} from '@/libs/firebase/config-client'
import {type FirebaseError} from 'firebase/app'
import {signInWithEmail} from '@/libs/firebase/auth'

export type PasswordResetForm = {
  newPassword: string | null
  errors: {[key: string]: string}
} & Pick<ProfileType, 'email'>
const Page = () => {
  const t = useTranslations()
  const {push} = useRouter()
  const searchParams = useSearchParams()
  const oobCode = searchParams.get('oobCode')
  const methods = useForm<PasswordResetForm>()
  const watches = methods.watch()

  const handlePasswordReset = async () => {
    if (!oobCode) return
    if (!watches.newPassword) {
      methods.setValue('errors', {newPassword: 'required'})
      return
    }

    try {
      const email = await verifyPasswordResetCode(auth, oobCode)

      try {
        await confirmPasswordReset(auth, oobCode, watches.newPassword)

        await signInWithEmail(email, watches.newPassword)
        push('/')
      } catch (error) {
        const errors = error as FirebaseError
        methods.setValue('errors', {newPassword: errors?.code || 'auth/weak-password'})
        console.log('Password reset error occurred!', errors)
      }
    } catch (error) {
      console.log('Verification error occurred!', error)
    }
    console.log(' resetting password')
  }

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-8" onSubmit={e => e.preventDefault()}>
        <Logo size="md" url="https://www.kapita.com/" />
        <div className="flex flex-col gap-y-1">
          <Title title="password-reset" />
          <p>{t('LoginPage.password-reset.description')}</p>
        </div>
        <div className="flex flex-col gap-y-2 xl:gap-y-2.5">
          <Input name="newPassword" label={t('LoginPage.password-reset.input-label')} type="password" onEnter={handlePasswordReset} />
          <Button
            text={t('LoginPage.password-reset.set-password')}
            variant="outlined"
            onClick={handlePasswordReset}
            // loading={isLoggingIn}
          />
          <Button text={t('cancel')} variant="link" onClick={() => push('/login')} />
        </div>
      </form>
    </FormProvider>
  )
}
export default Page
