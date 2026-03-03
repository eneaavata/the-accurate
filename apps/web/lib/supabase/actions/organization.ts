'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Database Actions - Pure data access layer
 * No business logic, just database operations
 */

export async function createOrganization({
  userId,
  name,
  paymentMethod,
  idempotencyKey,
}: {
  userId: string;
  name: string;
  paymentMethod?: string;
  idempotencyKey: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.functions.invoke('create-organisation', {
    body: {
      name,
      payment_method: paymentMethod,
      idempotency_key: idempotencyKey,
    },
  });

  if (error) {
    throw new Error(error.message || 'Failed to create organization');
  }

  return data;
}

/**
 * get organization-user relationships for a user
 */
export async function getUserOrganizationMemberships(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('organisation_users')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active');

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * get organizations by IDs
 */
export async function getOrganizationsByIds(organizationIds: string[]) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('organisations')
    .select('*')
    .in('id', organizationIds);

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * get single organization by ID
 */
export async function getOrganizationById(organizationId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('organisations')
    .select('*')
    .eq('id', organizationId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * get organization membership for specific user and org
 */
export async function getOrganizationMembership(userId: string, organizationId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('organisation_users')
    .select('*')
    .eq('user_id', userId)
    .eq('organisation_id', organizationId)
    .eq('status', 'active')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * get user trial availability
 */
export async function getUserTrialStatus(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('users')
    .select('trial_available')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Count user's active organization memberships
 */
export async function countUserOrganizations(userId: string) {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('organisation_users')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'active');

  if (error) {
    throw error;
  }

  return count || 0;
}
