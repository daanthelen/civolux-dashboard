import { Suspense } from 'react';
import Link from 'next/link';
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
import { Plus } from 'lucide-react';
import { db } from '@/lib/db';
import TableActions from '@/components/table-actions';

async function UsersTable() {
  const users = await db.getUsers();

  return (
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
              <TableCell className='capitalize'>{user.role}</TableCell>
              <TableCell>
                <Badge variant={user.active ? 'default' : 'destructive'}>
                  {user.active ? 'Ingeschakeld' : 'Uitgeschakeld'}
                </Badge>
              </TableCell>
              <TableCell className='text-right'>
                <TableActions objectId={user.id} objectName='users' objectLabel='gebruiker' />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

function UsersTableSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between space-x-4'>
        <div className='h-8 w-32 animate-pulse rounded bg-gray-200'></div>
        <div className='h-8 w-32 animate-pulse rounded bg-gray-200'></div>
      </div>
      <div className='rounded-md border'>
        <div className='h-12 border-b bg-gray-50'></div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className='h-16 animate-pulse border-b bg-gray-100'
          ></div>
        ))}
      </div>
    </div>
  );
}

function AddUserButton() {
  'use client';

  return (
    <Button asChild>
      <Link href='/users/new'>
        <Plus className='mr-2 h-4 w-4 hover:cursor-pointer' /> Voeg gebruiker toe
      </Link>
    </Button>
  );
}

export default function UsersPage() {
  return (
    <div className='flex flex-1'>
      <main className='flex-1 p-4 md:p-6'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Gebruikers</h1>
          <AddUserButton />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gebruikerslijst</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<UsersTableSkeleton />}>
              <UsersTable />
            </Suspense>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
