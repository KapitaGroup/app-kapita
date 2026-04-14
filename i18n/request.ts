import {notFound} from 'next/navigation'
import {getRequestConfig} from 'next-intl/server'
import {type LocaleType, routing} from './routing'

export default getRequestConfig(async ({locale}) => {
  if (!routing.locales.includes(locale as LocaleType)) notFound()

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  }
})
