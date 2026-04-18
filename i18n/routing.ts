import {createSharedPathnamesNavigation} from 'next-intl/navigation'
import {routing} from './routing-config'

export {routing}
export type {LocaleType} from './routing-config'

export const {Link, redirect, usePathname, useRouter} = createSharedPathnamesNavigation(routing)
