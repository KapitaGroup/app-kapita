export type OnboardingDraft = {
  firstName: string
  lastName: string
  personalNumber: string
  address: string
  postalCode: string
  city: string
  phone: string
  email: string
  investorType: 'private' | 'company' | ''
  experience: string
  focus: string
  typicalInvestment: string
  portfolioSize: string
  riskAccepted: boolean[]
  responsibilityAccepted: boolean[]
  termsAccepted: boolean
}

const STORAGE_KEY = 'kapita.onboarding.draft.v1'

export const emptyDraft: OnboardingDraft = {
  firstName: '',
  lastName: '',
  personalNumber: '',
  address: '',
  postalCode: '',
  city: '',
  phone: '',
  email: '',
  investorType: '',
  experience: '',
  focus: '',
  typicalInvestment: '',
  portfolioSize: '',
  riskAccepted: [false, false, false],
  responsibilityAccepted: [false, false],
  termsAccepted: false
}

export const readDraft = (): OnboardingDraft => {
  if (typeof window === 'undefined') return {...emptyDraft}
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return {...emptyDraft}
    return {...emptyDraft, ...(JSON.parse(raw) as Partial<OnboardingDraft>)}
  } catch {
    return {...emptyDraft}
  }
}

export const writeDraft = (draft: OnboardingDraft) => {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
  } catch {
    // ignore quota or serialization errors
  }
}

export const clearDraft = () => {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
