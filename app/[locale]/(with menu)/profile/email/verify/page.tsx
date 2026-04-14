'use client'
import Button from '@/components/Button'
import PageLoading from '@/components/PageLoading'
import {useTranslations} from 'next-intl'
import {useSearchParams} from 'next/navigation'
import {useEffect, useState} from 'react'

const Page = () => {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const [state, setState] = useState<'verifying' | 'verified' | 'error'>('verifying')

  useEffect(() => {
    if (!code) return

    const verifyEmail = async () => {
      const response = await fetch(`/api/profile/email/verify?code=${code}`, {method: 'PUT'})

      if (!response.ok) {
        setState('error')
        return
      }

      setState('verified')
    }

    verifyEmail()
  }, [code])

  if (!code) return <h1 className="text-h4">{t('Emails.email-verification.missing-code')}</h1>

  switch (state) {
    case 'verifying':
      return (
        <main>
          <h1 className="pb-20 text-center text-h4">{t('Emails.email-verification.verifying')}</h1>
          <PageLoading />
        </main>
      )
    case 'verified':
      return (
        <main className="flex flex-col items-center gap-y-4">
          <h1 className="pb-10 text-center text-h4">{t('Emails.email-verification.verified')}</h1>
          <Button url="/profile" text={t('Menu.nav.profile')} />
          <Button url="/" text={t('Menu.nav.home')} variant="outlined" />
        </main>
      )
    case 'error':
    default:
      return (
        <main>
          <h1 className="text-center text-h5">{t('Emails.email-verification.error')}</h1>
        </main>
      )
  }
}

export default Page
