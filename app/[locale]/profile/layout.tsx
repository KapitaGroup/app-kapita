import LanguageDropdown from '@/components/LanguageDropdown'
import Logo from '@/components/Logo'

const Layout = ({children}: Readonly<{children: React.ReactNode}>) => {
  return (
    <main className="mx-4 xl:mx-0">
      <div className="fixed top-0 z-10 flex w-[calc(100%-32px)] items-center justify-between bg-white pt-3 opacity-95 xl:left-12 xl:w-[calc(100%-96px)] xl:pt-12">
        <Logo size="md" url="https://www.kapita.com/" className="hidden xl:block" />
        <Logo url="https://www.kapita.com/" className="xl:hidden" />
        <LanguageDropdown />
      </div>
      {children}
    </main>
  )
}
export default Layout
