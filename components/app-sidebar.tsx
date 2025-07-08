'use client';

import { 
  Sidebar, 
  SidebarContent ,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Separator } from "./ui/separator"
import { LayoutDashboard, UserRound, SquareStack, Group } from "lucide-react"
import { SignOutButton } from "./sign-out-button";
import { PiBulldozerBold } from "react-icons/pi";

const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Sloopprojecten',
    url: '/demolitions',
    icon: PiBulldozerBold,
  },
  {
    title: 'Twin Buildings',
    url: '/twin-buildings',
    icon: SquareStack,
  },
  {
    title: 'Clusters',
    url: '/clusters',
    icon: Group,
  },
]

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="none" className="flex flex-col w-64 text-indigo-200 h-screen">
      <SidebarHeader className="bg-[#41228E]">
        <SidebarMenu>
          <SidebarMenuItem className="p-2">
            <SidebarMenuButton asChild className="w-fit pt-5 pb-5 pl-3 pr-3 bg-transparent hover:bg-transparent">
              <Link href='/'>
                <span className="text-white text-2xl font-bold">Civolux</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-[#41228E]">
        <SidebarGroup>
          <Separator />
          <SidebarGroupContent className="flex flex-1 flex-col px-6 py-4">
            <SidebarMenu className="flex flex-col gap-y-4">
              {menuItems.map(item => (
                <SidebarMenuItem key={item.title} className="group flex items-center gap-x-3 rounded-md text-sm font-semibold">
                  <SidebarMenuButton asChild isActive={pathname === item.url}
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
        <SidebarMenuItem key='footer' className="group flex items-center rounded-md text-sm font-semibold">
          <SidebarMenuButton asChild className="w-full h-full p-3 justify-start flex-1 hover:bg-indigo-700 hover:text-white">
            <Link href='/profile'>
              <UserRound />
              <span>Profiel</span>
            </Link>
          </SidebarMenuButton>
          <Separator orientation="vertical" className="bg-white/50 mx-2" />
          <SignOutButton />
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  )
}