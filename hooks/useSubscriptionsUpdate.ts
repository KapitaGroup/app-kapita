import type {MutationOptionsType, SubscriptionType} from '@/utils/types'
import {useMutation} from 'react-query'

export const useSubscriptionsUpdate = (options?: MutationOptionsType<Partial<SubscriptionType>>) =>
  useMutation(
    async (subscriptions: Partial<SubscriptionType>) =>
      await fetch('/api/profile/subscriptions', {
        method: 'PUT',
        body: JSON.stringify(subscriptions)
      }),
    options
  )
