import type {MutationOptionsType, ProfileType} from '@/utils/types'
import {useMutation} from 'react-query'

export const useProfileUpdate = (options?: MutationOptionsType<ProfileType>) =>
  useMutation(
    async (profile: ProfileType) =>
      await fetch('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(profile)
      }),
    options
  )
