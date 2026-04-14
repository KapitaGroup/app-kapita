'use client'
import CheckboxCheckedIcon from '@/icons/CheckboxCheckedIcon'
import CheckboxUncheckedIcon from '@/icons/CheckboxUncheckedIcon'
import {useFormContext} from 'react-hook-form'
import {ConnectForm} from './ConnectForm'

type Props = {
  label?: string
  labelSize?: 'lg' | 'md'
  name: string
  hidden?: boolean
  children?: React.ReactNode
}
const Checkbox = ({label, labelSize = 'lg', name, hidden, children}: Props) => {
  const {setValue, watch} = useFormContext()
  const isChecked = !!watch(name)

  let labelClassNames: string
  switch (labelSize) {
    case 'md':
      labelClassNames = 'text-[16px] leading-[19px]'
      break
    default:
      labelClassNames = 'text-[18px] leading-[21px]'
      break
  }

  return (
    <ConnectForm>
      {({register}) =>
        hidden ? (
          <input {...register(name)} hidden id={name} name={name} />
        ) : (
          <div className="flex cursor-pointer select-none flex-col gap-[8px]">
            <div
              className={`flex items-center gap-[4px] ${labelSize === 'md' ? 'ml-[12px]' : ''}`}
              onClick={() => setValue(name, !isChecked, {shouldDirty: true})}
            >
              <input {...register(name)} hidden type="checkbox" id={name} name={name} checked={isChecked} />
              {isChecked ? <CheckboxCheckedIcon className="text-primary-800" /> : <CheckboxUncheckedIcon className="text-primary-800" />}
              {label && <p className={labelClassNames}>{label}</p>}
            </div>
            {isChecked && children && <div>{children}</div>}
          </div>
        )
      }
    </ConnectForm>
  )
}

export default Checkbox
