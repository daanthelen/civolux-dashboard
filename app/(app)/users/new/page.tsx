'use client';

import UserForm from "@/components/users/user-form";

export default function NewUserPage() {
  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold'>Voeg een nieuwe gebruiker toe</h1>
      </div>
      <UserForm />
    </div>
  );
}
