'use client'
import {useEffect} from 'react'
import {useTranslations} from 'next-intl'
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '@/libs/firebase/config-client'
import {useRouter} from '@/i18n/routing'

const Page = () => {
  const t = useTranslations('Onboarding.pending')
  const [user, isLoading] = useAuthState(auth)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) router.replace('/login')
  }, [user, isLoading, router])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-h2 font-semibold text-neutral-900">{t('thanks')}</h1>
      <h2 className="text-h4 font-semibold text-neutral-900">{t('under-review')}</h2>
      <p className="text-body text-neutral-600">{t('description')}</p>

      <a
        href="https://www.kapita.com/contact"
        className="mt-4 inline-flex items-center justify-center self-start rounded-md bg-[#1F1F1F] px-6 py-3 text-white transition-all hover:bg-neutral-700">
        {t('request-call')}
      </a>
    </div>
  )
}

export default Page
