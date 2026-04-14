'use client'
import Button from '@/components/Button'
import {useProfile} from '@/hooks/useProfile'
import EyeIcon from '@/icons/EyeIcon'
import PenIcon from '@/icons/PenIcon'
import {OpportunityType} from '@/utils/types'
import {useTranslations} from 'next-intl'

const Buttons = ({name, memorandum, verifiedLink}: OpportunityType) => {
  const t = useTranslations('')
  const {profile} = useProfile()

  const onContact = async () => {
    const result = await fetch('/api/tasks/memorandum', {
      method: 'POST',
      body: JSON.stringify({
        hubspotId: profile?.hubspotId,
        opportunityName: name,
        name: profile?.name,
        email: profile?.email,
        phone: profile?.phone,
        investingFor: profile?.investingFor,
        personNumber: profile?.personNumber,
        organizationNumber: profile?.organizationNumber,
        organizationName: profile?.organizationName
      })
    })

    if (!result.ok) {
      console.error(result.status)
      alert(t('Messages.error'))
    }
  }

  return (
    <div className="flex w-full flex-col gap-y-2 xl:flex-row xl:gap-x-8">
      {verifiedLink && (
        <Button text={t('OpportunityPage.verifiedLink')} url={verifiedLink} icon={<PenIcon />} iconPosition="end" target="_blank" />
      )}
      {memorandum && (
        <div onClick={onContact} className="w-full">
          <Button
            text={t('OpportunityPage.memorandum')}
            url={memorandum}
            icon={<EyeIcon />}
            iconPosition="end"
            variant="outlined"
            target="_blank"
          />
        </div>
      )}
    </div>
  )
}

export default Buttons
