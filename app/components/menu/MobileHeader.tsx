'use client'
import MenuIcon from '@/icons/MenuIcon'
import Logo from '../Logo'

type Props = {
  setMenuOpen: (open: boolean) => void
}
const MobileHeader = ({setMenuOpen}: Props) => {
  return (
    <div className="fixed top-0 z-50 col-span-4 flex w-full items-center gap-x-[10px] bg-white py-2 opacity-95 xl:hidden">
      <MenuIcon onClick={() => setMenuOpen(true)} />
      <Logo />
    </div>
  )
}

export default MobileHeader
