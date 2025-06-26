'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/utils/auth/client-auth";
import { LogOut } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar"

export function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);

    try {
      await signOut();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SidebarMenuButton onClick={handleSignOut} disabled={loading} className="w-10 h-10 flex justify-center hover:bg-indigo-700 hover:text-white hover:cursor-pointer">
      <LogOut />
    </SidebarMenuButton>
  )
}