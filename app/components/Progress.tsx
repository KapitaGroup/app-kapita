import {useTranslations} from 'next-intl'
import ProgressLine from './ProgressLine'
import type {ProfileOnboardingStagesType} from '@/utils/types'

type Props = {
  percentage: number
  textLeft?: boolean
  labelCode: ProfileOnboardingStagesType
}
const Progress = ({percentage, textLeft, labelCode}: Props) => {
  const t = useTranslations()

  return (
    <div>
      <ProgressLine percentage={percentage} />
      <p className={`text-secondary text-description xl:pt-1 ${textLeft ? '' : 'text-right'}`}>
        {t(`complete-${labelCode}`, {percentage: Math.round(percentage)})}
      </p>
    </div>
  )
}

export default Progress
