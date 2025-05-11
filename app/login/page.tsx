'use client';

import type React from 'react';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const [username, setUsername] = useState('');
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
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Log in</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant='destructive'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div>
              <Label htmlFor='username'>Gebruikersnaam</Label>
              <Input
                id='username'
                type='text'
                placeholder='Vul je gebruikersnaam in'
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor='password'>Wachtwoord</Label>
              <Input
                id='password'
                type='password'
                placeholder='Vul je wachtwoord in'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Inloggen...' : 'Log in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
