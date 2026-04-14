import {defineRouting} from 'next-intl/routing'
import {createSharedPathnamesNavigation} from 'next-intl/navigation'
import EnglishFlagIcon from '@/icons/EnglishFlagIcon'
import SwedishFlagIcon from '@/icons/SwedishFlagIcon'

export const routing = defineRouting({
  locales: ['en', 'sv'],
  localePrefix: 'as-needed',
  defaultLocale: 'en'
})

export const languageIcons = {
  en: EnglishFlagIcon,
  sv: SwedishFlagIcon
}

export type LocaleType = (typeof routing.locales)[number]

export const {Link, redirect, usePathname, useRouter} = createSharedPathnamesNavigation(routing)
