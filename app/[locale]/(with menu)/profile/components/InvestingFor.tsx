'use client'
import {useFormContext} from 'react-hook-form'
import {type ProfileForm} from '../page'
import {useTranslations} from 'next-intl'
import Field from './Field'
import Input from '@/components/form/Input'
import {useEffect} from 'react'
import {getOrganizationInfo} from '@/libs/bolagsverket/client'
import {countryList} from '@/utils/countries'

const InvestingFor = () => {
  const t = useTranslations()
  const {
    watch,
    setValue,
    formState: {dirtyFields}
  } = useFormContext<ProfileForm>()
  const watches = watch()

  useEffect(() => {
    if (!dirtyFields.organizationNumber) return

    const fetchOrganizationData = async () => {
      const data = await getOrganizationInfo(watches.organizationNumber)
      if (!data) return

      setValue('organizationName', data.organisationsnamn?.organisationsnamnLista?.[0]?.namn)
      setValue('address', data.postadressOrganisation?.postadress?.utdelningsadress)
      setValue('postal', data.postadressOrganisation?.postadress?.postnummer)
      setValue('city', data.postadressOrganisation?.postadress?.postort)
      setValue('country', countryList.find(country => country.sv === data.registreringsland?.klartext)?.en)
    }
    fetchOrganizationData()
  }, [watches.organizationNumber, dirtyFields, setValue])

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="text-h4">{t('ProfilePage.investing-on-behalf.title')}</h1>
      <div className="text-button">
        <h1 className="pb-2 text-description">{t('ProfilePage.investing-on-behalf.subtitle')}</h1>
        {watches.isEdit ? (
          <div className="flex w-fit gap-x-4 rounded-[4px] p-1 ring-1 ring-neutral-300">
            <span
              onClick={() => setValue('investingFor', 'myself')}
              className={`${watches.investingFor === 'myself' ? 'bg-primary-800 text-neutral-100' : 'hover:bg-primary-900 hover:text-neutral-100'} w-[150px] cursor-pointer rounded-[4px] px-2 py-1 text-center`}
            >
              {t('ProfilePage.investing-on-behalf.myself')}
            </span>
            <span
              onClick={() => setValue('investingFor', 'company')}
              className={`${watches.investingFor === 'company' ? 'bg-primary-800 text-neutral-100' : 'hover:bg-primary-900 hover:text-neutral-100'} w-[150px] cursor-pointer rounded-[4px] px-2 py-1 text-center`}
            >
              {t('ProfilePage.investing-on-behalf.company')}
            </span>
          </div>
        ) : (
          <span className="my-1 ml-1 flex w-[150px] justify-center rounded-[4px] border-[1px] border-neutral-400 px-2 py-1">
            {watches.investingFor && t(`ProfilePage.investing-on-behalf.${watches.investingFor}`)}
          </span>
        )}
        <div className="flex flex-col gap-y-4 pt-4 xl:flex-row xl:gap-x-8">
          {watches.investingFor === 'myself' ? (
            <>
              <Field key={1} label={t('personNumber')} edit={<Input name="personNumber" />} readonlyValue={watches.personNumber} />
              <div className="hidden w-full xl:block" />
            </>
          ) : (
            <>
              <Field
                key={3}
                label={t('organizationNumber')}
                edit={<Input name="organizationNumber" />}
                readonlyValue={watches.organizationNumber}
              />
              <Field
                key={4}
                label={t('organizationName')}
                edit={<Input name="organizationName" />}
                readonlyValue={watches.organizationName}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default InvestingFor
