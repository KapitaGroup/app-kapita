'use client'
import RadioButton from '@/components/RadioButton'
import {useLocale, useTranslations} from 'next-intl'
import {LocaleType, routing, usePathname, useRouter} from '@/i18n/routing'
import {languageIcons} from '@/i18n/languageIcons'

const LanguageSwitcher = () => {
  const t = useTranslations('SettingsPage.language.language-options')
  const pageLocale = useLocale() as LocaleType
  const router = useRouter()
  const pathname = usePathname()

  const onLanguageChange = async (locale: LocaleType) => {
    if (locale === pageLocale) return

    router.replace(pathname, {locale})
  }

  return (
    <div className="flex flex-col">
      {routing.locales.map(locale => (
        <div
          key={locale}
          onClick={() => onLanguageChange(locale)}
          className="flex w-full cursor-pointer items-center gap-x-2 py-[20px] pr-6"
        >
          {languageIcons[locale]({})}
          <div className="flex w-full items-center justify-between">
            <label className={locale === pageLocale ? 'text-button' : ''} htmlFor={locale}>
              {t(locale)}
            </label>
            <RadioButton checked={locale === pageLocale} name={locale} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default LanguageSwitcher
