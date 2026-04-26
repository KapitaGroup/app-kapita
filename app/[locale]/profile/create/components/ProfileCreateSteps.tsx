'use client'
import {useLocale, useTranslations} from 'next-intl'
import Step from '../../components/Step'
import {type CreateProfileForm} from '../page'
import {useFormContext} from 'react-hook-form'
import {type LocaleType, useRouter} from '@/i18n/routing'
import {useState} from 'react'
import {countriesToOptions, countryList, countryListNordic} from '@/utils/countries'
import RadioField from '@/app/[locale]/(with menu)/profile/components/RadioField'
import {isPersonNumberValid, isPhoneValid} from '@/utils/stringValidations'
import Field from '@/app/[locale]/(with menu)/profile/components/Field'
import Input from '@/components/form/Input'
import Dropdown from '@/components/form/Dropdown'
import {onboardingUpdateProfile} from '@/services/profile'
import {getOrganizationInfo} from '@/libs/bolagsverket/client'
import {auth} from '@/libs/firebase/config-client'
import {saveLocalOnboardingProgress} from '@/utils/onboardingProgress'

type Props = {
  step: number
  onNextStep: () => void
}
const ProfileCreateSteps = ({step, onNextStep}: Props) => {
  const t = useTranslations()
  const {watch, setValue} = useFormContext<CreateProfileForm>()
  const watches = watch()
  const currentLocale = useLocale() as LocaleType
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const onIdentification = async () => {
    try {
      setSaving(true)

      if (watches.investingFor === 'company' && !!watches.organizationNumber) {
        const data = await getOrganizationInfo(watches.organizationNumber)        
        if (!!data) {
          setValue('organizationName', data.organisationsnamn?.organisationsnamnLista?.[0]?.namn)
          setValue('address', data.postadressOrganisation?.postadress?.utdelningsadress)
          setValue('postal', data.postadressOrganisation?.postadress?.postnummer)
          setValue('city', data.postadressOrganisation?.postadress?.postort)
          setValue('country', countryList.find(country => country.sv === data.registreringsland?.klartext)?.en)
        }
      }

      onNextStep()
    } catch (error) {
      console.error('Error while saving profile.', error)
    } finally {
      setSaving(false)
    }
  }

  const onSave = async () => {
    try {
      setSaving(true)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {isEdit, ...profile} = watches
      await onboardingUpdateProfile(profile)

      saveLocalOnboardingProgress(auth.currentUser?.uid, {profileCompleted: true})
      router.push('/profile/needs-analysis')
    } catch (error) {
      console.error('Error while saving profile.', error)
    } finally {
      setSaving(false)
    }
  }

  switch (step) {
    case 1:
      return (
        <Step number={1} onOk={onNextStep} titleCode={`profile-${step}`} okDisabled={!watches.investingFor}>
          <RadioField
            name="investingFor"
            translationCode="investing-for"
            label={t('attributes.investing-for.title')}
            options={['myself', 'company']}
          />
        </Step>
      )
    case 2:
      return watches.investingFor === 'myself' ? (
        <Step
          number={2}
          onOk={onIdentification}
          titleCode={`profile-${step}-myself`}
          separator={false}
          okDisabled={!isPersonNumberValid(watches.personNumber) || !isPhoneValid(watches.phone)}
        >
          <div className="flex flex-col gap-y-2">
            <Field key={2} label={t('personNumber')} edit={<Input name="personNumber" />} />
            <Field key={3} label={t('phone')} edit={<Input name="phone" />} />
          </div>
        </Step>
      ) : (
        <Step
          number={2}
          onOk={onIdentification}
          titleCode={`profile-${step}-company`}
          separator={false}
          okDisabled={!watches.organizationNumber || !watches.name || !isPhoneValid(watches.phone)}
        >
          <div className="flex flex-col gap-y-2">
            <Field
              key={5}
              label={t('organizationNumber')}
              edit={<Input name="organizationNumber" />}
              readonlyValue={watches.organizationNumber}
            />
            <Field key={6} label={t('your-name')} edit={<Input name="name" />} />
            <Field key={7} label={t('phone')} edit={<Input name="phone" />} />
          </div>
        </Step>
      )
    case 3:
      return (
        <Step
          number={3}
          onOk={onSave}
          titleCode={`profile-${step}`}
          separator={false}
          okDisabled={
            (watches.investingFor === 'myself' ? !watches.name : !watches.organizationName) ||
            !watches.address ||
            !watches.postal ||
            !watches.city ||
            !watches.country ||
            saving
          }
          loading={saving}
        >
          <div className="flex flex-col gap-y-2">
            {watches.investingFor === 'myself' ? (
              <Field key={1} label={t('your-name')} edit={<Input name="name" />} />
            ) : (
              <Field key={4} label={t('organizationName')} edit={<Input name="organizationName" />} />
            )}
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
        </Step>
      )
    default:
      return <p>This step is undefined!</p>
  }
}

export default ProfileCreateSteps
