'use client'
import {useEffect, useState} from 'react'
import {useTranslations} from 'next-intl'
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '@/libs/firebase/config-client'
import {useRouter} from '@/i18n/routing'
import StepHeader from '../components/StepHeader'
import {clearDraft, readDraft, writeDraft, type OnboardingDraft} from '../components/draft'

const CheckRow = ({
  id,
  checked,
  onChange,
  children
}: {
  id: string
  checked: boolean
  onChange: (next: boolean) => void
  children: React.ReactNode
}) => (
  <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-body text-neutral-700">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={e => onChange(e.target.checked)}
      className="mt-1 h-[18px] w-[18px] cursor-pointer rounded border-neutral-300 accent-neutral-900"
    />
    <span>{children}</span>
  </label>
)

const Page = () => {
  const t = useTranslations('Onboarding.terms')
  const [user, isLoading] = useAuthState(auth)
  const router = useRouter()
  const [draft, setDraft] = useState<OnboardingDraft>(() => readDraft())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) router.replace('/onboarding')
  }, [user, isLoading, router])

  const setRisk = (i: number, value: boolean) =>
    setDraft(prev => {
      const next = [...prev.riskAccepted]
      next[i] = value
      return {...prev, riskAccepted: next}
    })

  const setResp = (i: number, value: boolean) =>
    setDraft(prev => {
      const next = [...prev.responsibilityAccepted]
      next[i] = value
      return {...prev, responsibilityAccepted: next}
    })

  const allChecked =
    draft.riskAccepted.every(Boolean) && draft.responsibilityAccepted.every(Boolean) && draft.termsAccepted

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!user) return
    if (!allChecked) {
      setError(t('error-required'))
      return
    }
    writeDraft(draft)
    setSubmitting(true)
    try {
      const idToken = await user.getIdToken()
      const response = await fetch('/api/onboarding/submit', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${idToken}`},
        body: JSON.stringify({
          firstName: draft.firstName,
          lastName: draft.lastName,
          personalNumber: draft.personalNumber,
          address: draft.address,
          postalCode: draft.postalCode,
          city: draft.city,
          phone: draft.phone,
          email: draft.email,
          investorType: draft.investorType,
          experience: draft.experience,
          focus: draft.focus,
          typicalInvestment: draft.typicalInvestment,
          portfolioSize: draft.portfolioSize,
          riskAccepted: draft.riskAccepted,
          responsibilityAccepted: draft.responsibilityAccepted,
          termsAccepted: draft.termsAccepted
        })
      })
      if (!response.ok) {
        setError(t('error-submit'))
        setSubmitting(false)
        return
      }
      await user.getIdToken(true)
      clearDraft()
      router.push('/onboarding/pending')
    } catch {
      setError(t('error-submit'))
      setSubmitting(false)
    }
  }

  return (
    <form className="flex flex-col gap-10" onSubmit={onSubmit}>
      <StepHeader current={4} title={t('title')} subtitle={t('subtitle')} />

      <div className="flex flex-col gap-8">
        <Section title={t('risk-heading')}>
          <CheckRow id="risk-1" checked={draft.riskAccepted[0]} onChange={v => setRisk(0, v)}>
            {t('risk-1')}
          </CheckRow>
          <CheckRow id="risk-2" checked={draft.riskAccepted[1]} onChange={v => setRisk(1, v)}>
            {t('risk-2')}
          </CheckRow>
          <CheckRow id="risk-3" checked={draft.riskAccepted[2]} onChange={v => setRisk(2, v)}>
            {t('risk-3')}
          </CheckRow>
        </Section>

        <Section title={t('responsibility-heading')}>
          <CheckRow id="resp-1" checked={draft.responsibilityAccepted[0]} onChange={v => setResp(0, v)}>
            {t('responsibility-1')}
          </CheckRow>
          <CheckRow id="resp-2" checked={draft.responsibilityAccepted[1]} onChange={v => setResp(1, v)}>
            {t('responsibility-2')}
          </CheckRow>
        </Section>

        <Section title={t('terms-heading')}>
          <CheckRow
            id="terms-accept"
            checked={draft.termsAccepted}
            onChange={v => setDraft(prev => ({...prev, termsAccepted: v}))}>
            {t('terms-accept-prefix')}{' '}
            <a
              href="https://www.kapita.com/terms-and-conditions"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-neutral-900">
              {t('terms-link')}
            </a>{' '}
            {t('and')}{' '}
            <a
              href="https://www.kapita.com/privacy-policy"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-neutral-900">
              {t('privacy-link')}
            </a>
            .
          </CheckRow>
        </Section>
      </div>

      {error && <p className="text-description text-warning">{error}</p>}

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-neutral-900 px-8 py-3 text-button text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60">
          {submitting ? t('submitting') : t('submit')}
        </button>
      </div>
    </form>
  )
}

const Section = ({title, children}: {title: string; children: React.ReactNode}) => (
  <section className="flex flex-col gap-3">
    <h2 className="text-h5 text-neutral-900">{title}</h2>
    <div className="flex flex-col gap-2.5">{children}</div>
  </section>
)

export default Page
