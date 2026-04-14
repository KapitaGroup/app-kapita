'use client'
import type {Option} from '@/utils/types'
import {ConnectForm} from './ConnectForm'

type Props = {
  name: string
  options: Option[]
  startingOptions?: Option[]
  hasEmpty?: boolean
}
const Dropdown = ({name, options, startingOptions = [], hasEmpty}: Props) => {
  return (
    <ConnectForm>
      {({register}) => (
        <div className="relative">
          <select
            {...register(name)}
            id={name}
            name={name}
            aria-label={name}
            className={`w-full cursor-pointer border-b-[1px] border-r-2 border-b-neutral-800 border-r-transparent bg-transparent py-[10px] hover:border-b-primary focus:border-b-2 focus:pb-[9px] focus:!outline-none focus-visible:!outline-none`}
          >
            {hasEmpty && <option value="" className="text-neutral-600"></option>}
            {!!startingOptions?.length &&
              startingOptions.map(({key, label}) => (
                <option key={`starting-${key}`} value={key}>
                  {label ?? key}
                </option>
              ))}
            {!!startingOptions?.length && !!options?.length && <option disabled>---------------</option>}
            {!!options?.length &&
              options.map(({key, label}) => (
                <option key={key} value={key}>
                  {label ?? key}
                </option>
              ))}
          </select>
        </div>
      )}
    </ConnectForm>
  )
}

export default Dropdown
