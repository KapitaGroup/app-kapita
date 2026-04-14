import type {MutationOptionsType, ProfileType} from '@/utils/types'
import {useMutation} from 'react-query'

export const useProfileCreate = (options?: MutationOptionsType<Partial<ProfileType>>) =>
  useMutation(
    async (profile: Partial<ProfileType>) =>
      await fetch('/api/profile', {
        method: 'POST',
        body: JSON.stringify(profile)
      }),
    options
  )
