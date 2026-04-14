'use client'
import {languageIcons, type LocaleType, routing, usePathname, useRouter} from '@/i18n/routing'
import {useLocale} from 'next-intl'
import {useState} from 'react'
import ChevronIcon from '@/icons/ChevronIcon'

const LanguageDropdown = () => {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale() as LocaleType
  const [open, setOpen] = useState(false)

  const onlanguagechange = (localeToChange: LocaleType) => {
    setOpen(false)
    if (localeToChange === currentLocale) return

    router.push(pathname, {locale: localeToChange})
  }

  return (
    <div className="relative select-none">
      <div className="flex cursor-pointer items-center gap-x-[6px]" onClick={() => setOpen(prev => !prev)}>
        <span className="flex">{languageIcons[currentLocale]({className: 'size-4'})}</span>
        <span className="text-button">{currentLocale.toUpperCase()}</span>
        <ChevronIcon className={`${open ? 'scale-[-1]' : ''} rotate-90 transition-transform duration-200`} />
      </div>
      {open && (
        <div className="starting:opacity-0 absolute top-[2em] flex flex-col gap-y-1 transition-opacity duration-300">
          {routing.locales.map(locale => (
            <div
              key={locale}
              className="flex cursor-pointer items-center gap-x-[6px] bg-white p-1"
              onClick={() => onlanguagechange(locale)}
            >
              <span className="flex">{languageIcons[locale]({className: 'size-4'})}</span>
              <span className={locale === currentLocale ? 'font-bold text-button' : 'text-button'}>{locale.toUpperCase()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageDropdown
