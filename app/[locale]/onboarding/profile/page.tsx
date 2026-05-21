'use client'
import {useEffect, useState} from 'react'
import {useTranslations} from 'next-intl'
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '@/libs/firebase/config-client'
import {useRouter} from '@/i18n/routing'
import StepHeader from '../components/StepHeader'
import {Field, Select} from '../components/FormField'
import {readDraft, writeDraft, type OnboardingDraft} from '../components/draft'

const NEXT_STEP = '/onboarding/terms'

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    aria-hidden="true"
    className="h-3.5 w-3.5 text-neutral-400">
    <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <path d="M8 7v4M8 5v.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

const Page = () => {
  const t = useTranslations('Onboarding.profile')
  const [user, isLoading] = useAuthState(auth)
  const router = useRouter()
  const [draft, setDraft] = useState<OnboardingDraft>(() => readDraft())
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) router.replace('/onboarding')
  }, [user, isLoading, router])

  const update = <K extends keyof OnboardingDraft>(key: K, value: OnboardingDraft[K]) =>
    setDraft(prev => ({...prev, [key]: value}))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!draft.experience || !draft.focus || !draft.typicalInvestment || !draft.portfolioSize) {
      setError(t('error-required'))
      return
    }
    writeDraft(draft)
    router.push(NEXT_STEP)
  }

  const experienceOptions = [
    {value: 'none', label: t('experience-none')},
    {value: 'some', label: t('experience-some')},
    {value: 'experienced', label: t('experience-experienced')},
    {value: 'professional', label: t('experience-professional')}
  ]
  const focusOptions = [
    {value: 'tech', label: t('focus-tech')},
    {value: 'real-estate', label: t('focus-real-estate')},
    {value: 'life-science', label: t('focus-life-science')},
    {value: 'private-equity', label: t('focus-private-equity')},
    {value: 'diversified', label: t('focus-diversified')}
  ]
  const typicalOptions = [
    {value: '<100k', label: t('typical-lt-100k')},
    {value: '100k-250k', label: t('typical-100k-250k')},
    {value: '250k-500k', label: t('typical-250k-500k')},
    {value: '500k-1m', label: t('typical-500k-1m')},
    {value: '>1m', label: t('typical-gt-1m')}
  ]
  const portfolioOptions = [
    {value: '<1m', label: t('portfolio-lt-1m')},
    {value: '1-5m', label: t('portfolio-1-5m')},
    {value: '5-25m', label: t('portfolio-5-25m')},
    {value: '>25m', label: t('portfolio-gt-25m')}
  ]

  return (
    <form className="flex flex-col gap-10" onSubmit={onSubmit}>
      <StepHeader current={3} title={t('title')} subtitle={t('subtitle')} />

      <div className="flex flex-col gap-5">
        <Field label={t('portfolio-size')} htmlFor="portfolio">
          <Select
            id="portfolio"
            value={draft.portfolioSize}
            onChange={e => update('portfolioSize', e.target.value)}
            required>
            <option value="" disabled>{t('select')}</option>
            {portfolioOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </Field>

        <Field
          label={t('typical-size')}
          htmlFor="typical"
          helper={
            <span title={t('typical-size-help')} className="cursor-help">
              <InfoIcon />
            </span>
          }>
          <Select
            id="typical"
            value={draft.typicalInvestment}
            onChange={e => update('typicalInvestment', e.target.value)}
            required>
            <option value="" disabled>{t('select')}</option>
            {typicalOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </Field>

        <Field label={t('focus')} htmlFor="focus">
          <Select id="focus" value={draft.focus} onChange={e => update('focus', e.target.value)} required>
            <option value="" disabled>{t('select')}</option>
            {focusOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </Field>

        <Field label={t('experience')} htmlFor="experience">
          <Select
            id="experience"
            value={draft.experience}
            onChange={e => update('experience', e.target.value)}
            required>
            <option value="" disabled>{t('select')}</option>
            {experienceOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </Field>
      </div>

      {error && <p className="text-description text-warning">{error}</p>}

      <div className="flex xl:justify-center">
        <button
          type="submit"
          className="w-full rounded-md bg-neutral-900 px-8 py-3 text-button text-white transition-colors hover:bg-neutral-800 xl:w-auto">
          {t('submit')}
        </button>
      </div>
    </form>
  )
}

export default Page
