export const RiskFactorList = ['Low', 'Medium', 'High'] as const
export const PrimaryInvestmentTargetList = ['Capital growth', 'Income generation', 'Capital preservation'] as const
export const InvestmentTypeList = ['Bonds', 'Convertible Note', 'Equity', 'Loan', 'Terms'] as const
export const InvesterTypeList = ['Private investor', 'Business angel', 'Professional', 'Family office', 'Institutional'] as const
export const PlacementHorizonList = ['less than 1 year', '1-2 years', '3-5 years', 'more than 5 years'] as const
export const PlacementTypeList = [
  'Convertible Note',
  'Publicly traded shares',
  'Private shares',
  'Loan',
  'SAFE',
  'Funds',
  'Commodities',
  'Futures',
  'Bonds',
  'Crypto'
] as const
export const InvestmentSectorList = [
  'AI and Machine Learning',
  'Beautytech',
  'Communication Software',
  'DeepTech',
  'Debt',
  'E-commerce',
  'Fintech',
  'Gaming',
  'Healthtech',
  'Life Science',
  'Logistics and Supply Chain',
  'Marketing Tech',
  'Private Equity',
  'Real Estate',
  'SaaS (Software as a Service)',
  'Technology',
  'Venture Capital'
] as const
export const InvestmentStrategyList = ['Value', 'Growth', 'Index', 'Dividend'] as const
export const PortfolioSizeList = [
  '0-3 million SEK',
  '3-5 million SEK',
  '5-10 million SEK',
  '10-20 million SEK',
  '20-50 million SEK',
  '50+ million SEK'
] as const
export const AverageInvestmentSizeList = [
  '< 100 000 SEK',
  '100 000 - 500 000 SEK',
  '500 000 - 1 000 000 SEK',
  '1-5 MSEK',
  '5-10 MSEK',
  '10+ MSEK'
] as const
export const RiskToleranceList = ['Low', 'Medium', 'High'] as const
export const NextInvestmentTimeframeList = ['0-3 months', '3-6 months', '6-12 months', '12+ months'] as const
export const InvestmentStageList = [
  'Pre-Seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C',
  'Series D+',
  'Initial Public Offering',
  'Acquisition',
  'Broad-Stage VC Portfolio',
  'Early Stage',
  'Early to Late Stage',
  'Growth Stage',
  'High-Growth Opportunities',
  'Lifecycle Investments',
  'Strategic Stage Investments'
] as const
export const InvestmentOverviewList = ['I have a good overview', "I don't have a complete overview"] as const

export const HubspotContactPropertyList = [
  'email',
  'phone',
  'firstname',
  'lastname',
  'personnummer',
  'address',
  'city',
  'zip',
  'country',
  'primary_investment_target',
  'investor_type',
  'placement_horizon',
  'placement_type',
  'investment_sectors',
  'investment_stages',
  'portfolio_size_aum',
  'average_investment_size',
  'risk_tolerance',
  'timeframe_for_the_next_investment',
  'investment_strategy',
  'your_current_investment_overview'
]
export const HubSpotSubscriptionIDs = [238798626, 329034489]
export const ProfileOnboardingStages = ['profile', 'needs-analysis'] as const//, 'know-your-customer'
