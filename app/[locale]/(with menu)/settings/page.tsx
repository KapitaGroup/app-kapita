import {useTranslations} from 'next-intl'
import Section from './components/Section'

const Page = () => {
  const t = useTranslations('SettingsPage')

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-h2">{t('title')}</h1>
      <Section />
    </div>
  )
}
export default Page
