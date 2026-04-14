'use client'
import RadioSection from '@/components/RadioSection'
import {ProfileForm} from '../page'
import {useFormContext} from 'react-hook-form'
import {useTranslations} from 'next-intl'

type Props = {
  name: keyof ProfileForm
  translationCode: string
  label?: string
  options?: Readonly<string[]>
}
const RadioField = ({name, translationCode, label, options}: Props) => {
  const {watch} = useFormContext<ProfileForm>()
  const t = useTranslations()
  const watches = watch()

  return (
    <div className="flex flex-col gap-y-1">
      {!!label && <h1 className="text-description">{label}</h1>}
      {watches.isEdit ? (
        <RadioSection name={name} translationCode={translationCode} options={options} selectedValue={watch(name)} />
      ) : (
        <p>{!!watches[name] ? t(`attributes.${translationCode}.options.${watches[name]}`) : ''}</p>
      )}
    </div>
  )
}

export default RadioField
