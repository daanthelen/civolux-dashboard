import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import DashboardComponent from '@/components/dashboard/dashboard';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/login');
  }

  return (
    <DashboardComponent />
  )
}