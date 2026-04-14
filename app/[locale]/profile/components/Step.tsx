import Button from '@/components/Button'
import ArrowIcon from '@/icons/ArrowIcon'
import {useTranslations} from 'next-intl'

type Props = {
  number: number
  titleCode: string
  children: React.ReactNode
  onOk: () => void
  okDisabled?: boolean
  loading?: boolean
  separator?: boolean
}
const Step = ({number, titleCode, children, onOk, okDisabled, loading, separator = true}: Props) => {
  const t = useTranslations()

  return (
    <div className="flex w-full gap-x-1">
      <div className="hidden xl:mt-[2px] xl:flex xl:h-fit xl:items-center xl:gap-x-1">
        <span className="text-h5">{number}</span>
        <ArrowIcon />
      </div>
      <div className="w-full">
        <h1 className="text-h4">{t(`WizardPage.step-titles.${titleCode}`)}</h1>
        <div className="py-2">{children}</div>
        {separator && <hr className="text-neutral-300" />}
        <Button text={t('ok')} onClick={onOk} fluid={false} disabled={okDisabled} loading={loading} className="mt-2 min-w-32" />
      </div>
    </div>
  )
}

export default Step
