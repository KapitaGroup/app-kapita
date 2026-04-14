import {useTranslations} from 'next-intl'
import Badge from '../[locale]/(with menu)/opportunities/components/Badge'
import RadioButton from './RadioButton'
import {useFormContext} from 'react-hook-form'
import {type ProfileForm} from '../[locale]/(with menu)/profile/page'

type Props = {
  name: keyof ProfileForm
  translationCode: string
  options?: Readonly<string[]>
  selectedValue?: unknown
}
const RadioSection = ({name, translationCode, options, selectedValue}: Props) => {
  const t = useTranslations()
  const {setValue} = useFormContext<ProfileForm>()

  const onClick = (value: string) => setValue(name, value)

  return (
    <div className="flex flex-col gap-y-[6px]">
      {options?.map(option => (
        <div key={option} className="flex cursor-pointer items-center gap-x-1 group w-fit" onClick={() => onClick(option)}>
          <RadioButton name={name} checked={option === selectedValue} />
          <Badge
            label={t(`attributes.${translationCode}.options.${option}`)}
            className={option === selectedValue ? 'bg-primary-900 text-neutral-100' : ''}
          />
        </div>
      ))}
    </div>
  )
}

export default RadioSection
