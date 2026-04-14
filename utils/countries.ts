import {type LocaleType} from '@/i18n/routing'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import svLocale from 'i18n-iso-countries/langs/sv.json'
import {Option} from './types'

countries.registerLocale(enLocale)
countries.registerLocale(svLocale)

const enCountries = countries.getNames('en', {select: 'official'})
const svCountries = countries.getNames('sv', {select: 'official'})

export const countryList = Object.keys(enCountries).map(code => ({
  code,
  en: enCountries[code],
  sv: svCountries[code] || null
}))

export const countryListNordic = [
  {code: 'DK', en: 'Denmark', sv: 'Denmark'},
  {code: 'FI', en: 'Finland', sv: 'Finland'},
  {code: 'IS', en: 'Iceland', sv: 'Island'},
  {code: 'NO', en: 'Norway', sv: 'Norge'},
  {code: 'SV', en: 'Sweden', sv: 'Sverige'}
]

export const countriesToOptions = (countries: typeof countryList, locale: LocaleType): Option[] =>
  countries.map(country => ({
    key: country.en,
    label: country[locale] || undefined
  }))
