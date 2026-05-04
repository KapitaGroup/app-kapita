import '../globals.css'
import type {Metadata} from 'next'
import {NextIntlClientProvider} from 'next-intl'
import {getLocale, getMessages, unstable_setRequestLocale} from 'next-intl/server'
import {getTranslations} from 'next-intl/server'
import localFont from 'next/font/local'
import ReactQueryProvider from '@/providers/ReactQueryProvider'

const saansFont = localFont({
  src: [
    {path: '../../fonts/Saans-Regular.woff2', weight: '400', style: 'normal'},
    {path: '../../fonts/Saans-RegularItalic.woff2', weight: '400', style: 'italic'},
    {path: '../../fonts/Saans-Medium.woff2', weight: '500', style: 'normal'},
    {path: '../../fonts/Saans-Bold.woff2', weight: '700', style: 'normal'},
    {path: '../../fonts/Saans-BoldItalic.woff2', weight: '700', style: 'italic'}
  ],
  preload: true,
  display: 'swap',
  variable: '--font-saans'
})

export const generateMetadata = async ({params: {locale}}: {params: {locale: string}}): Promise<Metadata> => {
  const t = await getTranslations({locale, namespace: 'Metadata'})

  return {
    title: t('title'),
    description: t('description'),
    keywords: '',
    openGraph: {
      images: ['/images/og-kapita.png'],
      siteName: t('title')
    }
  }
}

const RootLayout = async ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  const locale = await getLocale()
  const messages = await getMessages()
  unstable_setRequestLocale(locale)

  return (
    <html lang={locale} className={`${saansFont.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
export default RootLayout
