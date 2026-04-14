import VerifiedIcon from '@/icons/VerifiedIcon'
import NeedVerificationBadge from './NeedVerificationBadge'
import ChatIcon from '@/icons/ChatIcon'
import Button from '@/components/Button'
import {useLocale, useTranslations} from 'next-intl'
import Input from '@/components/form/Input'
import EmailIcon from '@/icons/EmailIcon'
import toast, {Toaster} from 'react-hot-toast'

type Props = {
  name: 'email' | 'phone'
  value?: string
  verified: boolean
  isEdit: boolean
  verificationExpiresAt?: Date
}
const FieldWithVerification = ({name, value, verified, isEdit, verificationExpiresAt}: Props) => {
  const t = useTranslations()
  const locale = useLocale()

  const sendVerification = () => {
    toast.promise(fetch(`/api/profile/email/verify?locale=${locale}`, {method: 'POST'}), {
      loading: t('Emails.notifications.sending'),
      success: <b>{t('Emails.notifications.sent')}</b>,
      error: <b>{t('Emails.notifications.error')}</b>
    })
  }

  return (
    <div className="flex w-full flex-col gap-y-2">
      <div className="flex flex-col gap-y-1">
        <div className="flex gap-x-[6px]">
          <h1 className="text-description">{t(name)}</h1>
          {verified ? <VerifiedIcon className="text-primary-800" /> : <NeedVerificationBadge />}
        </div>
        {isEdit && (
          <p className="text-disclaimer">{t('ProfilePage.reverification-notification')}</p>
        )}
        {isEdit ? <Input name={name} /> : <p>{value}</p>}
      </div>
      {!isEdit &&
        !verified &&
        value &&
        ((!!verificationExpiresAt &&
          new Date(verificationExpiresAt) <=
            new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 - 5 * 60 * 1000)) ||
        !verificationExpiresAt ? (
          <Button
            text={t('ProfilePage.verify')}
            icon={name === 'email' ? <EmailIcon /> : <ChatIcon />}
            iconPosition="end"
            variant="outlined"
            fluid={false}
            onClick={sendVerification}
          />
        ) : (
          <p className="text-disclaimer">{t('ProfilePage.send-again-notification')}</p>
        ))}
      <Toaster position="bottom-center" />
    </div>
  )
}

export default FieldWithVerification
