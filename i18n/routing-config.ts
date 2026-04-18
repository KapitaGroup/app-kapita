import {defineRouting} from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'sv'],
  localePrefix: 'as-needed',
  defaultLocale: 'en'
})

export type LocaleType = (typeof routing.locales)[number]
