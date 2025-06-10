'use client'
import {
  Bell,
  ChevronsUpDown,
  LogOut,
  Settings,
  User,
  UserCircle2,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import logo from '../../logo.svg'
import type { AuthContextType } from '@/lib/auth-context'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'

export function NavUser({ auth }: { auth: AuthContextType }) {
  const { currentUser, signOut } = auth
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="group data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-all hover:bg-sidebar-accent/50"
            >
              <Avatar className="h-9 w-9 rounded-md border border-sidebar-border shadow-md transition-transform group-hover:scale-105 overflow-hidden">
                <AvatarImage
                  src={!currentUser?.photoURL ? logo : currentUser.photoURL}
                  alt={currentUser?.displayName || 'User Avatar'}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-md bg-gradient-to-br from-sidebar-accent to-sidebar-accent-foreground/30 text-sidebar-accent-foreground font-semibold">
                  {currentUser?.displayName?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {currentUser?.displayName || 'Guest User'}
                </span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  {currentUser?.email || 'Sign in to access your account'}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 opacity-70 transition-transform group-data-[state=open]:rotate-180" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-60 rounded-lg border border-sidebar-border shadow-lg bg-sidebar"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={8}
            alignOffset={-5}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 p-3 text-left bg-sidebar-accent/40 rounded-t-md">
                <Avatar className="h-12 w-12 rounded-md border border-sidebar-border shadow-md ring-2 ring-sidebar-accent-foreground/10">
                  <AvatarImage
                    src={!currentUser?.photoURL ? logo : currentUser.photoURL}
                    alt={currentUser?.displayName || 'User Avatar'}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-md bg-gradient-to-br from-sidebar-accent to-sidebar-accent-foreground/30 text-sidebar-accent-foreground font-semibold">
                    {currentUser?.displayName?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium text-base">
                      {currentUser?.displayName || 'Guest User'}
                    </span>
                    {currentUser?.uid && (
                      <Badge
                        variant="outline"
                        className="h-5 text-xs font-normal"
                      >
                        Active
                      </Badge>
                    )}
                  </div>
                  <span className="truncate text-xs text-muted-foreground">
                    {currentUser?.email || 'Sign in to access your account'}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {currentUser?.uid && (
                <>
                  <DropdownMenuItem
                    asChild
                    className="focus:bg-sidebar-accent hover:bg-sidebar-accent/50"
                  >
                    <Link
                      to="/profile/$userId"
                      params={{ userId: currentUser.uid }}
                      className="flex w-full items-center py-2"
                    >
                      <UserCircle2 className="mr-2 h-4 w-4" />
                      View Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-sidebar-accent hover:bg-sidebar-accent/50">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-sidebar-accent hover:bg-sidebar-accent/50">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={signOut}
              className="text-destructive focus:bg-destructive/10 hover:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
