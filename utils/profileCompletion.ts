import type {ProfileType} from './types'

export const hasCompletedProfile = (profile?: ProfileType) => (profile?.progress ?? 0) >= 100

export const hasNeedsAnalysisData = (profile?: ProfileType) =>
  !!profile?.investerType &&
  !!profile.primaryInvestmentTarget &&
  !!profile.placementHorizon?.length &&
  !!profile.placementType?.length &&
  !!profile.investmentSectors?.length &&
  !!profile.investmentStages?.length &&
  !!profile.portfolioSize &&
  !!profile.averageInvestmentSize &&
  !!profile.riskTolerance &&
  !!profile.nextInvestmentTimeframe &&
  !!profile.investmentStrategy?.length &&
  !!profile.investmentOverview
