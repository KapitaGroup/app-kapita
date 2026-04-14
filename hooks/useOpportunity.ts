import type {OpportunityType} from '../utils/types'
import {useAuth} from './useAuth'
import {useQuery} from 'react-query'
import {useLocale} from 'next-intl'

export const useOpportunity = (opportunityId: string = '') => {
  const [user, isAuthLoading] = useAuth()
  const locale = useLocale()

  const result = useQuery<OpportunityType, Error>(
    ['opportunity', opportunityId, user?.uid, locale],
    async () => {
      const response = await fetch(`/api/opportunities/${opportunityId}?locale=${locale}`)
      return await response.json()
    },
    {
      enabled: !isAuthLoading && !!user?.uid && !!opportunityId,
      refetchOnWindowFocus: false
    }
  )

  return {
    opportunity: result.data,
    isLoading: isAuthLoading || result.isLoading
  }
}
