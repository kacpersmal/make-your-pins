import {
  BookOpen,
  Bot,
  SquareTerminal,
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
} from 'lucide-react'
import { NavUser } from './nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { NavMain } from './nav-main'
// Menu items.
const items = [
  {
    title: 'Home',
    url: '#',
    icon: Home,
  },
  {
    title: 'Inbox',
    url: '#',
    icon: Inbox,
  },
  {
    title: 'Calendar',
    url: '#',
    icon: Calendar,
  },
  {
    title: 'Search',
    url: '#',
    icon: Search,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
  },
]
const navMain = [
  {
    title: 'Feed',
    url: '/app',
    icon: SquareTerminal,
    isActive: false,
    items: [
      {
        title: 'New',
        url: '/app',
      },
      {
        title: 'Popular',
        url: '/app',
      },
      {
        title: 'Trending',
        url: '/app',
      },
    ],
  },
 
  {
    title: 'Assets',
    url: '#',
    icon: BookOpen,
    items: [
      {
        title: 'Upload',
        url: '/demo/upload',
      },
      {
        title: 'Your Assets',
        url: '#',
      },
      
    ],
  },
  {
    title: 'Followed',
    url: '#',
    icon: BookOpen,
    items: [
      {
        title: 'Store',
        url: '/demo/store',
      },
     
    ],
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="">
      <SidebarContent className="bg-transparent test">
        <NavMain items={navMain} />
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: '', email: '', avatar: 'null' }} />
      </SidebarFooter>
    </Sidebar>
  )
}
