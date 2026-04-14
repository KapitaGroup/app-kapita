'use client'
import {useTranslations} from 'next-intl'
import {Fragment} from 'react'
import Button from '../../../components/Button'
import Stage from './Stage'

type Props = {
  stages: readonly string[]
  stagesStates?: boolean[]
  onStart: () => void
  buttonLabel: string
}
const Introduction = ({stages, stagesStates, onStart, buttonLabel}: Props) => {
  const t = useTranslations()

  return (
    <section className="mt-[20vh] xl:mt-[35vh]">
      <h1 className="pb-1 text-h1">{t('WizardPage.title')}</h1>
      <p className="mb-8 text-body">{t('WizardPage.description')}</p>
      {!!stages?.length && (
        <ul className="mb-8 flex flex-col xl:flex-row xl:items-start xl:justify-center xl:gap-x-2">
          {stages.map((code, i) => (
            <Fragment key={code}>
              <Stage number={++i} label={t(`WizardPage.stage.${code}`)} completed={stagesStates?.[i - 1]} />
              {i !== stages.length && <span className="ml-[11px] h-6 w-[2px] bg-primary-800 xl:-mx-8 xl:mt-3 xl:h-[2px] xl:w-32" />}
            </Fragment>
          ))}
        </ul>
      )}
      <Button text={t(buttonLabel)} onClick={onStart} />
    </section>
  )
}

export default Introduction
