type LocalOnboardingProgress = {
  profileCompleted?: boolean
  needsAnalysisCompleted?: boolean
}

const storageKey = (userId?: string | null) => (userId ? `kapita:onboarding-progress:${userId}` : null)

export const readLocalOnboardingProgress = (userId?: string | null): LocalOnboardingProgress => {
  const key = storageKey(userId)
  if (!key || typeof window === 'undefined') return {}

  try {
    return JSON.parse(window.localStorage.getItem(key) ?? '{}') as LocalOnboardingProgress
  } catch {
    return {}
  }
}

export const saveLocalOnboardingProgress = (userId: string | null | undefined, progress: LocalOnboardingProgress) => {
  const key = storageKey(userId)
  if (!key || typeof window === 'undefined') return

  const currentProgress = readLocalOnboardingProgress(userId)
  window.localStorage.setItem(key, JSON.stringify({...currentProgress, ...progress}))
}
