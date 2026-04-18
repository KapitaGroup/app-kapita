'use client'
import {useTranslations, useLocale} from 'next-intl'
import Button from '@/components/Button'
import Image from 'next/image'
import bgImage from '/public/images/login_background.png'
import VerifiedIcon from '@/icons/VerifiedIcon'
import {useRouter, usePathname} from '@/i18n/routing'
import EnglishFlagIcon from '@/icons/EnglishFlagIcon'
import SwedishFlagIcon from '@/icons/SwedishFlagIcon'
import type {LocaleType} from '@/i18n/routing'

const Layout = ({children}: Readonly<{children: React.ReactNode}>) => {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: LocaleType) => {
    router.replace(pathname, {locale: newLocale})
  }

  return (
    <div className="flex h-screen w-full">
      <div className="col-span-4 flex h-full w-full flex-col justify-between bg-white p-4 max-content-width xl:col-span-8 xl:col-start-3 xl:p-12">
        <div className="flex flex-col gap-8">
          <div className="flex justify-end gap-2">
            <button
              onClick={() => switchLocale('en')}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors ${locale === 'en' ? 'bg-neutral-100 font-medium' : 'text-neutral-400 hover:text-neutral-700'}`}>
              <EnglishFlagIcon className="h-4 w-4" />
              EN
            </button>
            <button
              onClick={() => switchLocale('sv')}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors ${locale === 'sv' ? 'bg-neutral-100 font-medium' : 'text-neutral-400 hover:text-neutral-700'}`}>
              <SwedishFlagIcon className="h-4 w-4" />
              SV
            </button>
          </div>
          {children}
        </div>
        <div>
          <p className="text-disclaimer">{t('LoginPage.disclaimer')}</p>
          <div className="flex items-center gap-x-2">
            <Button text={t('terms-and-conditions')} variant="link" url="https://www.kapita.com/terms-and-conditions" fluid={false} />
            <span>·</span>
            <Button text={t('privacy-policy')} variant="link" url="https://www.kapita.com/privacy-policy" fluid={false} />
          </div>
        </div>
      </div>
      <div className="hidden h-full w-full xl:relative xl:block">
        <Image
          src={bgImage}
          alt={t('LoginPage.background-image-alt')}
          sizes="100vw"
          className="h-full w-full object-cover"
          priority
          placeholder="blur"
        />
        <div className="absolute top-0 flex h-full w-[424px] flex-col justify-center gap-y-8 px-8 text-white [text-shadow:0px_1px_3px_rgba(0,0,0,0.15)]">
          <h1 className="!leading-[27px] text-h4 [text-shadow:0px_1px_2px_rgba(0,0,0,0.3)]">{t('LoginPage.info.description')}</h1>
          <div className="flex flex-col gap-y-3 text-h6 [text-shadow:0px_1px_2px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-x-2">
              <VerifiedIcon className="min-h-8 min-w-8" />
              <p>{t('LoginPage.info.benefits.exclusive-access')}</p>
            </div>
            <div className="flex items-center gap-x-2">
              <VerifiedIcon className="min-h-8 min-w-8" />
              <p>{t('LoginPage.info.benefits.lower-investments')}</p>
            </div>
            <div className="flex items-center gap-x-2">
              <VerifiedIcon className="min-h-8 min-w-8" />
              <p>{t('LoginPage.info.benefits.rigorous-manager')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Layout
