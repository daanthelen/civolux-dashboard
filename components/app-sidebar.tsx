'use client';

import { 
  Sidebar, 
  SidebarContent ,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Separator } from "./ui/separator"
import { House, Calendar, LayoutDashboard, Settings, UserRound } from "lucide-react"

const menuItems = [
  {
    title: 'Home',
    url: '/',
    icon: House,
  },
  {
    title: 'Sloopkalender',
    url: '/calendar',
    icon: Calendar,
  },
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Instellingen',
    url: '/settings',
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="flex flex-col w-64 text-indigo-200 overflow-y-auto">
      <SidebarContent className="bg-[#41228E]">
        <SidebarGroup>
          <SidebarGroupLabel className="flex h-16 shrink-0 items-center px-6 border-b border-indigo-500">
            <span className="text-white text-2xl font-bold">Civolux</span>
          </SidebarGroupLabel>
          <Separator />
          <SidebarGroupContent className="flex flex-1 flex-col px-6 py-4">
            <SidebarMenu className="flex flex-col gap-y-4">
              {menuItems.map(item => (
                <SidebarMenuItem key={item.title} className="group flex items-center gap-x-3 rounded-md text-sm font-semibold">
                  <SidebarMenuButton asChild isActive={pathname.slice(1).toLowerCase() === item.title.toLowerCase()}
                    className="w-full h-full p-3 hover:bg-indigo-700 hover:text-white">
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-[#41228E] px-[32] py-4">
        <SidebarMenu className="flex flex-col gap-y-4">
          <SidebarMenuItem key='profile' className="group flex items-center gap-x-3 rounded-md text-sm font-semibold">
            <SidebarMenuButton asChild className="w-full h-full p-3 hover:bg-indigo-700 hover:text-white">
              <Link href='/profile'>
                <UserRound />
                <span>Profiel</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}