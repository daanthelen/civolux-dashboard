'use client';

import type React from 'react';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setError('Test');
    setIsLoading(false);
  };

  return (
    <Card className='bg-white shadow-lg rounded-lg px-2 py-8 w-full max-w-md'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold text-[#41228E] text-center'>Log in</CardTitle>
      </CardHeader>
      <CardContent>
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
            {isLoading ? 'Inloggen...' : 'Log in'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className='justify-center'>
        <p className="text-sm text-gray-600">
          Don’t have an account? <span><Link href='/signup' className='text-[#41228E] underline'>Sign up</Link></span>
        </p>
      </CardFooter>
    </Card>
  );
}
