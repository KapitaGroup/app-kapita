'use client'
import {useTranslations} from 'next-intl'
import Button from '../Button'
import Progress from '../Progress'
import {useProfile} from '@/hooks/useProfile'

type Props = {
  closeMenu: () => void
}
const Todo = ({closeMenu}: Props) => {
  const t = useTranslations('Menu')
  const {profile, isLoading} = useProfile()

  if (isLoading || (!!profile && profile.progress >= 100)) return null

  return (
    <div className="flex flex-col gap-y-[10px] pt-6">
      <p className="text-h6">{t('todo')}</p>
      <Progress percentage={profile?.progress ?? 0} textLeft labelCode="profile" />
      <Button text={t('update-profile')} fluid url="/profile" onClick={closeMenu} />
    </div>
  )
}

export default Todo
