'use client'
import ChevronIcon from '@/icons/ChevronIcon'
import {useState} from 'react'

type Props = {
  title?: string
  subtitle: string
  children: React.ReactNode
}
const Accordion = ({title, subtitle, children}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="border-b-[1px] border-black">
      <div className="flex cursor-pointer items-center justify-between pb-2" onClick={() => setIsOpen(prev => !prev)}>
        <div className="flex w-full flex-col gap-y-1">
          <div className="flex w-full justify-between">
            <h1 className="text-h4">{title}</h1>
            <span>{isOpen ? <ChevronIcon className="-rotate-90" /> : <ChevronIcon className="rotate-90" />}</span>
          </div>
          <h2
            className={`text-description ${isOpen ? 'max-h-0 opacity-0' : 'max-h-9 opacity-100'} transition-[opacity,max-height] duration-200`}
          >
            {subtitle}
          </h2>
        </div>
      </div>
      <div
        className={`transition-max-h overflow-hidden duration-500 ${isOpen ? 'max-h-screen ease-in' : 'max-h-0 ease-out'}`}
      >
        <div className="flex flex-col gap-y-4 pb-6">{children}</div>
      </div>
    </div>
  )
}

export default Accordion
