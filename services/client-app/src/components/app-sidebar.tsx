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
    url: '#',
    icon: SquareTerminal,
    isActive: false,
    items: [
      {
        title: 'New',
        url: '#',
      },
      {
        title: 'Popular',
        url: '#',
      },
      {
        title: 'Trending',
        url: '#',
      },
    ],
  },
  {
    title: 'Upload',
    url: '#',
    icon: Bot,
    items: [
      {
        title: 'Genesis',
        url: '#',
      },
      {
        title: 'Explorer',
        url: '#',
      },
      {
        title: 'Quantum',
        url: '#',
      },
    ],
  },
  {
    title: 'Assets',
    url: '#',
    icon: BookOpen,
    items: [
      {
        title: 'Introduction',
        url: '#',
      },
      {
        title: 'Get Started',
        url: '#',
      },
      {
        title: 'Tutorials',
        url: '#',
      },
      {
        title: 'Changelog',
        url: '#',
      },
    ],
  },
  {
    title: 'Followed',
    url: '#',
    icon: BookOpen,
    items: [],
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
