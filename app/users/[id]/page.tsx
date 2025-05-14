import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import UserForm from '@/components/user-form';
import { db } from '@/lib/db';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await db.getUserById(id)
  
  if (!user) {
    notFound();
  }

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold'>Bewerk gebruiker</h1>
      </div>

      <Suspense fallback={<UserFormSkeleton />}>
        <UserForm userId={user.id} initialData={user}></UserForm>
      </Suspense>
    </div>
  );
}

function UserFormSkeleton() {
  return (
    <div className='space-y-4 rounded-lg border p-6'>
      <div className='h-8 w-1/3 animate-pulse rounded bg-gray-200'></div>
      <div className='space-y-4'>
        <div className='grid gap-4 md:grid-cols-2'>
          <div className='h-10 animate-pulse rounded bg-gray-200'></div>
          <div className='h-10 animate-pulse rounded bg-gray-200'></div>
        </div>
        <div className='h-10 animate-pulse rounded bg-gray-200'></div>
        <div className='h-10 animate-pulse rounded bg-gray-200'></div>
        <div className='h-10 animate-pulse rounded bg-gray-200'></div>
        <div className='grid gap-4 md:grid-cols-2'>
          <div className='h-10 animate-pulse rounded bg-gray-200'></div>
          <div className='h-10 animate-pulse rounded bg-gray-200'></div>
        </div>
        <div className='flex justify-end space-x-2'>
          <div className='h-10 w-24 animate-pulse rounded bg-gray-200'></div>
          <div className='h-10 w-24 animate-pulse rounded bg-gray-200'></div>
        </div>
      </div>
    </div>
  );
}
