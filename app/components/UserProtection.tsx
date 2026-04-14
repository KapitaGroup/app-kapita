'use client'
import {useUserProtection} from '@/hooks/useUserProtection'
import PageLoading from './PageLoading'

const UserProtection = ({children}: Readonly<{children: React.ReactNode}>) => {
  const isAuthorized = useUserProtection()

  if (isAuthorized) return children
  else return <PageLoading />
}

export default UserProtection
