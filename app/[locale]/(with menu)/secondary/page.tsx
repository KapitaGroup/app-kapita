'use client'
import Button from '@/components/Button'
import {useTranslations} from 'next-intl'
import {useState} from 'react'
import Badge from '../profile/components/Badge'
import CheckmarkIcon from '@/icons/CheckmarkIcon'
import {useProfile} from '@/hooks/useProfile'

const Page = () => {
  const t = useTranslations('')
  const {profile} = useProfile()
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [buy, setBuy] = useState(true)
  const [sell, setSell] = useState(false)

  const onInterest = async () => {
    setSending(true)

    const result = await fetch('/api/tasks/interest', {
      method: 'POST',
      body: JSON.stringify({
        hubspotId: profile?.hubspotId,
        name: profile?.name,
        email: profile?.email,
        phone: profile?.phone,
        investingFor: profile?.investingFor,
        personNumber: profile?.personNumber,
        organizationNumber: profile?.organizationNumber,
        organizationName: profile?.organizationName,
        buy,
        sell
      })
    })

    setSending(false)

    if (!result.ok) {
      console.error(result.status)
      alert(t('Messages.error'))
    }

    setSent(true)
  }

  return (
    <div className="grid gap-y-8">
      <div className="grid gap-y-6">
        <h1 className="text-h2">{t('SecondaryPage.title')}</h1>
        <p className="whitespace-pre-line text-body">{t('SecondaryPage.description')}</p>
      </div>
      <div className="grid gap-y-1">
        <div className="grid gap-y-2">
          {!sent && (
            <>
              <h1 className="text-h4">{t('SecondaryPage.question')}</h1>
              <span className="text-description">{t('choose-one-or-more')}</span>
              <div className="flex gap-x-[6px]">
                <Badge
                  label={t('buy')}
                  selected={buy}
                  onClick={() => (sending || sent ? null : setBuy(prev => !prev))}
                  aria-pressed={buy}
                  className={sending || sent ? '' : 'cursor-pointer'}
                />
                <Badge
                  label={t('sell')}
                  selected={sell}
                  onClick={() => (sending || sent ? null : setSell(prev => !prev))}
                  aria-pressed={sell}
                  className={sending || sent ? '' : 'cursor-pointer'}
                />
              </div>
            </>
          )}
          <hr className="text-neutral-300" />
          <Button
            text={sent ? t('interest-sent') : t('register-interest')}
            fluid={false}
            loading={sending}
            disabled={sent || (!buy && !sell)}
            onClick={onInterest}
            icon={sent ? <CheckmarkIcon /> : undefined}
            iconPosition="end"
          />
        </div>
        {!buy && !sell && <span className="text-description">{t('SecondaryPage.no-options-selected')}</span>}
        {sent && <span className="text-description">{t('SecondaryPage.interest-confirmation')}</span>}
      </div>
    </div>
  )
}

export default Page
