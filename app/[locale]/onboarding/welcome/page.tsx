'use client'
import {useEffect} from 'react'
import {useTranslations} from 'next-intl'
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '@/libs/firebase/config-client'
import {useRouter} from '@/i18n/routing'

const Page = () => {
  const t = useTranslations('Onboarding')
  const [user, isLoading] = useAuthState(auth)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) router.replace('/login')
  }, [user, isLoading, router])

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="flex flex-col gap-3">
        <h1 className="text-h2 font-semibold text-neutral-900">{t('welcome.title')}</h1>
        <p className="text-body text-neutral-600">{t('welcome.subtitle')}</p>
      </div>

      <div className="flex w-full flex-col gap-4">
        <div className="text-center text-sm font-medium text-neutral-500">{t('welcome.personal-section')}</div>
        <button
          type="button"
          onClick={() => router.push('/onboarding/personal')}
          className="flex items-center justify-center gap-3 rounded-md bg-neutral-900 px-6 py-3 text-white transition-all hover:bg-neutral-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/bankid-logo.svg" alt="BankID" className="h-6 w-6 invert" />
          <span className="text-base font-medium">BankID</span>
        </button>

        <div className="my-2 flex items-center gap-3">
          <div className="h-px flex-1 bg-neutral-200" />
          <span className="text-sm text-neutral-400">{t('welcome.or')}</span>
          <div className="h-px flex-1 bg-neutral-200" />
        </div>

        <a
          href="https://www.kapita.com/contact"
          className="flex items-center justify-center rounded-md bg-[#1F3D2E] px-6 py-3 text-white transition-all hover:bg-[#26483A]">
          <span className="text-base font-medium">{t('welcome.corporate')}</span>
        </a>
      </div>
    </div>
  )
}

export default Page
