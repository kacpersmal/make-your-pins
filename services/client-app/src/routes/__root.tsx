import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import '../globals.css'
// import Header from '../components/Header'
import { Toaster } from '@/components/ui/sonner'

// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
// import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <HeadContent />
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <main className="w-full">
          {/* <Header /> */}
          <SidebarTrigger />
          <div className="m-2 p-5 pb-0 min-h-[95%]">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
      <div className="fixed inset-0 -z-10 h-full w-full  bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_30%,#616E9A_100%)]"></div>
      <Toaster />
    </>
  ),
  head: () => ({
    meta: [
      {
        name: 'description',
        content: 'Assets Sharing Platform',
      },
      {
        title: 'Pins',
      },
    ],
  }),
})
