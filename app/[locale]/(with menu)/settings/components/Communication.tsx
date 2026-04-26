import {useTranslations} from 'next-intl'
import {useSubscriptionsUpdate} from '@/hooks/useSubscriptionsUpdate'
import {Toaster} from 'react-hot-toast'
import {useSubscriptions} from '@/hooks/useSubscriptions'
import CheckboxCheckedIcon from '@/icons/CheckboxCheckedIcon'
import CheckboxUncheckedIcon from '@/icons/CheckboxUncheckedIcon'
import Button from '@/components/Button'
import {HubSpotSubscriptionIDs} from '@/utils/lists'
import type {SubscriptionType} from '@/utils/types'
import {useState} from 'react'
import {useQueryClient} from 'react-query'
import {useAuth} from '@/hooks/useAuth'

const Communication = () => {
  const t = useTranslations()
  const [user] = useAuth()
  const {isLoading, subscriptions} = useSubscriptions()
  const [savingSubs, setSavingSubs] = useState<number[]>([])
  const subscriptionsUpdate = useSubscriptionsUpdate()
  const queryClient = useQueryClient()
  const subscriptionList = Array.isArray(subscriptions) ? subscriptions : []

  const onSubscriptionChange = (subs: SubscriptionType[], unsubscribe?: boolean) => {
    subs.map(sub => setSavingSubs(prev => [...prev, sub.subscriptionId]))

    const promises = subs.map(async currentSub => {
      const invertedStatus = unsubscribe || currentSub.status === 'SUBSCRIBED' ? 'UNSUBSCRIBED' : 'SUBSCRIBED'
      const invertedSub = {
        subscriptionId: currentSub.subscriptionId,
        status: invertedStatus
      } as SubscriptionType

      if (currentSub.status !== invertedStatus)
        try {
          await subscriptionsUpdate.mutateAsync(invertedSub)
        } catch (error) {
          console.error('Mutation failed for:', currentSub.subscriptionId, error)
          return currentSub
        }

      setSavingSubs(prev => prev.filter(savingSub => savingSub !== currentSub.subscriptionId))
      return invertedSub
    })

    Promise.all(promises)
      .then(data =>
        queryClient.setQueryData(['subscriptions', user?.uid], (oldData?: SubscriptionType[]) =>
          oldData?.length === HubSpotSubscriptionIDs.length
            ? oldData?.map(sub => data.find(data => data.subscriptionId === sub.subscriptionId) ?? sub)
            : HubSpotSubscriptionIDs.map(
                subscriptionId =>
                  data.find(data => data.subscriptionId === subscriptionId) ??
                  ({subscriptionId, status: 'UNSUBSCRIBED'} as SubscriptionType)
              )
        )
      )
      .catch(err => console.error('Error in Promise.all:', err))
  }

  return (
    <div className="flex flex-col gap-y-6">
      <div>
        <h1 className="pb-1 text-h3">{t('SettingsPage.communication.title')}</h1>
        <p>{t('SettingsPage.communication.description')}</p>
      </div>
      {isLoading ? (
        <div className="my-[6px] h-8 w-full animate-pulse rounded bg-neutral-400" />
      ) : (
        <div className="flex flex-col items-end pr-6">
          {HubSpotSubscriptionIDs?.map(subscriptionId => {
            const sub = subscriptionList.find(sub => sub.subscriptionId === subscriptionId)
            const disabled = savingSubs.includes(subscriptionId)

            return (
              <div
                key={subscriptionId}
                className={`mb-2 flex w-full ${disabled ? 'cursor-progress text-disabled' : 'cursor-pointer'} items-center justify-between py-2`}
                onClick={() => !disabled && onSubscriptionChange(!!sub ? [sub] : [{subscriptionId, status: 'UNSUBSCRIBED'}])}
              >
                <p>{t(`SettingsPage.communication.subscriptions.${subscriptionId}`)}</p>
                <div className="flex items-center gap-x-2">
                  <div className="flex cursor-pointer select-none flex-col gap-[8px]">
                    <div className={'flex items-center gap-[4px]'}>
                      {sub?.status === 'SUBSCRIBED' ? (
                        <CheckboxCheckedIcon className={disabled ? 'text-disabled' : 'text-primary-800'} />
                      ) : (
                        <CheckboxUncheckedIcon className={disabled ? 'text-disabled' : 'text-primary-800'} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          <Button
            text={t('SettingsPage.communication.subscriptions.unsubscribe-all')}
            variant="link"
            fluid={false}
            disabled={!!savingSubs.length}
            onClick={() => onSubscriptionChange(subscriptionList, true)}
          />
        </div>
      )}
      <Toaster position="bottom-center" />
    </div>
  )
}

export default Communication
