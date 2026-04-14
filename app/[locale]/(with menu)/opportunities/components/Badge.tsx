import {OpportunityStatusType} from '@/utils/types'

type Props = {
  code?: OpportunityStatusType
  label: string
  className?: string
}
const Badge = ({code, label, className = ''}: Props) => {
  let statusColor

  switch (code) {
    case 'Coming soon':
      statusColor = 'bg-accent-500'
      break
    case 'Finished':
      statusColor = 'bg-neutral-900'
      break
    default:
      statusColor = 'bg-primary-800'
  }

  return (
    <span
      className={`${className} flex items-center gap-x-1 rounded-xl border-[1px] border-neutral-400 bg-[rgba(255,255,255,0.5)] px-2 py-[6px]`}
    >
      {code && <span className={`size-[10px] rounded-full ${statusColor}`} />}
      {label}
    </span>
  )
}

export default Badge
