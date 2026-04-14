import type {OpportunityType} from '../utils/types'
import {useAuth} from './useAuth'
import {useQuery} from 'react-query'
import {useLocale} from 'next-intl'

export const useOpportunitiesList = () => {
  const [user, isAuthLoading] = useAuth()
  const locale = useLocale()

  const result = useQuery<OpportunityType[], Error>(
    ['opportunitiesList', user?.uid, locale],
    async () => {
      const response = await fetch(`/api/opportunities/list?locale=${locale}`)
      return await response.json()
    },
    {
      enabled: !isAuthLoading && !!user?.uid,
      refetchOnWindowFocus: false
    }
  )

  return {
    opportunities: result.data,
    isLoading: isAuthLoading || result.isLoading
  }
}
