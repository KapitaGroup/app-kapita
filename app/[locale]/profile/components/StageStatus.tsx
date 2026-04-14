'use client'
import {ProfileOnboardingStages} from '@/utils/lists'
import {useTranslations} from 'next-intl'
import {Fragment} from 'react'
import Stage from './Stage'

type Props = {
  stage: number
  stageStates: boolean[]
}
const StageStatus = ({stage, stageStates}: Props) => {
  const t = useTranslations()

  return (
    <ul className="fixed top-11 flex w-[calc(100%-32px)] items-center gap-x-2 bg-white pb-2 pt-3 opacity-95 xl:left-12 xl:mt-[52px] xl:items-start xl:justify-center xl:pt-3">
      {ProfileOnboardingStages.map((code, i) => (
        <Fragment key={code}>
          <Stage
            number={++i}
            label={t(`WizardPage.stage.${code}`)}
            selected={i === stage}
            completed={i < stage || (stageStates?.[i - 1] && i !== stage)}
          />
          {i !== ProfileOnboardingStages.length && <span className="h-[2px] w-full bg-primary-800 xl:-mx-8 xl:mt-3 xl:w-32" />}
        </Fragment>
      ))}
    </ul>
  )
}

export default StageStatus
