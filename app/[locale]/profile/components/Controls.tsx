'use client'
import Button from '@/components/Button'
import Progress from '@/components/Progress'
import ChevronIcon from '@/icons/ChevronIcon'
import LogoutIcon from '@/icons/LogoutIcon'
import {useTranslations} from 'next-intl'
import {signOut} from '@/libs/firebase/auth'
import type {ProfileOnboardingStagesType} from '@/utils/types'

type Props = {
  onStepChange: (increase: boolean) => void
  step: number
  maxStep: number
  percentage: number
  progressLabelCode: ProfileOnboardingStagesType
}
const Controls = ({onStepChange, step, maxStep, percentage, progressLabelCode}: Props) => {
  const t = useTranslations()

  return (
    <div className="fixed bottom-0 flex w-[calc(100%-24px)] flex-col gap-y-4 bg-white py-3 opacity-95 xl:left-12 xl:w-[calc(100%-96px)] xl:pb-6">
      <Progress percentage={percentage} labelCode={progressLabelCode} />
      <div className="flex items-center justify-between">
        <div onClick={() => signOut()} className="flex cursor-pointer gap-x-[6px] text-neutral-700 hover:text-neutral-800">
          <LogoutIcon />
          <span>{t('logout')}</span>
        </div>
        <div className="flex justify-center gap-4 xl:justify-end">
          <Button
            text=""
            icon={<ChevronIcon className="-rotate-90" />}
            onClick={() => onStepChange(false)}
            fluid={false}
            disabled={step === 1}
          />
          <Button
            text=""
            icon={<ChevronIcon className="rotate-90" />}
            onClick={() => onStepChange(true)}
            fluid={false}
            disabled={step >= maxStep}
          />
        </div>
      </div>
    </div>
  )
}

export default Controls
