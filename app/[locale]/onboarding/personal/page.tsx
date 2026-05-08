'use client'
import {useEffect, useState} from 'react'
import {useTranslations} from 'next-intl'
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '@/libs/firebase/config-client'
import {useRouter} from '@/i18n/routing'

type FormState = {
  phone: string
  email: string
  investmentExperience: string
  minInvestment: string
  portfolioSize: string
  acceptedTerms: boolean
}

const Page = () => {
  const t = useTranslations('Onboarding.personal')
  const [user, isLoading] = useAuthState(auth)
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({
    phone: '',
    email: '',
    investmentExperience: '',
    minInvestment: '',
    portfolioSize: '',
    acceptedTerms: false
  })

  useEffect(() => {
    if (!isLoading && !user) router.replace('/login')
  }, [user, isLoading, router])

  const firstName = user?.displayName?.split(' ')[0] || ''

  const onChange = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({...prev, [key]: value}))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setError(null)

    if (!form.phone || !form.email) {
      setError(t('error-required'))
      return
    }
    if (!form.acceptedTerms) {
      setError(t('error-terms'))
      return
    }

    setSubmitting(true)
    try {
      const idToken = await user.getIdToken()
      const response = await fetch('/api/onboarding/submit', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${idToken}`},
        body: JSON.stringify(form)
      })
      if (!response.ok) {
        setError(t('error-submit'))
        setSubmitting(false)
        return
      }
      // Refresh the ID token so the new applicationStatus claim is in client state
      await user.getIdToken(true)
      router.push('/onboarding/pending')
    } catch {
      setError(t('error-submit'))
      setSubmitting(false)
    }
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <div className="flex flex-col gap-2">
        <h1 className="text-h2 font-semibold text-neutral-900">{firstName ? t('greeting', {name: firstName}) : t('greeting-fallback')}</h1>
        <p className="text-body text-neutral-600">{t('intro')}</p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-h5 font-semibold text-neutral-900">{t('contact')}</h2>
        <Field label={t('phone')}>
          <input
            type="tel"
            inputMode="tel"
            value={form.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder={t('phone-placeholder')}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-body focus:border-neutral-900 focus:outline-none"
            required
          />
        </Field>
        <Field label={t('email')}>
          <input
            type="email"
            value={form.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder={t('email-placeholder')}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-body focus:border-neutral-900 focus:outline-none"
            required
          />
        </Field>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-h5 font-semibold text-neutral-900">{t('suitability')}</h2>
          <p className="text-sm text-neutral-500">{t('suitability-help')}</p>
        </div>

        <Field label={t('experience')}>
          <select
            value={form.investmentExperience}
            onChange={(e) => onChange('investmentExperience', e.target.value)}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-body focus:border-neutral-900 focus:outline-none"
            required>
            <option value="" disabled>{t('select')}</option>
            <option value="yes">{t('yes')}</option>
            <option value="no">{t('no')}</option>
          </select>
        </Field>

        <Field label={t('min-investment')}>
          <select
            value={form.minInvestment}
            onChange={(e) => onChange('minInvestment', e.target.value)}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-body focus:border-neutral-900 focus:outline-none"
            required>
            <option value="" disabled>{t('select-amount')}</option>
            <option value="100k">100 000 SEK</option>
            <option value="250k">250 000 SEK</option>
            <option value="500k">500 000 SEK</option>
            <option value="1m">1 000 000 SEK +</option>
          </select>
        </Field>

        <Field label={t('portfolio-size')}>
          <select
            value={form.portfolioSize}
            onChange={(e) => onChange('portfolioSize', e.target.value)}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-body focus:border-neutral-900 focus:outline-none"
            required>
            <option value="" disabled>{t('select-size')}</option>
            <option value="<1m">&lt; 1 000 000 SEK</option>
            <option value="1-5m">1–5 000 000 SEK</option>
            <option value="5-25m">5–25 000 000 SEK</option>
            <option value=">25m">&gt; 25 000 000 SEK</option>
          </select>
        </Field>
      </section>

      <label className="flex items-start gap-3 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={form.acceptedTerms}
          onChange={(e) => onChange('acceptedTerms', e.target.checked)}
          className="mt-1 h-4 w-4"
        />
        <span>
          {t('terms-prefix')}{' '}
          <a href="https://www.kapita.com/terms-and-conditions" target="_blank" rel="noreferrer" className="underline">
            {t('terms-link')}
          </a>{' '}
          {t('and')}{' '}
          <a href="https://www.kapita.com/privacy-policy" target="_blank" rel="noreferrer" className="underline">
            {t('privacy-link')}
          </a>
          .
        </span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="self-start rounded-md bg-neutral-900 px-8 py-3 text-white transition-all hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60">
        {submitting ? t('submitting') : t('submit')}
      </button>
    </form>
  )
}

const Field = ({label, children}: {label: string; children: React.ReactNode}) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-sm text-neutral-700">{label}</span>
    {children}
  </label>
)

export default Page
