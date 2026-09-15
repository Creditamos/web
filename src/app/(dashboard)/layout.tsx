import { Sidebar } from "@/components/Sidebar"
import { SidebarTrigger } from "@/components/SidebarPrimitives/sidebar-trigger"
import { AuthProvider } from "@/providers/auth.provider"
import { QueryProvider } from "@/providers/query.provider"

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <AuthProvider>
      <QueryProvider>
        <Sidebar>
          <div className="sticky top-0 z-20 flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background px-4 sm:px-6 lg:px-8">
            <SidebarTrigger />
            <span className="text-sm font-semibold tracking-tight lg:hidden">Creditamos</span>
          </div>
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </Sidebar>
      </QueryProvider>
    </AuthProvider>
  )
}
