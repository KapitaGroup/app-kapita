import {useTranslations} from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'

const Language = () => {
  const t = useTranslations('SettingsPage.language')

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-h3">{t('title')}</h1>
        <p>{t('description')}</p>
      </div>
      <LanguageSwitcher />
    </div>
  )
}

export default Language
