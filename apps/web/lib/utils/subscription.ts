/**
 * Subscription Utilities
 * Client-safe utility functions for subscription/billing
 */

import { SubscriptionPlan } from '@/types/services';

/**
 * Available subscription plans
 */
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'trial',
    name: 'Free Trial',
    price: '£0',
    period: '30 days',
    description: 'Perfect for testing and evaluation',
    features: [
      'Full access to all features',
      '30-day trial period',
      'Up to 5 users',
      'Basic support',
      'Standard analytics',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: '£29',
    period: 'per month',
    description: 'For teams ready to scale',
    features: [
      'All features included',
      'Unlimited users',
      'Priority support',
      'Advanced analytics',
      'Custom integrations',
      'Advanced reporting',
    ],
  },
];

/**
 * Calculate remaining trial days
 */
export function calculateTrialDaysRemaining(trialEndsAt: string | null): number | null {
  if (!trialEndsAt) return null;

  const endDate = new Date(trialEndsAt);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}

/**
 * Get billing status info for UI display
 */
export function getBillingStatusInfo(status: string, trialEndsAt: string | null) {
  const remainingDays = calculateTrialDaysRemaining(trialEndsAt);

  switch (status) {
    case 'trialing':
      return {
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-950',
        borderColor: 'border-blue-200 dark:border-blue-800',
        text: `Trial - ${remainingDays} days left`,
        iconName: 'Shield',
        urgent: remainingDays !== null && remainingDays <= 3,
      };
    case 'active':
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-50 dark:bg-green-950',
        borderColor: 'border-green-200 dark:border-green-800',
        text: 'Active Subscription',
        iconName: 'Crown',
        urgent: false,
      };
    case 'past_due':
      return {
        color: 'text-red-600',
        bgColor: 'bg-red-50 dark:bg-red-950',
        borderColor: 'border-red-200 dark:border-red-800',
        text: 'Payment Required',
        iconName: 'Zap',
        urgent: true,
      };
    default:
      return {
        color: 'text-gray-600',
        bgColor: 'bg-gray-50 dark:bg-gray-950',
        borderColor: 'border-gray-200 dark:border-gray-800',
        text: 'Inactive',
        iconName: 'Building2',
        urgent: false,
      };
  }
}
