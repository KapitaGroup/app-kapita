'use client'
import {Link, usePathname} from '@/i18n/routing'
import PieChartIcon from '@/icons/PieChartIcon'
import {useTranslations} from 'next-intl'
import {selectedItemClasses} from './Menu'
import BankIcon from '@/icons/BankIcon'

type Props = {
  closeMenu: () => void
}
const Navigation = ({closeMenu}: Props) => {
  const pathname = usePathname()
  const t = useTranslations('Menu.nav')

  const navItems = [
    {
      url: '/',
      label: t('opportunities'),
      children: (
        <>
          <BankIcon />
          {t('opportunities')}
        </>
      )
    },
    {
      url: '/secondary',
      label: t('secondary'),
      children: (
        <>
          <PieChartIcon />
          {t('secondary')}
        </>
      )
    }
  ]
  return (
    <nav>
      <ul className="flex flex-col gap-y-2 text-secondary [&>li>a]:py-2">
        {navItems.map(({url, label, children}) => (
          <li key={url} onClick={closeMenu}>
            <Link href={url} aria-label={label} className={`${pathname === url ? selectedItemClasses : ''} flex items-center gap-x-[6px]`}>
              {children}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation
