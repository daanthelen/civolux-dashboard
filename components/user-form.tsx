'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { UserFormData, Role } from '@/objects/user';

interface UserFormProps {
  userId?: string;
  initialData?: Partial<UserFormData>;
}

export default function UserForm({ userId, initialData }: UserFormProps) {
  const [formData, setFormData] = useState<Partial<UserFormData>>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    role: 'user',
    active: true,
    ...initialData,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const isEditMode = !!userId;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const userData = await response.json();
        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: userData.username,
          email: userData.email,
          role: userData.role,
          active: userData.active,
        });
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('De gebruiker kon niet worden opgehaald');
      } finally {
        setLoading(false);
      }
    };

    if (isEditMode && !initialData) {
      fetchUser();
    }
  }, [userId, initialData, isEditMode]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { name: string; value: string | boolean }
  ) => {
    if ('target' in e) {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      // It's our custom object with name and value
      const { name, value } = e;
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const url = isEditMode ? `/api/users/${userId}` : '/api/users';
      const method = isEditMode ? 'PUT' : 'POST';

      const dataToSend = { ...formData };
      if (isEditMode && !dataToSend.password) {
        delete dataToSend.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Kon de gebruiker niet opslaan');
      }

      setSuccess(
        `De gebruiker is succesvol ${isEditMode ? 'bijgewerkt' : 'opgeslagen'}`
      );

      if (!isEditMode) {
        setFormData({
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          password: '',
          role: 'user',
          active: true,
        });
      }

      setTimeout(() => {
        router.push('/users');
      }, 3000);
    } catch (err) {
      console.error('Error saving user:', err);
      setError((err as Error).message || 'Kon de gebruiker niet opslaan');
    } finally {
      setLoading(false);
    }
  };

  const roles: Role[] = ['admin', 'user'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditMode ? 'Bewerk gebruiker' : 'Nieuwe gebruiker'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant='destructive' className='mb-4'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className='mb-4 border-green-500 bg-green-50'>
            <AlertDescription className='text-green-800'>
              {success}
            </AlertDescription>
          </Alert>
        )}

        {loading && !isEditMode ? (
          <div className='flex justify-center py-8'>
            <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='firstName'>Voornaam</Label>
                <Input
                  id='firstName'
                  name='firstName'
                  value={formData.firstName || ''}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lastName'>Achternaam</Label>
                <Input
                  id='lastName'
                  name='lastName'
                  value={formData.lastName || ''}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='username'>Gebruikersnaam</Label>
                <Input
                  id='username'
                  name='username'
                  value={formData.username || ''}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  value={formData.email || ''}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='password'>Wachtwoord</Label>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  value={formData.password || ''}
                  onChange={handleChange}
                  disabled={loading}
                  required={!isEditMode}
                />
              </div>
              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='role'>Rol</Label>
                  <Select
                    value={formData.role || 'user'}
                    onValueChange={value =>
                      handleChange({
                        name: 'role',
                        value,
                      })
                    }
                    disabled={loading}
                  >
                    <SelectTrigger className='hover:cursor-pointer'>
                      <SelectValue placeholder='Select rol'></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem
                          style={{ cursor: 'pointer' }}
                          key={role}
                          value={role}
                          className='capitalize'
                        >
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='active' className='mb-2'>
                  Ingeschakeld
                </Label>
                <Switch
                  className='hover:cursor-pointer'
                  id='active'
                  checked={formData.active || false}
                  onCheckedChange={checked =>
                    handleChange({
                      name: 'active',
                      value: checked,
                    })
                  }
                  disabled={loading}
                />
              </div>
              <div className='flex justify-end space-x-2 pt-4'>
                <Button
                  className='hover:cursor-pointer'
                  variant='outline'
                  type='button'
                  onClick={() => router.push('/users')}
                  disabled={loading}
                >
                  Annuleer
                </Button>
                <Button
                  className='hover:cursor-pointer'
                  type='submit'
                  disabled={loading}
                >
                  {loading
                    ? 'Opslaan...'
                    : isEditMode
                    ? 'Werk gebruiker bij'
                    : 'Sla gebruiker op'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
