'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface TableActionsProps {
  objectId: string;
  objectName: string;
  objectLabel: string;
}

export default function TableActions({
  objectId,
  objectName,
  objectLabel,
}: TableActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (
      !confirm(`Weet je zeker dat je deze ${objectLabel} wilt verwijderen?`)
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/${objectName}/${objectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete object');
      }

      router.refresh();
    } catch (err) {
      console.error('Error deleting object:', err);
      alert(`Kon de ${objectLabel} niet verwijderen`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='flex justify-end space-x-2'>
      <Button
        className='hover:cursor-pointer'
        variant='ghost'
        size='icon'
        onClick={() => router.push(`/${objectName}/${objectId}`)}
      >
        <Pencil className='h-4 w-4' />
      </Button>
      <Button
        className='hover:cursor-pointer'
        variant='ghost'
        size='icon'
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className='h-4 w-4' />
      </Button>
    </div>
  );
}
