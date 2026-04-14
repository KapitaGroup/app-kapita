export const dynamic = 'force-dynamic'
import {useTranslations} from 'next-intl'

const NotFound = () => {
  const t = useTranslations()

  return <h1>{t('page-not-found-message')}</h1>
}
export default NotFound
