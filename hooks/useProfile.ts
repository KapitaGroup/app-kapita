import {signOut} from '@/libs/firebase/auth'
import type {ProfileType} from '../utils/types'
import {useAuth} from './useAuth'
import {useQuery} from 'react-query'

export const useProfile = () => {
  const [user, isAuthLoading] = useAuth()

  const result = useQuery<ProfileType, Error>(
    ['profile', user?.uid],
    async () => {
      const response = await fetch('/api/profile')

      const data = await response.json()
      if (data?.error === 'Please log in!') signOut()

      return data
    },
    {
      enabled: !isAuthLoading && !!user?.uid,
      refetchOnWindowFocus: false
    }
  )

  return {
    profile: result.data,
    isLoading: isAuthLoading || result.isLoading,
    refetch: result.refetch
  }
}
