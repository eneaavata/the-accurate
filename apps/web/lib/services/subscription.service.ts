'use server';

/**
 * Subscription Service
 * Handles trial status, subscription creation, and billing
 */

import { getAuthenticatedUser } from '@/lib/supabase/actions/auth';
import { createClient } from '@/lib/supabase/server';
import { getUserTrialStatus, getOrganizationById } from '@/lib/supabase/actions/organization';
import { calculateTrialDaysRemaining } from '@/lib/utils/subscription';
import { SubscriptionStatus, CreateOrganizationResult } from '@/types/services';

export async function canUserCreateFreeTrial(): Promise<boolean> {
  const user = await getAuthenticatedUser();
  const trialData = await getUserTrialStatus(user.id);
  return trialData?.trial_available ?? false;
}

export async function getSubscriptionStatus(
  organizationId: string
): Promise<SubscriptionStatus | null> {
  const org = await getOrganizationById(organizationId);
  if (!org) return null;

  const isTrialing = org.billing_status === 'trialing';
  const trialDaysRemaining = calculateTrialDaysRemaining(org.trial_ends_at);

  return {
    hasActiveSubscription: org.billing_status === 'active',
    isTrialing,
    trialDaysRemaining,
    billingStatus: org.billing_status,
    trialEndsAt: org.trial_ends_at,
  };
}

export async function createOrganization(
  name: string,
  paymentMethod?: string
): Promise<CreateOrganizationResult> {
  const user = await getAuthenticatedUser();
  const { createOrganization: dbCreateOrg } = await import('@/lib/supabase/actions/organization');

  const data = await dbCreateOrg({
    userId: user.id,
    name,
    paymentMethod,
    idempotencyKey: crypto.randomUUID(),
  });

  return {
    organizationId: data.organisation_id || data.id,
    name: data.name || name,
    billingStatus: data.billing_status || (paymentMethod ? 'active' : 'trialing'),
    trialEndsAt: data.trial_ends_at,
  };
}

export async function upgradeOrganizationToSubscription(
  organizationId: string,
  paymentMethod: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.functions.invoke('upgrade-subscription', {
    body: {
      organisation_id: organizationId,
      payment_method: paymentMethod,
    },
  });

  if (error) throw new Error(error.message || 'Failed to upgrade subscription');
}

export async function organizationNeedsBillingAttention(organizationId: string): Promise<boolean> {
  const status = await getSubscriptionStatus(organizationId);
  if (!status) return false;

  if (status.isTrialing && status.trialDaysRemaining !== null && status.trialDaysRemaining <= 3) {
    return true;
  }

  return status.billingStatus === 'past_due';
}

export async function getOrganizationsNeedingBillingAttention(
  organizationIds: string[]
): Promise<string[]> {
  const needsAttention: string[] = [];

  for (const orgId of organizationIds) {
    const needs = await organizationNeedsBillingAttention(orgId);
    if (needs) needsAttention.push(orgId);
  }

  return needsAttention;
}
