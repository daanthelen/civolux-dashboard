'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

export async function login(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return error.message;
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function createUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  const supabase = await createClient();

  const newUser = {
    email,
    password,
    firstName,
    lastName,
  };

  console.log('Signing up with credentials:', newUser);

  const { error } = await supabase.auth.signUp(newUser);

  if (error) {
    return error.message;
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout')
  redirect('/login');
}
