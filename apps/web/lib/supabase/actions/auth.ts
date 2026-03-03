'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Login user with email and password
 */
export async function login({ email, password }: { email: string; password: string }) {
  const supabase = await createClient();
  const data = {
    email,
    password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error('Login error:', error);
    throw new Error(error.message);
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

/**
 * Sign up new user
 */
export async function signup({
  email,
  password,
  fullName,
}: {
  email: string;
  password: string;
  fullName: string;
}) {
  const supabase = await createClient();

  const data = {
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    throw new Error(error.message);
  }

  // Success, verification email sent
  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

/**
 * Sign out current user
 */
export async function signout() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.auth.signOut();
  }

  revalidatePath('/', 'layout');
  redirect('/login');
}

/**
 * Get current authenticated user
 */
export async function getAuthenticatedUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error('User not authenticated');
  }

  return user;
}

/**
 * Reset user password
 */
export async function resetPassword(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

/**
 * Update user password
 */
export async function updatePassword(newPassword: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

/**
 * Get current user
 */
export async function getUser() {
  const supabase = await createClient();
  return await supabase.auth.getUser();
}
