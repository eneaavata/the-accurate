/**
 * Service Layer Type Definitions
 * Centralized types for business logic services
 */

export interface Organization {
  id: string;
  name: string;
  roleId: string;
  billingStatus: 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete' | 'inactive';
  trialEndsAt: string | null;
  createdAt: string;
}

export interface UserOnboardingStatus {
  isOnboarded: boolean;
  hasOrganizations: boolean;
  canCreateFreeTrial: boolean;
  organizations: Organization[];
}

export interface SubscriptionPlan {
  id: 'trial' | 'pro';
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
}

export interface CreateOrganizationParams {
  name: string;
  withTrial?: boolean;
  paymentMethod?: string;
}

export interface CreateOrganizationResult {
  organizationId: string;
  name: string;
  billingStatus: string;
  trialEndsAt?: string;
}

export interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  isTrialing: boolean;
  trialDaysRemaining: number | null;
  billingStatus: string;
  trialEndsAt: string | null;
}

export type OnboardingRoute = 'onboarding' | 'dashboard' | 'subscription';
