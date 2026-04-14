'use client'
import Button from '@/components/Button'
import {useAuth} from '@/hooks/useAuth'
import {useProfileDelete} from '@/hooks/useProfileDelete'
import {signOut} from '@/libs/firebase/auth'
import {deleteUser} from 'firebase/auth'
import {useTranslations} from 'next-intl'
import {useState} from 'react'

const Integrity = () => {
  const t = useTranslations()
  const profileDelete = useProfileDelete()
  const [confirmDeletion, setConfirmDeletion] = useState(false)
  const [user] = useAuth()
  const isNotOlderThan5Minutes =
    user?.metadata.lastSignInTime && new Date() < new Date(new Date(user?.metadata.lastSignInTime).getTime() + 5 * 60 * 1000)

  const deleteProfile = async () => {
    await profileDelete.mutateAsync()
    await deleteUser(user!)
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-h3">{t('SettingsPage.integrity.title')}</h1>
        <p>{t('SettingsPage.integrity.description')}</p>
      </div>
      <Button
        text={t('SettingsPage.integrity.delete-profile')}
        fluid={false}
        className="text-warning ring-warning"
        variant="outlined"
        onClick={() => setConfirmDeletion(prev => !prev)}
      />
      <div
        className={`fixed bottom-0 z-20 -ml-4 flex flex-col gap-y-4 rounded-t-lg border-[1px] border-neutral-300 bg-white p-4 transition-transform duration-300 xl:ml-[78px] xl:max-w-[512px] xl:gap-y-8 xl:p-12 ${confirmDeletion ? '' : 'translate-y-[400px]'}`}
      >
        {isNotOlderThan5Minutes ? (
          <>
            <div className="flex flex-col gap-y-[10px]">
              <h1 className="text-h3">{t('SettingsPage.integrity.pop-up.title')}</h1>
              <p>{t('SettingsPage.integrity.pop-up.description')}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <Button
                text={t('SettingsPage.integrity.pop-up.confirm')}
                variant="outlined"
                className="text-warning ring-warning"
                onClick={deleteProfile}
              />
              <Button text={t('SettingsPage.integrity.pop-up.cancel')} variant="link" onClick={() => setConfirmDeletion(false)} />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-y-[10px]">
              <h1 className="text-h3">{t('SettingsPage.integrity.reauth.title')}</h1>
              <p>{t('SettingsPage.integrity.reauth.description')}</p>
            </div>
            <Button text={t('logout')} variant="outlined" className="text-warning ring-warning" onClick={signOut} />
          </>
        )}
      </div>
    </div>
  )
}

export default Integrity
