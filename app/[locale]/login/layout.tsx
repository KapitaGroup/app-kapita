'use client'
import {useTranslations, useLocale} from 'next-intl'
import Image from 'next/image'
import bgImage from '/public/images/onboarding_background.jpg'
import Logo from '@/components/Logo'
import Button from '@/components/Button'
import {useRouter, usePathname} from '@/i18n/routing'
import type {LocaleType} from '@/i18n/routing'

const Layout = ({children}: Readonly<{children: React.ReactNode}>) => {
  const t = useTranslations()
  const locale = useLocale() as LocaleType
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (next: LocaleType) => {
    if (next === locale) return
    router.replace(pathname, {locale: next})
  }

  return (
    <main className="flex h-screen w-full bg-white">
      <div className="flex h-full w-full flex-col xl:w-[58%]">
        <div className="flex items-center justify-between px-6 pt-6 xl:px-12 xl:pt-10">
          <Logo size="md" url="https://www.kapita.com/" />
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => switchLocale('sv')}
              className={`px-1 transition-colors ${locale === 'sv' ? 'font-medium text-neutral-900' : 'text-neutral-400 hover:text-neutral-700'}`}>
              SV
            </button>
            <span className="text-neutral-300">|</span>
            <button
              type="button"
              onClick={() => switchLocale('en')}
              className={`px-1 transition-colors ${locale === 'en' ? 'font-medium text-neutral-900' : 'text-neutral-400 hover:text-neutral-700'}`}>
              EN
            </button>
          </div>
        </div>

        <div className="flex flex-1 items-center overflow-y-auto px-6 py-10 xl:px-20">
          <div className="mx-auto flex w-full max-w-[400px] flex-col gap-8">{children}</div>
        </div>

        <div className="px-6 pb-6 xl:px-12 xl:pb-8">
          <p className="text-disclaimer text-neutral-500">{t('LoginPage.disclaimer')}</p>
          <div className="flex items-center gap-x-2">
            <Button text={t('terms-and-conditions')} variant="link" url="https://www.kapita.com/terms-and-conditions" fluid={false} />
            <span className="text-neutral-400">·</span>
            <Button text={t('privacy-policy')} variant="link" url="https://www.kapita.com/privacy-policy" fluid={false} />
          </div>
        </div>
      </div>

      <div className="relative hidden h-full xl:block xl:w-[42%]">
        <Image
          src={bgImage}
          alt={t('LoginPage.background-image-alt')}
          sizes="42vw"
          className="h-full w-full object-cover"
          priority
          placeholder="blur"
        />
        <div className="absolute bottom-10 right-10 text-right text-white [text-shadow:0px_1px_3px_rgba(0,0,0,0.25)]">
          <p className="text-h4">{t('Onboarding.shared.image-tagline-1')}</p>
          <p className="text-h4">{t('Onboarding.shared.image-tagline-2')}</p>
        </div>
      </div>
    </main>
  )
}
export default Layout
