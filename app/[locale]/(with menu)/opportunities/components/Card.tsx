import Image from 'next/image'
import Badge from './Badge'
import {useTranslations} from 'next-intl'
import Button from '@/components/Button'
import Attribute from './Attribute'
import type {OpportunityType} from '@/utils/types'
import Link from 'next/link'

type Props = OpportunityType & {
  index: number
}

const Card = ({id, status, image, miniImage, name, company, investmentSector, investmentType, investmentStage, index}: Props) => {
  const t = useTranslations()

  return (
    <div className="flex flex-col pb-6 xl:flex-row xl:pb-0">
      {!!image && (
        <Link href={`/opportunities/${id}`} className="relative aspect-video h-full w-full xl:aspect-square">
          <Image
            src={image}
            alt={t('OpportunitiesPage.best-match-image-alt')}
            width={0}
            height={0}
            priority={index <= 1}
            sizes="(max-width: 1280px) 100vw, 27vw"
            className="h-full w-full rounded-lg object-cover"
            placeholder="blur"
            blurDataURL={miniImage}
          />
          {status && <Badge code={status} label={t(`OpportunityPage.status.${status}`)} className="absolute left-3 top-3" />}
        </Link>
      )}
      <div className={`flex flex-col gap-y-4 pt-3 xl:w-full xl:py-6 xl:pl-6`}>
        <div className="border-b-[1px] border-b-neutral-300 pb-2">
          <Link href={`/opportunities/${id}`}>
            <h1 className="pb-2 text-h4">{name}</h1>
          </Link>
          <p className="text-h5">{company}</p>
        </div>
        <div className="flex flex-col gap-y-2">
          <Attribute
            label={t('attributes.type.title')}
            value={!!investmentType ? t(`attributes.type.options.${investmentType}`) : ''}
            info="type"
          />
          <Attribute
            label={t('attributes.stage.title')}
            value={!!investmentStage ? t(`attributes.stage.options.${investmentStage}`) : ''}
            info="stage"
          />
          <Attribute label={t('attributes.sector.title')} value={investmentSector} info="sector" />
        </div>
        <Button text={t('read-more')} url={`/opportunities/${id}`} />
      </div>
    </div>
  )
}

export default Card
