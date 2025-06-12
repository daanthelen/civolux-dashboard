import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-8 max-w-screen-xl mx-auto">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}