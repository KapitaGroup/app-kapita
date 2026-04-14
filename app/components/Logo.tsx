'use client'
import {Link} from '@/i18n/routing'
import LogoIcon from '@/icons/LogoIcon'

type Props = {
  size?: 'sm' | 'md' | 'lg'
  url?: string
  className?: string
}
const Logo = ({size = 'sm', url = '/', className = ''}: Props) => {
  const withLink = (children: React.ReactNode) =>
    url ? (
      <Link href={url} aria-label={url} className={className}>
        {children}
      </Link>
    ) : (
      children
    )

  let sizeClassName: string

  switch (size) {
    case 'lg':
      sizeClassName = 'h-[108px] w-[222px]'
      break
    case 'md':
      sizeClassName = 'h-[48px] w-[111px]'
      break
    case 'sm':
      sizeClassName = 'h-[32px] w-[74px]'
      break
  }

  return withLink(<LogoIcon className={`${sizeClassName} ${className}`} />)
}

export default Logo
