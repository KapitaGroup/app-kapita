import CheckmarkIcon from '@/icons/CheckmarkIcon'

type Props = {
  number: number
  label?: string
  selected?: boolean
  completed?: boolean
}
const Stage = ({number, label, selected, completed}: Props) => {
  return (
    <li className="flex items-center gap-x-[6px] xl:flex-col">
      <div
        className={`flex size-6 items-center justify-center rounded-full border-[2px] border-primary-800 ${selected ? 'bg-primary-800' : completed ? '!border-primary-900 bg-primary-900' : ''}`}
      >
        <span
          className={`text-center text-h6 ${selected ? 'text-neutral-100' : completed ? 'text-primary-100' : 'text-primary-800'} !leading-[0px]`}
        >
          {completed ? <CheckmarkIcon className="text-brand-100 size-4" /> : number}
        </span>
      </div>
      {!!label && <span className={`${selected ? 'text-h6' : 'text-button'} whitespace-nowrap`}>{label}</span>}
    </li>
  )
}

export default Stage
