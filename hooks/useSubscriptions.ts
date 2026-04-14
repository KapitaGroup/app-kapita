import type {SubscriptionType} from '../utils/types'
import {useAuth} from './useAuth'
import {useQuery} from 'react-query'

export const useSubscriptions = () => {
  const [user, isAuthLoading] = useAuth()

  const result = useQuery<SubscriptionType[], Error>(
    ['subscriptions', user?.uid],
    async () => {
      const response = await fetch('/api/profile/subscriptions')
      return await response.json()
    },
    {
      enabled: !isAuthLoading && !!user?.uid,
      refetchOnWindowFocus: false
    }
  )

  return {
    subscriptions: result.data,
    isLoading: isAuthLoading || result.isLoading
  }
}
