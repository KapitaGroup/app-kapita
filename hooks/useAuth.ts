import {auth} from '@/libs/firebase/config-client'
import {useAuthState} from 'react-firebase-hooks/auth'

export const useAuth = () => useAuthState(auth)
