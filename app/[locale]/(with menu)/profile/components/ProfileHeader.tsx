import {useTranslations} from 'next-intl'
import {useFormContext} from 'react-hook-form'
import {type ProfileForm} from '../page'
import {useProfileUpdate} from '@/hooks/useProfileUpdate'
import EditIcon from '@/icons/EditIcon'
import {isPersonNumberValid, isPhoneValid} from '@/utils/stringValidations'
import {useState} from 'react'
import {useQueryClient} from 'react-query'
import Button from '@/components/Button'

const ProfileHeader = () => {
  const t = useTranslations()
  const {watch, setValue} = useFormContext<ProfileForm>()
  const [isSaving, setIsSaving] = useState(false)
  const updateProfile = useProfileUpdate()
  const queryClient = useQueryClient()

  const onSave = async () => {
    const watches = watch()
    setIsSaving(true)
    setValue('errors', {})

    if (!!watches.phone && !isPhoneValid(watches.phone)) {
      setValue('errors', {phone: 'incorrect-phone-format'})
      setIsSaving(false)
      return
    }

    if (watches.investingFor === 'myself' && !!watches.personNumber && !isPersonNumberValid(watches.personNumber)) {
      setValue('errors', {personNumber: 'wrong-person-number-format'})
      setIsSaving(false)
      return
    }

    await updateProfile.mutateAsync(watches, {onSuccess: () => setIsSaving(false)})
    await queryClient.refetchQueries('profile')

    setValue('isEdit', false)
    setIsSaving(false)
  }

  return (
    <div className="flex flex-col gap-y-4 xl:flex-row xl:justify-between">
      <h1 className="text-h2">{t('Menu.nav.profile')}</h1>
      {watch('isEdit') ? (
        <Button text={t('done')} fluid={false} onClick={onSave} loading={isSaving} />
      ) : (
        <Button
          text={t('ProfilePage.edit-profile')}
          icon={<EditIcon />}
          fluid={false}
          variant="outlined"
          iconPosition="end"
          onClick={() => setValue('isEdit', true)}
        />
      )}
    </div>
  )
}

export default ProfileHeader
