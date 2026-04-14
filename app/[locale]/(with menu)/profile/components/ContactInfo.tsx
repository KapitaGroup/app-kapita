'use client'
import {useLocale, useTranslations} from 'next-intl'
import Field from './Field'
import {useFormContext} from 'react-hook-form'
import Input from '@/components/form/Input'
import {type ProfileForm} from '../page'
import Dropdown from '@/components/form/Dropdown'
import {type LocaleType} from '@/i18n/routing'
import {countriesToOptions, countryList, countryListNordic} from '@/utils/countries'

const ContactInfo = () => {
  const t = useTranslations()
  const {watch, setValue} = useFormContext<ProfileForm>()
  const watches = watch()
  const currentLocale = useLocale() as LocaleType

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-4">
        <h1 className="text-h4">{t('ProfilePage.titles.contact-info')}</h1>
        <div className="flex flex-col gap-8 xl:grid xl:grid-cols-2">
          <Field label={t('email')} edit={<Input name="email" disabled />} readonlyValue={watches.email} />
          <Field
            label={t('phone')}
            edit={<Input name="phone" type="tel" onChange={() => setValue('errors', {})} />}
            readonlyValue={watches.phone}
          />
          <Field label={t('address')} edit={<Input name="address" />} readonlyValue={watches.address} />
          <Field label={t('postal')} edit={<Input name="postal" />} readonlyValue={watches.postal} />
          <Field label={t('city')} edit={<Input name="city" />} readonlyValue={watches.city} />
          <Field
            label={t('country')}
            edit={
              <Dropdown
                name="country"
                options={countriesToOptions(countryList, currentLocale)}
                startingOptions={countriesToOptions(countryListNordic, currentLocale)}
              />
            }
            readonlyValue={
              !!watches.country ? (currentLocale === 'en' ? watches.country : countryList.find(({en}) => en === watches.country)?.sv) : ''
            }
          />
        </div>
      </div>
    </div>
  )
}

export default ContactInfo
