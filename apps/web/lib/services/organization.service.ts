'use server';

import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '@/lib/supabase/actions/auth';
import {
  getUserOrganizationMemberships,
  getOrganizationsByIds,
  getOrganizationById as dbGetOrganizationById,
  getOrganizationMembership,
  countUserOrganizations,
  getUserTrialStatus,
} from '@/lib/supabase/actions/organization';
import { Organization } from '@/types/services';

export async function canUserCreateTrial(): Promise<boolean> {
  const user = await getAuthenticatedUser();
  const trialData = await getUserTrialStatus(user.id);
  return trialData?.trial_available ?? false;
}

export async function getOrganizations(): Promise<Organization[]> {
  const user = await getAuthenticatedUser();
  const orgUsers = await getUserOrganizationMemberships(user.id);
  console.log('🚀 ~ getOrganizations ~ orgUsers:', orgUsers);

  if (!orgUsers || orgUsers.length === 0) return [];

  const orgIds = orgUsers.map((ou) => ou.organisation_id);
  const orgs = await getOrganizationsByIds(orgIds);

  return orgUsers
    .map((ou) => {
      const org = orgs?.find((o) => o.id === ou.organisation_id);
      if (!org) return null;

      return {
        id: ou.organisation_id,
        name: org.name,
        roleId: ou.role_id,
        billingStatus: (org.billing_status as Organization['billingStatus']) || 'inactive',
        trialEndsAt: org.trial_ends_at,
        createdAt: org.created_at,
      };
    })
    .filter((org): org is NonNullable<typeof org> => org !== null);
}

export async function getOrganizationById(organizationId: string): Promise<Organization | null> {
  const user = await getAuthenticatedUser();
  const orgUser = await getOrganizationMembership(user.id, organizationId);
  if (!orgUser) return null;

  const org = await dbGetOrganizationById(organizationId);
  if (!org) return null;

  return {
    id: org.id,
    name: org.name,
    roleId: orgUser.role_id,
    billingStatus: (org.billing_status as Organization['billingStatus']) || 'inactive',
    trialEndsAt: org.trial_ends_at,
    createdAt: org.created_at,
  };
}

export async function hasOrganizationAccess(organizationId: string): Promise<boolean> {
  const user = await getAuthenticatedUser();
  const membership = await getOrganizationMembership(user.id, organizationId);
  return !!membership;
}

export async function getOrganizationRole(organizationId: string): Promise<string | null> {
  const user = await getAuthenticatedUser();
  const membership = await getOrganizationMembership(user.id, organizationId);
  return membership?.role_id || null;
}

export async function selectOrganization(organizationId: string) {
  const user = await getAuthenticatedUser();
  const membership = await getOrganizationMembership(user.id, organizationId);

  if (!membership) throw new Error('Organization not found');

  revalidatePath('/', 'layout');
  return {
    organizationId: membership.organisation_id,
    roleId: membership.role_id,
  };
}

export async function getOrganizationCount(): Promise<number> {
  const user = await getAuthenticatedUser();
  return await countUserOrganizations(user.id);
}

export async function isOrganizationAccessible(organizationId: string): Promise<boolean> {
  const org = await getOrganizationById(organizationId);
  if (!org) return false;

  const accessibleStatuses = ['trialing', 'active'];
  if (!accessibleStatuses.includes(org.billingStatus)) return false;

  if (org.billingStatus === 'trialing' && org.trialEndsAt) {
    return new Date(org.trialEndsAt) > new Date();
  }

  return true;
}
