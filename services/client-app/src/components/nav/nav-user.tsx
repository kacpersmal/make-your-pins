'use client'
import { ChevronsUpDown, LogOut, User } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import logo from '../../logo.svg'
import { useAuth } from '@/lib/auth-context'

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

export function NavUser() {
  const { currentUser, signOut } = useAuth()
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-colors"
            >
              <Avatar className="h-9 w-9 rounded-md border border-sidebar-border shadow-sm">
                <AvatarImage
                  src={!currentUser?.photoURL ? logo : currentUser.photoURL}
                  alt={currentUser?.displayName || 'User Avatar'}
                />
                <AvatarFallback className="rounded-md bg-sidebar-accent text-sidebar-accent-foreground">
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
              <ChevronsUpDown className="ml-auto size-4 opacity-70" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-60 rounded-lg border border-sidebar-border shadow-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 p-3 text-left">
                <Avatar className="h-10 w-10 rounded-md border border-sidebar-border shadow-sm">
                  <AvatarImage
                    src={!currentUser?.photoURL ? logo : currentUser.photoURL}
                    alt={currentUser?.displayName || 'User Avatar'}
                  />
                  <AvatarFallback className="rounded-md bg-sidebar-accent text-sidebar-accent-foreground">
                    {currentUser?.displayName?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-medium text-base">
                    {currentUser?.displayName || 'Guest User'}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {currentUser?.email || 'Sign in to access your account'}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {currentUser?.uid && (
                <DropdownMenuItem asChild className="focus:bg-sidebar-accent">
                  <Link
                    to="/profile/$userId"
                    params={{ userId: currentUser.uid }}
                    className="flex w-full items-center py-2"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={signOut}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
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
