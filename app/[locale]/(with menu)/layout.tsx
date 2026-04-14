import Menu from '@/components/menu/Menu'
import UserProtection from '@/components/UserProtection'

const Layout = ({children}: Readonly<{children: React.ReactNode}>) => {
  return (
    <div className="mx-4 my-[10px] grid-layout xl:mx-0 xl:my-12 max-content-width">
      <UserProtection>
        <Menu />
        <main className="col-span-4 xl:col-span-12 py-10 xl:py-0">{children}</main>
      </UserProtection>
    </div>
  )
}
export default Layout
