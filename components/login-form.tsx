'use client';

import type React from 'react';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { signInWithEmail } from '@/utils/auth/client-auth';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await signInWithEmail(email, password);

      if (error) {
        setError(error.message);
      } else if (data.user) {
        router.push('/dashboard');
        router.refresh();
      }
    }
    catch (err) {
      setError('Something went wrong, please try again later.');
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert variant='destructive' className='mb-4'>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='email' className='block text-gray-700 font-semibold mb-1'>Email</Label>
          <Input
            id='email'
            type='email'
            placeholder='email@example.com'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className='w-full px-4 py-2 border rounded'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='password' className='block text-gray-700 font-semibold mb-1'>Password</Label>
          <Input
            id='password'
            type='password'
            placeholder='••••••••'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className='w-full px-4 py-2 border rounded'
          />
        </div>
        <Button type='submit' className='bg-[#41228E] w-full px-4 py-2 rounded font-semibold hover:bg-[#341b72] cursor-pointer' disabled={isLoading}>
          <Loader2Icon className={`animate-spin ${isLoading ? 'block' : 'hidden'}`} />
          {isLoading ? 'Logging in...' : 'Log in'}
        </Button>
      </form>
    </>
  )
}