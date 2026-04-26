import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '@/libs/firebase/config-client'
import {useEffect} from 'react'
import {usePathname, useRouter} from '@/i18n/routing'
import {useProfile} from './useProfile'
import {formsCompletedHubspot} from '@/services/hubspot'
import {hasCompletedProfile, hasNeedsAnalysisData} from '@/utils/profileCompletion'
import {readLocalOnboardingProgress} from '@/utils/onboardingProgress'

export const useUserProtection = () => {
  const [user, isUserLoading] = useAuthState(auth)
  const {profile, isLoading} = useProfile()
  const {push} = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading || isUserLoading) return

    if (['/profile/needs-analysis', '/profile/know-your-customer'].some(url => pathname.startsWith(url))) return

    if (!user?.uid) {
      push(`/login?redirect=${pathname}`)
      return
    }

    const profileFormsCompletedGuard = async () => {
      const formsStates = await formsCompletedHubspot(profile?.email)
      const localProgress = readLocalOnboardingProgress(user.uid)
      const profileCompleted = localProgress.profileCompleted || formsStates?.profileCompleted || hasCompletedProfile(profile)
      const needsAnalysisCompleted =
        localProgress.needsAnalysisCompleted || formsStates?.needsAnalysisCompleted || hasNeedsAnalysisData(profile)

      if (!profileCompleted) {
        push(`/profile/create`)
        return
      }
      if (!needsAnalysisCompleted) {
        push(`/profile/needs-analysis`)
        return
      }
      // if (!formsStates?.knowYourCustomerCompleted) {push(`/profile/know-your-customer`)return}
    }

    profileFormsCompletedGuard()
  }, [isUserLoading, isLoading, user?.uid, pathname, push, profile])

  return !isUserLoading && !isLoading && !!user?.uid
}
