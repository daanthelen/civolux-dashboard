import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/login-form';

export default async function LoginPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  if (data?.user) {
    redirect('/dashboard');
  }

  return (
    <Card className='bg-white shadow-lg rounded-lg px-2 py-8 w-full max-w-md'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold text-[#41228E] text-center'>Log in</CardTitle>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter className='justify-center'>
        <p className="text-sm text-gray-600">
          Don’t have an account? <span><Link href='/signup' className='text-[#41228E] underline'>Sign up</Link></span>
        </p>
      </CardFooter>
    </Card>
  );
}
