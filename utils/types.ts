import {AuthErrorCodes} from 'firebase/auth'
import {UseMutationOptions} from 'react-query'
import {
  AverageInvestmentSizeList,
  InvestmentOverviewList,
  InvestmentSectorList,
  InvestmentStageList,
  InvestmentStrategyList,
  InvestmentTypeList,
  InvesterTypeList,
  NextInvestmentTimeframeList,
  PlacementHorizonList,
  PlacementTypeList,
  PortfolioSizeList,
  PrimaryInvestmentTargetList,
  RiskFactorList,
  RiskToleranceList,
  ProfileOnboardingStages
} from './lists'

export type RiskFactorType = (typeof RiskFactorList)[number]
export type PrimaryInvestmentTargetType = (typeof PrimaryInvestmentTargetList)[number]
export type InvestmentTypeType = (typeof InvestmentTypeList)[number]
export type InvesterTypeType = (typeof InvesterTypeList)[number]
export type PlacementHorizonType = (typeof PlacementHorizonList)[number]
export type PlacementTypeType = (typeof PlacementTypeList)[number]
export type InvestmentSectorType = (typeof InvestmentSectorList)[number]
export type InvestmentStrategyType = (typeof InvestmentStrategyList)[number]
export type PortfolioSizeType = (typeof PortfolioSizeList)[number]
export type AverageInvestmentSizeType = (typeof AverageInvestmentSizeList)[number]
export type RiskToleranceType = (typeof RiskToleranceList)[number]
export type NextInvestmentTimeframeType = (typeof NextInvestmentTimeframeList)[number]
export type InvestmentStageType = (typeof InvestmentStageList)[number]
export type InvestmentOverviewType = (typeof InvestmentOverviewList)[number]
export type GoogleAuthCodesType = (typeof AuthErrorCodes)[keyof typeof AuthErrorCodes]

export type ProfileOnboardingStagesType = (typeof ProfileOnboardingStages)[number]

export type ProfileType = {
  id?: string
  hubspotId?: string
  loginId: string
  image?: AirtableImageType[]
  progress: number
  wizardCompleted?: boolean
  profile?: boolean
  needsAnalysis?: boolean
  knowYourCustomer?: boolean
  name?: string
  personNumber?: string
  organizationName?: string
  organizationNumber?: string
  investingFor?: InvestingForType
  email: string
  emailVerified: boolean
  phone?: string
  phoneVerified: boolean
  address?: string
  postal?: string
  city?: string
  country?: string
  primaryInvestmentTarget?: PrimaryInvestmentTargetType
  investerType?: InvesterTypeType
  placementHorizon?: PlacementHorizonType[]
  placementType?: PlacementTypeType[]
  investmentSectors?: InvestmentSectorType[]
  investmentStrategy?: InvestmentStrategyType[]
  portfolioSize?: PortfolioSizeType
  averageInvestmentSize?: AverageInvestmentSizeType
  riskTolerance?: RiskToleranceType
  nextInvestmentTimeframe?: NextInvestmentTimeframeType
  investmentStages?: InvestmentStageType[]
  investmentOverview?: InvestmentOverviewType
}

export type SubscriptionType = {
  subscriptionId: number
  status: 'SUBSCRIBED' | 'UNSUBSCRIBED'
}

export type InvestingForType = 'myself' | 'company'

export type CurrencyType = 'SEK' | 'USD'

export type MutationOptionsType<T> = Omit<UseMutationOptions<Response, unknown, T, unknown>, 'mutationFn'>

export type OpportunityType = {
  id: string
  selected: boolean
  status: OpportunityStatusType
  image: string
  miniImage: string
  name: string
  company: string
  headquarters: string
  description: string
  investmentSector: InvestmentSectorType
  investmentType: InvestmentTypeType
  investmentStage: InvestmentStageType
  investmentTarget: number
  minInvestmentSize: number
  returnRate: number
  riskFactor: RiskFactorType
  memorandum: string
  verifiedLink: string
  sections: {
    heading?: string
    title1?: string
    description1?: string
    title2?: string
    description2?: string
    title3?: string
    description3?: string
    title4?: string
    description4?: string
  }[]
  investors: {
    name: string
    image: string
  }[]
}

export type AirtableOpportunityType = {
  Id: string
  Publish: boolean
  'Selected opportunity': boolean
  Status: OpportunityStatusType
  'Opportunity title - English': string
  'Opportunity title - Svenska': string
  'Cover image': AirtableImageType[]
  Sector: InvestmentSectorType
  'Company name': string
  'Head quarter location - English': string
  'Head quarter location - Svenska': string
  'Company description - English': string
  'Company description - Svenska': string
  'Investment type': InvestmentTypeType
  'Investment Stage': InvestmentStageType
  'Minimal Ticket Size': number
  'Investment target (SEK)': number
  'Internal rate of return (IRR)': number
  'Risk factor': RiskFactorType
  Memorandum: string
  'Verified link': string
  'Section 1 - Heading - English': string
  'Section 1 - Heading - Svenska': string
  'Section 1 - Title 1 - English': string
  'Section 1 - Title 1 - Svenska': string
  'Section 1 - Description 1 - English': string
  'Section 1 - Description 1 - Svenska': string
  'Section 1 - Title 2 - English': string
  'Section 1 - Title 2 - Svenska': string
  'Section 1 - Description 2 - English': string
  'Section 1 - Description 2 - Svenska': string
  'Section 1 - Title 3 - English': string
  'Section 1 - Title 3 - Svenska': string
  'Section 1 - Description 3 - English': string
  'Section 1 - Description 3 - Svenska': string
  'Section 1 - Title 4 - English': string
  'Section 1 - Title 4 - Svenska': string
  'Section 1 - Description 4 - English': string
  'Section 1 - Description 4 - Svenska': string

  'Section 2 - Heading - English': string
  'Section 2 - Heading - Svenska': string
  'Section 2 - Title 1 - English': string
  'Section 2 - Title 1 - Svenska': string
  'Section 2 - Description 1 - English': string
  'Section 2 - Description 1 - Svenska': string
  'Section 2 - Title 2 - English': string
  'Section 2 - Title 2 - Svenska': string
  'Section 2 - Description 2 - English': string
  'Section 2 - Description 2 - Svenska': string
  'Section 2 - Title 3 - English': string
  'Section 2 - Title 3 - Svenska': string
  'Section 2 - Description 3 - English': string
  'Section 2 - Description 3 - Svenska': string
  'Section 2 - Title 4 - English': string
  'Section 2 - Title 4 - Svenska': string
  'Section 2 - Description 4 - English': string
  'Section 2 - Description 4 - Svenska': string

  'Section 3 - Heading - English': string
  'Section 3 - Heading - Svenska': string
  'Section 3 - Title 1 - English': string
  'Section 3 - Title 1 - Svenska': string
  'Section 3 - Description 1 - English': string
  'Section 3 - Description 1 - Svenska': string
  'Section 3 - Title 2 - English': string
  'Section 3 - Title 2 - Svenska': string
  'Section 3 - Description 2 - English': string
  'Section 3 - Description 2 - Svenska': string
  'Section 3 - Title 3 - English': string
  'Section 3 - Title 3 - Svenska': string
  'Section 3 - Description 3 - English': string
  'Section 3 - Description 3 - Svenska': string
  'Section 3 - Title 4 - English': string
  'Section 3 - Title 4 - Svenska': string
  'Section 3 - Description 4 - English': string
  'Section 3 - Description 4 - Svenska': string

  'Section 4 - Heading - English': string
  'Section 4 - Heading - Svenska': string
  'Section 4 - Title 1 - English': string
  'Section 4 - Title 1 - Svenska': string
  'Section 4 - Description 1 - English': string
  'Section 4 - Description 1 - Svenska': string
  'Section 4 - Title 2 - English': string
  'Section 4 - Title 2 - Svenska': string
  'Section 4 - Description 2 - English': string
  'Section 4 - Description 2 - Svenska': string
  'Section 4 - Title 3 - English': string
  'Section 4 - Title 3 - Svenska': string
  'Section 4 - Description 3 - English': string
  'Section 4 - Description 3 - Svenska': string
  'Section 4 - Title 4 - English': string
  'Section 4 - Title 4 - Svenska': string
  'Section 4 - Description 4 - English': string
  'Section 4 - Description 4 - Svenska': string

  Investors: string[]
  'Name (from Investors)': string[]
  'Image (from Investors)': AirtableImageType[]
  'Created time': Date
}

export type OpportunityStatusType = 'Coming soon' | 'Ongoing' | 'Finished'

export type AirtableImageType = {
  id: string
  width: number
  height: number
  url: string
  filename: string
  size: number
  type: string
  thumbnails: {
    small: {
      url: string
      width: number
      height: number
    }
    large: {
      url: string
      width: number
      height: number
    }
    full: {
      url: string
      width: number
      height: number
    }
  }
}

export type AirtableVerificationsType = {
  Id: string
  Code: string
  Channel: 'email' | 'phone'
  'Valid until': string
}

export type ContactFormsCompletedType = {
  email: string
  profileCompleted: boolean
  needsAnalysisCompleted: boolean
  knowYourCustomerCompleted: boolean
}

export type Option = {key: string; label?: string}
