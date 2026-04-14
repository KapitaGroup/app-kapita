import AvatarIcon from '@/icons/AvatarIcon'
import EditIcon from '@/icons/EditIcon'
import {useTranslations} from 'next-intl'
import Image from 'next/image'
import {useFormContext} from 'react-hook-form'
import {type ProfileForm} from '../page'
import Input from '@/components/form/Input'

const MAX_FILE_SIZE = 4.5 * 1024 * 1024

const ProfileData = () => {
  const t = useTranslations()
  const {watch, setValue} = useFormContext<ProfileForm>()
  const watches = watch()

  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      alert(t('ProfilePage.errors.image-too-large', {size: MAX_FILE_SIZE / 1024 / 1024}))
      return
    }

    const formData = new FormData()
    formData.append('image', file)

    const reader = new FileReader()

    reader.readAsDataURL(file)
    reader.onload = () => setValue('imageToUpload', reader.result?.toString())
    reader.onerror = error => alert(error)
  }

  return (
    <div className="-mt-4 flex items-center gap-x-4 py-[6px]">
      <div className="relative min-w-[72px]">
        {!!watches.image || !!watches.imageToUpload ? (
          <Image
            alt="Profile image"
            src={watches.imageToUpload ?? watches.image?.[0]?.url ?? ''}
            width={72}
            height={72}
            className="h-[72px] w-[72px] rounded-full object-cover"
          />
        ) : (
          <AvatarIcon className="h-[72px] w-[72px]" />
        )}
        {watches.isEdit ? (
          <label htmlFor="image">
            <input type="file" id="image" hidden accept="image/*" multiple onChange={e => onImageUpload(e)} />
            <EditIcon className="absolute bottom-0 right-0 min-h-[28px] min-w-[28px] cursor-pointer rounded-[5px] bg-neutral-100 p-1" />
          </label>
        ) : null}
      </div>
      {watches.isEdit ? <Input className="text-h3" name="name" /> : <h1 className="text-h3">{watches.name}</h1>}
    </div>
  )
}

export default ProfileData
