import {useMutation} from 'react-query'

export const useProfileDelete = () =>
  useMutation(
    async () =>
      await fetch('/api/profile', {
        method: 'DELETE'
      })
  )
