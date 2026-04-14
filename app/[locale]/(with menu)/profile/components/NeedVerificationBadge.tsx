import {useTranslations} from 'next-intl'

const NeedVerificationBadge = () => {
  const t = useTranslations('ProfilePage')
  return (
    <span
      className={`rounded-[5px] bg-accent-300 px-1 py-[3px] text-disclaimer`}
    >
      {t('need-verification')}
    </span>
  )
}

export default NeedVerificationBadge
