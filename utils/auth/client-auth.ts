'use client';

import { createClient } from "../supabase/client";

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  return { data, error };
}

export async function signOut() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  return { error };
}