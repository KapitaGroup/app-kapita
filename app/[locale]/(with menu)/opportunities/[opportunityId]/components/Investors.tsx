import {OpportunityType} from '@/utils/types'
import {useTranslations} from 'next-intl'
import Image from 'next/image'

type Props = {
  investors: OpportunityType['investors']
}
const Investors = ({investors}: Props) => {
  const t = useTranslations('OpportunityPage')

  if (!investors || !investors.length) return null

  return (
    <div>
      <h1 className="pb-4 text-h4">{t('investors')}</h1>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 xl:gap-6">
        {investors.map(({name, image}) => (
          <Image
            key={name}
            src={image}
            alt={name}
            width={0}
            height={0}
            sizes="(max-width: 1280px) 50vw, 648px"
            className="w-full object-cover"
          />
        ))}
      </div>
    </div>
  )
}

export default Investors
