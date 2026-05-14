import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/header'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <Sidebar />
      {/* ml-[240px] matches the fixed sidebar width */}
      <div className="ml-[240px] flex flex-1 flex-col overflow-hidden min-h-screen">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
