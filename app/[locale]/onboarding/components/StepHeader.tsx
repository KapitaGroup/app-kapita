'use client'
import {useTranslations} from 'next-intl'

type Props = {
  current: number
  total?: number
  title: string
  subtitle?: string
}

const StepHeader = ({current, total = 4, title, subtitle}: Props) => {
  const t = useTranslations('Onboarding.shared')
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-description text-neutral-500">{t('step-label', {current, total})}</span>
        <div className="flex gap-1.5" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}>
          {Array.from({length: total}).map((_, i) => (
            <span
              key={i}
              className={`h-[3px] w-12 rounded-full ${i < current ? 'bg-neutral-900' : 'bg-neutral-200'}`}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-h2 text-neutral-900">{title}</h1>
        {subtitle && <p className="text-body text-neutral-600">{subtitle}</p>}
      </div>
    </div>
  )
}

export default StepHeader
