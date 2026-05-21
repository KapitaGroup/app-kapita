'use client'
import {useEffect, useState} from 'react'
import {useTranslations} from 'next-intl'
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '@/libs/firebase/config-client'
import {useRouter} from '@/i18n/routing'
import StepHeader from '../components/StepHeader'
import {Field, Input, Select} from '../components/FormField'
import {readDraft, writeDraft, type OnboardingDraft} from '../components/draft'

const NEXT_STEP = '/onboarding/profile'

const Page = () => {
  const t = useTranslations('Onboarding.basic')
  const [user, isLoading] = useAuthState(auth)
  const router = useRouter()
  const [hydrated, setHydrated] = useState(false)
  const [draft, setDraft] = useState<OnboardingDraft>(() => readDraft())
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) router.replace('/onboarding')
  }, [user, isLoading, router])

  useEffect(() => {
    if (!user || hydrated) return
    let cancelled = false
    const hydrate = async () => {
      try {
        const token = await user.getIdTokenResult()
        const claims = token.claims as Record<string, unknown>
        const personalNumber = (claims.personalNumber as string | undefined) ?? ''
        const fullName = (user.displayName || '').trim()
        const [firstName, ...rest] = fullName.split(/\s+/)
        const lastName = rest.join(' ')
        if (cancelled) return
        setDraft(prev => ({
          ...prev,
          firstName: prev.firstName || firstName || '',
          lastName: prev.lastName || lastName || '',
          personalNumber: prev.personalNumber || personalNumber,
          email: prev.email || user.email || ''
        }))
      } finally {
        if (!cancelled) setHydrated(true)
      }
    }
    hydrate()
    return () => {
      cancelled = true
    }
  }, [user, hydrated])

  const update = <K extends keyof OnboardingDraft>(key: K, value: OnboardingDraft[K]) =>
    setDraft(prev => ({...prev, [key]: value}))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (
      !draft.address.trim() ||
      !draft.postalCode.trim() ||
      !draft.city.trim() ||
      !draft.phone.trim() ||
      !draft.email.trim() ||
      !draft.investorType
    ) {
      setError(t('error-required'))
      return
    }
    writeDraft(draft)
    router.push(NEXT_STEP)
  }

  return (
    <form className="flex flex-col gap-10" onSubmit={onSubmit}>
      <StepHeader current={2} title={t('title')} subtitle={t('subtitle')} />

      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Field label={t('first-name')} htmlFor="firstName">
            <Input id="firstName" value={draft.firstName} disabled readOnly />
          </Field>
          <Field label={t('last-name')} htmlFor="lastName">
            <Input id="lastName" value={draft.lastName} disabled readOnly />
          </Field>
          <Field label={t('personal-number')} htmlFor="personalNumber">
            <Input id="personalNumber" value={draft.personalNumber} disabled readOnly />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-[2fr_1fr_1fr]">
          <Field label={t('address')} htmlFor="address">
            <Input
              id="address"
              value={draft.address}
              onChange={e => update('address', e.target.value)}
              autoComplete="street-address"
              required
            />
          </Field>
          <Field label={t('postal-code')} htmlFor="postalCode">
            <Input
              id="postalCode"
              value={draft.postalCode}
              onChange={e => update('postalCode', e.target.value)}
              autoComplete="postal-code"
              required
            />
          </Field>
          <Field label={t('city')} htmlFor="city">
            <Input
              id="city"
              value={draft.city}
              onChange={e => update('city', e.target.value)}
              autoComplete="address-level2"
              required
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label={t('phone')} htmlFor="phone">
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={draft.phone}
              onChange={e => update('phone', e.target.value)}
              required
            />
          </Field>
          <Field label={t('email')} htmlFor="email">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={draft.email}
              onChange={e => update('email', e.target.value)}
              required
            />
          </Field>
        </div>

        <Field label={t('investor-type')} htmlFor="investorType">
          <Select
            id="investorType"
            value={draft.investorType}
            onChange={e => update('investorType', e.target.value as OnboardingDraft['investorType'])}
            required>
            <option value="" disabled>
              {t('investor-select')}
            </option>
            <option value="private">{t('investor-private')}</option>
            <option value="company">{t('investor-company')}</option>
          </Select>
        </Field>
      </div>

      {error && <p className="text-description text-warning">{error}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-8 py-3 text-button text-white transition-colors hover:bg-neutral-800">
          {t('submit')}
        </button>
      </div>
    </form>
  )
}

export default Page
