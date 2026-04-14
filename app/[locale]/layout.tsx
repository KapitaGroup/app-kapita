import '../globals.css'
import type {Metadata} from 'next'
import {NextIntlClientProvider} from 'next-intl'
import {getLocale, getMessages, unstable_setRequestLocale} from 'next-intl/server'
import {getTranslations} from 'next-intl/server'
import localFont from 'next/font/local'
import ReactQueryProvider from '@/providers/ReactQueryProvider'

const lexendDecaFont = localFont({
  src: '../../fonts/LexendDeca-VariableFont_wght.ttf',
  preload: true,
  variable: '--font-lexend-deca'
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
    <html lang={locale} className={`${lexendDecaFont.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
export default RootLayout
