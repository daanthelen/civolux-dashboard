'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserListItem } from '@/objects/user';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('De gebruiker kon niet verwijderd worden');
    }
  };

  return (
    <div className='flex flex-1'>
      <main className='flex-1 overflow-auto p-4 md:p-6'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Gebruikers</h1>
          <Button onClick={() => router.push('/users/new')}>
            <Plus className='mr-2 h-4 w-4' />
            Add User
          </Button>
        </div>

        {error && <p className='mb-4 text-red-500'>{error}</p>}

        <Card>
          <CardHeader>
            <CardTitle>Gebruikerlijst</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='flex justify-center py-8'>
                <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Naam</TableHead>
                    <TableHead>Gebruikersnaam</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className='text-center'>
                        Geen gebruikers gevonden
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className='capitalize'>
                          {user.role}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.active ? 'default' : 'destructive'}
                          >
                            {user.active ? 'Ingeschakeld' : 'Uitgeschakeld'}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-right'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => router.push(`/users/${user.id}`)}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
