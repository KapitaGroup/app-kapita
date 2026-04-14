'use client'
import {ValidationRule} from 'react-hook-form'
import {ConnectForm} from './ConnectForm'
import Error from './Error'

type Props = {
  label?: string
  name: string
  hidden?: boolean
  disabled?: boolean
  pattern?: ValidationRule<RegExp>
  icon?: JSX.Element
  onEnter?: () => void
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>
const Input = ({label = '', name, type = 'text', hidden, disabled, pattern, icon, onEnter, className = '', ...props}: Props) => {
  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && onEnter && onEnter()

  return (
    <ConnectForm>
      {({register, watch}) => {
        const [value, errors] = watch([name, 'errors'])
        const error = errors?.[name]

        return hidden ? (
          <input {...register(name)} name={name} hidden />
        ) : (
          <div className="flex w-full flex-col gap-1 pt-[2px]">
            {label && (
              <label htmlFor={name} className={`text-description ${!value ? 'opacity-0' : ''}`}>
                {label}
              </label>
            )}
            <div
              className={`${className} flex w-full items-center gap-x-2 border-b-[1px] ${error ? 'border-b-warning' : disabled ? 'border-disabled' : 'border-neutral-800'}`}
            >
              <input
                {...register(name, {pattern})}
                {...props}
                type={type}
                id={name}
                name={name}
                className={`my-[10px] min-h-[1.3rem] w-full placeholder:text-neutral-600 focus:!outline-none focus-visible:!outline-none ${disabled ? 'disabled:bg-transparent disabled:text-disabled disabled:opacity-100' : ''}`}
                placeholder={label}
                disabled={disabled}
                onKeyUp={e => !!onEnter && onKeyUp(e)}
              />
              {icon}
            </div>
            <Error error={error} />
          </div>
        )
      }}
    </ConnectForm>
  )
}

export default Input
