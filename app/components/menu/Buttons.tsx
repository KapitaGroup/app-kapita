'use client'
import {Link, usePathname} from '@/i18n/routing'
import CogIcon from '@/icons/CogIcon'
import LogoutIcon from '@/icons/LogoutIcon'
import {useTranslations} from 'next-intl'
import AvatarIcon from '@/icons/AvatarIcon'
import Image from 'next/image'
import {selectedItemClasses} from './Menu'
import {useProfile} from '@/hooks/useProfile'
import {signOut} from '@/libs/firebase/auth'

type Props = {
  closeMenu: () => void
}
const Buttons = ({closeMenu}: Props) => {
  const pathname = usePathname()
  const t = useTranslations()
  const {profile} = useProfile()

  return (
    <div className="flex flex-col text-neutral-700 [&>*]:flex [&>*]:items-center [&>*]:gap-x-[6px] [&>*]:py-2">
      <Link
        href="/profile"
        aria-label={t('Menu.nav.profile')}
        className={pathname === '/profile' ? selectedItemClasses : ''}
        onClick={closeMenu}
      >
        {!!profile?.image?.[0]?.url ? (
          <Image
            src={profile?.image[0].url}
            alt={t('Menu.nav.profile-image')}
            width={24}
            height={24}
            sizes="24px"
            priority
            className="h-6 w-6 rounded-full object-cover"
          />
        ) : (
          <AvatarIcon className="h-6 w-6 rounded-full object-cover" />
        )}
        {t('Menu.nav.profile')}
      </Link>
      <Link href="/settings" aria-label={t('settings')} className={pathname === '/settings' ? selectedItemClasses : ''} onClick={closeMenu}>
        <CogIcon />
        <span>{t('settings')}</span>
      </Link>
      <div onClick={() => signOut()} className="cursor-pointer">
        <LogoutIcon />
        <span>{t('logout')}</span>
      </div>
    </div>
  )
}

export default Buttons
