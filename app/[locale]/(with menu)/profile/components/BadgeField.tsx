'use client'
import {useFormContext} from 'react-hook-form'
import {type ProfileForm} from '../page'
import Badge from './Badge'
import type {
  InvestmentSectorType,
  InvestmentStageType,
  InvestmentStrategyType,
  PlacementHorizonType,
  PlacementTypeType
} from '@/utils/types'
import {useTranslations} from 'next-intl'

type Props<T> = {
  name: keyof ProfileForm
  translationCode: string
  label?: string
  list?: Readonly<T[]>
  selectedList?: T[]
}
const BadgeField = <
  T extends PlacementHorizonType | PlacementTypeType | InvestmentSectorType | InvestmentStrategyType | InvestmentStageType
>({
  name,
  translationCode,
  label,
  list = [],
  selectedList = []
}: Props<T>) => {
  const t = useTranslations()
  const {watch, setValue} = useFormContext<ProfileForm>()
  const isEdit = watch('isEdit')

  const onClick = (item: T) => {
    const updatedList = selectedList?.indexOf(item) === -1 ? [...selectedList, item] : selectedList?.filter(i => i !== item)

    setValue(name, updatedList as ProfileForm[keyof ProfileForm])
  }

  return (
    <div className="flex flex-col gap-y-1">
      {!!label && <h1 className="text-description">{label}</h1>}
      <div className="flex flex-wrap gap-[6px]">
        {(isEdit ? list : selectedList)?.map(
          item =>
            !!item && (
              <Badge
                key={item}
                label={t(`attributes.${translationCode}.options.${item}`)}
                selected={selectedList?.includes(item)}
                onClick={() => isEdit && onClick(item)}
                aria-pressed={selectedList?.includes(item)}
                className={isEdit ? 'cursor-pointer' : ''}
              />
            )
        )}
      </div>
    </div>
  )
}

export default BadgeField
