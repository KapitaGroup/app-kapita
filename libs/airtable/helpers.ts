import {type LocaleType} from '@/i18n/routing'
import type {AirtableOpportunityType} from '@/utils/types'

export const formatMultipleIdGet = (ids?: string[]) =>
  `OR(${ids?.map(id => `RECORD_ID()='${id}'`).join(',')})`

export const getLocalizedLabel = (label: string, locale: LocaleType) =>
  `${label} - ${locale === 'en' ? 'English' : 'Svenska'}` as keyof AirtableOpportunityType
