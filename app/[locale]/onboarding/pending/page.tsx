'use client'
import {useEffect} from 'react'
import {useTranslations} from 'next-intl'
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '@/libs/firebase/config-client'
import {useRouter} from '@/i18n/routing'
import StepHeader from '../components/StepHeader'

const IdentityIcon = ({className = ''}: {className?: string}) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="9" cy="11" r="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 16c.7-1.2 1.8-2 3-2s2.3.8 3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 10h5M14 13h4M14 16h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const ProfileIcon = ({className = ''}: {className?: string}) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path d="M4 7h10M18 7h2M4 12h2M10 12h10M4 17h12M20 17h0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="16" cy="7" r="1.8" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="8" cy="12" r="1.8" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18" cy="17" r="1.8" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const KeyIcon = ({className = ''}: {className?: string}) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <circle cx="8" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 12h9M18 12v3M21 12v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const StatusRow = ({
  icon,
  title,
  subtitle,
  state
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  state: string
}) => (
  <div className="flex items-center gap-5">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-900">
      {icon}
    </div>
    <div className="flex flex-1 items-center justify-between gap-4">
      <div className="flex flex-col">
        <span className="text-h6 text-neutral-900">{title}</span>
        <span className="text-description text-neutral-500">{subtitle}</span>
      </div>
      <span className="text-description text-neutral-600">{state}</span>
    </div>
  </div>
)

const Page = () => {
  const t = useTranslations('Onboarding.pending')
  const [user, isLoading] = useAuthState(auth)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) router.replace('/login')
  }, [user, isLoading, router])

  return (
    <div className="flex flex-col gap-10">
      <StepHeader current={4} title={t('title')} subtitle={t('subtitle')} />

      <div className="flex flex-col gap-6">
        <StatusRow
          icon={<IdentityIcon className="h-6 w-6" />}
          title={t('identity-title')}
          subtitle={t('identity-subtitle')}
          state={t('identity-state')}
        />
        <StatusRow
          icon={<ProfileIcon className="h-6 w-6" />}
          title={t('profile-title')}
          subtitle={t('profile-subtitle')}
          state={t('profile-state')}
        />
        <StatusRow
          icon={<KeyIcon className="h-6 w-6" />}
          title={t('access-title')}
          subtitle={t('access-subtitle')}
          state={t('access-state')}
        />
      </div>

      <div className="flex justify-center">
        <a
          href="https://www.kapita.com/"
          className="rounded-md bg-neutral-900 px-8 py-3 text-button text-white transition-colors hover:bg-neutral-800">
          {t('back-home')}
        </a>
      </div>
    </div>
  )
}

export default Page
