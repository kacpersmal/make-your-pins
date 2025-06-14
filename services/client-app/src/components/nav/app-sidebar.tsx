import { Grid, Image, LayoutGrid, Newspaper, Search } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { NavUser } from './nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useAuth } from '@/lib/auth-context'
import { CreateAssetButton } from '@/components/uploadProcess/create-asset-button'

// Main navigation items
const mainNavItems = [
  {
    title: 'Search',
    url: '/',
    icon: Search,
  },
  {
    title: 'Explore',
    url: '/explore',
    icon: Grid,
  },
  {
    title: 'Feed',
    url: '/feed',
    icon: Newspaper,
  },
]

// Asset management section
const assetNavItems = [
  {
    title: 'Saved Assets',
    url: '/saved-assets',
    icon: LayoutGrid,
  },
]

export function AppSidebar() {
  const auth = useAuth()
  const userId = auth.currentUser?.uid

  return (
    <>
      {auth.currentUser && (
        <Sidebar collapsible="icon" className="">
          <SidebarContent className="bg-transparent">
            {/* Main Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarMenu>
                {mainNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link
                        to={item.url}
                        className="flex items-center gap-2 w-full"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>

            {/* Assets Section */}
            <SidebarGroup>
              <SidebarGroupLabel>Assets</SidebarGroupLabel>
              <SidebarMenu>
                {/* Create Asset Button */}
                <SidebarMenuItem>
                  <CreateAssetButton />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="My Assets">
                    <Link
                      to="/profile/$userId"
                      params={{ userId: userId ?? '' }}
                      className="flex items-center gap-2 w-full"
                    >
                      <Image className="h-4 w-4" />
                      <span>My Assets</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* Asset Navigation Items */}
                {assetNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link
                        to={item.url}
                        className="flex items-center gap-2 w-full"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <NavUser auth={auth} />
          </SidebarFooter>
        </Sidebar>
      )}
    </>
  )
}
