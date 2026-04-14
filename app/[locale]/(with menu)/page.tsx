'use client'
import SelectedOpportunities from './opportunities/components/SelectedOpportunities'
import Opportunities from './opportunities/components/Opportunities'
import {useOpportunitiesList} from '@/hooks/useOpportunitiesList'
import PageLoading from '@/components/PageLoading'
import {useTranslations} from 'next-intl'

const Page = () => {
  const {opportunities, isLoading} = useOpportunitiesList()
  const t = useTranslations('OpportunitiesPage')

  if (isLoading) return <PageLoading />
  if (!opportunities || !opportunities.length) return <div>{t('no-data')}</div>

  return (
    <div className="flex flex-col gap-y-8">
      <SelectedOpportunities opportunities={opportunities.filter(opportunity => opportunity.selected)} />
      <Opportunities opportunities={opportunities.filter(opportunity => !opportunity.selected)} />
    </div>
  )
}

export default Page
