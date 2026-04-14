'use client'
import Communication from './Communication'
import Integrity from './Integrity'
import Language from './Language'
import {LocaleType} from '@/i18n/routing'
import type {SubscriptionType} from '@/utils/types'

export type SettingsForm = {
  locale: LocaleType
  settings: SubscriptionType[]
}

const Section = () => {
  return (
    <form className="flex flex-col gap-8" onSubmit={e => e.preventDefault()}>
      <Communication />
      <Language />
      <Integrity />
    </form>
  )
}

export default Section
