'use client'
import {useEffect, useRef, useState} from 'react'
import {useTranslations} from 'next-intl'
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '@/libs/firebase/config-client'
import {useRouter} from '@/i18n/routing'
import StepHeader from '../components/StepHeader'
import {Field, Input, Select} from '../components/FormField'
import {emptyDraft, readDraft, writeDraft, type OnboardingDraft} from '../components/draft'

const NEXT_STEP = '/onboarding/profile'

// Wait this long after auth resolves to !user before bouncing back to step 1.
// Covers the brief window after a Firebase custom-token sign-in completes on a
// neighbouring page and the auth state hasn't propagated to this route yet.
const AUTH_GRACE_MS = 1500

const Page = () => {
  const t = useTranslations('Onboarding.basic')
  const [user, isLoading] = useAuthState(auth)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [draft, setDraft] = useState<OnboardingDraft>(emptyDraft)
  const [error, setError] = useState<string | null>(null)
  const bounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Read draft from sessionStorage only after mount to avoid hydration
  // mismatches between SSR (always empty) and the first client render.
  useEffect(() => {
    setDraft(readDraft())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isLoading || user) {
      if (bounceTimer.current) {
        clearTimeout(bounceTimer.current)
        bounceTimer.current = null
      }
      return
    }
    bounceTimer.current = setTimeout(() => router.replace('/onboarding'), AUTH_GRACE_MS)
    return () => {
      if (bounceTimer.current) clearTimeout(bounceTimer.current)
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!user || hydrated) return
    let cancelled = false
    const hydrate = async () => {
      try {
        const token = await user.getIdTokenResult()
        const claims = token.claims as Record<string, unknown>
        const personalNumberRaw = claims.personalNumber
        const personalNumber =
          typeof personalNumberRaw === 'string'
            ? personalNumberRaw
            : personalNumberRaw && typeof personalNumberRaw === 'object'
              ? String((personalNumberRaw as {value?: unknown}).value ?? '')
              : ''
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
    if (!draft.firstName.trim() || !draft.lastName.trim() || !draft.personalNumber.trim()) {
      setError(t('error-bankid-missing'))
      return
    }
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

  // Skip rendering controlled-input values until after mount so React's SSR
  // and client trees match (avoids the "value changed from X to Y" warning
  // and the brief flash of empty fields after a draft rehydrate).
  if (!mounted) {
    return (
      <div className="flex flex-col gap-10">
        <StepHeader current={2} title={t('title')} subtitle={t('subtitle')} />
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-10" onSubmit={onSubmit}>
      <StepHeader current={2} title={t('title')} subtitle={t('subtitle')} />

      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <Field label={t('first-name')} htmlFor="firstName">
            <Input id="firstName" value={draft.firstName} disabled readOnly />
          </Field>
          <Field label={t('last-name')} htmlFor="lastName">
            <Input id="lastName" value={draft.lastName} disabled readOnly />
          </Field>
          <Field label={t('personal-number')} htmlFor="personalNumber" className="sm:col-span-2 xl:col-span-1">
            <Input id="personalNumber" value={draft.personalNumber} disabled readOnly />
          </Field>
        </div>

        <Field label={t('address')} htmlFor="address">
          <Input
            id="address"
            value={draft.address}
            onChange={e => update('address', e.target.value)}
            autoComplete="street-address"
            required
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label={t('postal-code')} htmlFor="postalCode">
            <Input
              id="postalCode"
              value={draft.postalCode}
              onChange={e => update('postalCode', e.target.value)}
              autoComplete="postal-code"
              inputMode="numeric"
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

      {error && (
        <p role="alert" className="text-description text-warning">
          {error}
        </p>
      )}

      <div className="flex xl:justify-end">
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
