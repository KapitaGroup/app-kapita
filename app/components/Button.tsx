'use client'
import {Link} from '@/i18n/routing'
import LoadingIcon from '@/icons/LoadingIcon'

export type ButtonProps = {
  text: string
  icon?: JSX.Element
  iconPosition?: 'start' | 'end'
  url?: string
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target']
  onClick?: () => void
  variant?: 'base' | 'outlined' | 'link'
  disabled?: boolean
  loading?: boolean
  fluid?: boolean
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']
  className?: string
}
const Button = ({
  text,
  icon,
  iconPosition = 'start',
  url,
  target,
  onClick,
  variant = 'base',
  disabled,
  loading,
  fluid = true,
  type = 'button',
  className = ''
}: ButtonProps) => {
  let variantClasses: string
  let hoverClasses: string
  let activeClasses: string
  let focusClasses: string
  let interactiveClasses: string

  switch (variant) {
    case 'outlined':
      hoverClasses =
        'hover:text-primary hover:bg-neutral-100 hover:ring-[1.5px] hover:-ring-offset-[1.5px] hover:ring-black hover:shadow-[0_1px_3px_1px_rgba(0,0,0,0.15)] hover:before:shadow-[0_1px_2px_0px_rgba(0,0,0,0.3)]'
      activeClasses =
        'active:text-neutral-1000 active:ring-[1.5px] active:-ring-offset-[1.5px] active:bg-[rgba(0,0,0,0.1)] active:ring-black'
      focusClasses = 'focus:ring-2 focus:-ring-offset-2 focus:bg-[rgba(0,0,0,0.05)] focus:text-primary focus:ring-black'
      interactiveClasses = `${hoverClasses} ${activeClasses} ${focusClasses}`
      variantClasses = `${disabled ? 'text-disabled' : `${interactiveClasses} text-neutral-800`} ring-black ring-1 -ring-offset-1 bg-white text-button rounded-[5px] px-6 py-2 h-12 items-center`
      break
    case 'link':
      hoverClasses = 'hover:text-primary'
      activeClasses = 'active:text-neutral-1000 active:ring-1 active:-ring-offset-1 active:ring-black'
      focusClasses = 'focus:ring-2 focus:-ring-offset-2 focus:ring-black'
      interactiveClasses = `${hoverClasses} ${activeClasses} ${focusClasses}`
      variantClasses = `${disabled ? 'text-disabled' : `${interactiveClasses} text-neutral-800`} text-button-link my-[10px]`
      break
    case 'base':
    default:
      hoverClasses =
        'hover:bg-primary-900 hover:shadow-[0_1px_3px_1px_rgba(0,0,0,0.15)] hover:before:shadow-[0_1px_2px_0px_rgba(0,0,0,0.3)]'
      activeClasses = 'active:bg-primary-1000'
      focusClasses = 'focus:bg-primary-1000 focus:ring-2 focus:ring-primary-1000 focus:ring-offset-1'
      interactiveClasses = `${hoverClasses} ${activeClasses} ${focusClasses}`
      variantClasses = `${disabled ? 'bg-neutral-400' : `bg-primary-800 ${interactiveClasses}`} text-neutral-100 text-button rounded-[5px] px-6 py-2 h-12 items-center`
      break
  }

  const baseClasses = `${fluid ? 'w-full' : 'w-fit'} ${disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer'} flex justify-center whitespace-nowrap`
  const allClasses = `${variantClasses} ${baseClasses}`

  const iconWithLoader = loading ? <LoadingIcon className="animate-spin" /> : icon

  const label = (
    <span className="flex items-center gap-[6px]">
      {iconPosition === 'start' ? iconWithLoader : null}
      {text}
      {iconPosition === 'end' ? iconWithLoader : null}
    </span>
  )

  const ButtonBase = () => (
    <button type={type} className={`${className} ${allClasses}`} onClick={() => onClick && !disabled && onClick()}>
      {label}
    </button>
  )

  if (!!url && !disabled)
    return (
      <Link href={url} aria-label={text} className={fluid ? 'w-full' : ''} target={target}>
        <ButtonBase />
      </Link>
    )

  return <ButtonBase />
}

export default Button
