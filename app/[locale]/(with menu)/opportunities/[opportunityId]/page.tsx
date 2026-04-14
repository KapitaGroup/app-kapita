'use client'
import {useRouter} from '@/i18n/routing'
import ChevronIcon from '@/icons/ChevronIcon'
import {useTranslations} from 'next-intl'
import Image from 'next/image'
import {useParams} from 'next/navigation'
import Attributes from './components/Attributes'
import {useOpportunity} from '@/hooks/useOpportunity'
import PageLoading from '@/components/PageLoading'
import Investors from './components/Investors'
import Sections from './components/Sections'
import Badge from '../components/Badge'
import Buttons from './components/Buttons'

const Page = () => {
  const t = useTranslations()
  const params = useParams()
  const {back} = useRouter()
  const {opportunity, isLoading} = useOpportunity(params.opportunityId as string)

  if (isLoading) return <PageLoading />

  if (!opportunity) return <h1 className="text-h3 xl:text-h2">{t('OpportunityPage.missing-opportunity')}</h1>

  return (
    <div>
      <div className="flex items-center gap-x-[6px] pb-8 xl:gap-x-2">
        <ChevronIcon className="rotate-180 cursor-pointer" onClick={back} />
        <h1 className="text-h3 xl:pt-0 xl:text-h2">{opportunity.name}</h1>
      </div>
      <div className="flex flex-col gap-y-4 xl:gap-y-8">
        {!!opportunity.image && (
          <div className="relative aspect-video h-full w-full">
            <Image
              src={opportunity.image}
              alt={t('OpportunityPage.opportunity-image-alt', {
                name: opportunity.name
              })}
              priority
              width={0}
              height={0}
              sizes="(max-width: 1280px) 100vw, 55vw"
              className="absolute left-0 aspect-video w-full rounded-lg object-cover xl:static"
            />
            {opportunity.status && (
              <Badge
                code={opportunity.status}
                label={t(`OpportunityPage.status.${opportunity.status}`)}
                className="absolute left-3 top-3"
              />
            )}
          </div>
        )}
        <div className="flex flex-col gap-y-2">
          <h1 className="text-h3">{opportunity.company}</h1>
          <h2 className="text-description">{t('OpportunityPage.headquarters-in', {headquarters: opportunity.headquarters})}</h2>
          <p>{opportunity.description}</p>
        </div>
        <div className="flex flex-col gap-y-8">
          <Attributes {...opportunity} />
          <Buttons {...opportunity} />
          <Sections {...opportunity} />
          <Investors {...opportunity} />
        </div>
      </div>
    </div>
  )
}
export default Page
