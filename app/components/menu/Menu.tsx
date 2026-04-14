'use client'
import Logo from '../Logo'
import Navigation from './Navigation'
import Buttons from './Buttons'
import Todo from './Todo'
import MobileHeader from './MobileHeader'
import {useState} from 'react'

export const selectedItemClasses = 'border-l-8 text-primary-800 text-h6 xl:pl-10 xl:-ml-12 pl-2 -ml-4'

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <MobileHeader setMenuOpen={setMenuOpen} />
      <div
        className={`fixed top-0 z-50 bg-black ${menuOpen ? 'left-0 opacity-25' : '-left-[100vw] opacity-0'} h-full w-full transition-opacity duration-500`}
        onClick={closeMenu}
      />
      <div
        className={`fixed left-0 z-50 bg-neutral-100 xl:flex ${menuOpen ? 'translate-x-0' : '-translate-x-[221px]'} top-0 col-span-2 flex h-full w-[221px] flex-col gap-y-4 py-12 pl-4 pr-[27px] transition-transform duration-300 xl:w-[250px] xl:translate-x-0 xl:gap-y-12 xl:pl-12 xl:pr-[24px]`}
      >
        <Logo size="md" />
        <div className="flex h-full flex-col justify-between">
          <Navigation closeMenu={closeMenu} />
          <Todo closeMenu={closeMenu} />
          <Buttons closeMenu={closeMenu} />
        </div>
      </div>
    </>
  )
}

export default Menu
