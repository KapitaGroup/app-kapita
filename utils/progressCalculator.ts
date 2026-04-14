import type {ProfileType} from './types'

export const calculateProgress = (profile?: Partial<ProfileType>) => {
  if (!profile) return 0

  const fields = [
    'name',
    'email',
    'phone',
    'address',
    'postal',
    'city',
    'country',
    'primaryInvestmentTarget',
    'investerType',
    'placementHorizon',
    'placementType',
    'investmentSectors',
    'investmentStrategy',
    'portfolioSize',
    'averageInvestmentSize',
    'riskTolerance',
    'nextInvestmentTimeframe',
    'investmentStages',
    'investmentOverview'
  ] as const

  const filledFields = fields.filter(field =>
    Array.isArray(profile[field as keyof typeof profile])
      ? !!(profile[field as keyof typeof profile] as string[]).length
      : !!profile[field as keyof typeof profile]
  ).length

  let conditionalFields = 0
  let conditionalFieldsLength = 0
  if (profile.investingFor === 'company') {
    if (!!profile.organizationNumber) conditionalFields++
    if (!!profile.organizationName) conditionalFields++

    conditionalFieldsLength = 2
  } else {
    if (!!profile.personNumber) conditionalFields++
    conditionalFieldsLength = 1
  }

  return Math.round(((filledFields + conditionalFields) / (fields.length + conditionalFieldsLength)) * 100)
}
