import Progress from '@/components/Progress'
import {useTranslations} from 'next-intl'

type Props = {
  progress: number
}
const ProfileProgress = ({progress}: Props) => {
  const t = useTranslations('ProfilePage')

  return (
    <div className="flex flex-col gap-y-[10px]">
      <p className="mb-[10px]">{t('need-more-info-description')}</p>
      <Progress percentage={progress} labelCode='profile'/>
    </div>
  )
}

export default ProfileProgress
