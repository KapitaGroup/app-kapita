import createMiddleware from 'next-intl/middleware'
import {routing} from './i18n/routing-config'

export default createMiddleware(routing)

export const config = {
  matcher: ['/', '/(sv|en)/:path*', '/((?!_next|_vercel|api|.*\\..*).*)']
}
