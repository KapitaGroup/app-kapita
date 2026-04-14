type Props = {
  label: string
  selected?: boolean
  className?: string
  onClick?: () => void
}

const Badge = ({label, selected, className = '', onClick}: Props) => (
  <span
    className={`rounded-xl px-2 py-[6px] ring-1 ring-neutral-400 ${selected ? 'bg-primary-900 text-neutral-100 ring-0' : ''} ${className}`}
    onClick={onClick}
  >
    {label}
  </span>
)

export default Badge
