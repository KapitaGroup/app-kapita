import LanguageDropdown from '@/components/LanguageDropdown'
import Logo from '@/components/Logo'

const Layout = ({children}: Readonly<{children: React.ReactNode}>) => (
  <main className="min-h-screen bg-white">
    <div className="flex items-center justify-between px-4 pt-4 xl:px-12 xl:pt-8">
      <Logo size="md" url="https://www.kapita.com/" />
      <LanguageDropdown />
    </div>
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 py-12 xl:py-20">{children}</div>
  </main>
)

export default Layout
