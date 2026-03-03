'use server';

/**
 * Stripe Server Actions
 * Handles Stripe checkout and billing portal sessions
 */

import Stripe from 'stripe';
import { getAuthenticatedUser } from '@/lib/supabase/actions/auth';
import { getOrganizationById } from '@/lib/supabase/actions/organization';
import { createClient } from '@/lib/supabase/server';

// Environment configuration
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

if (!STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not configured');
}

// Initialize Stripe client
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

/**
 * Get or create Stripe customer for organization
 */
async function getOrCreateStripeCustomer(
  org: any,
  userEmail: string,
  userId: string
): Promise<string> {
  // Return existing customer ID if available
  if (org.stripe_customer_id) {
    return org.stripe_customer_id;
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email: userEmail,
    metadata: {
      user_id: userId,
      organisation_id: org.id,
    },
  });

  // Update organization with customer ID
  const supabase = await createClient();
  await supabase.from('organisations').update({ stripe_customer_id: customer.id }).eq('id', org.id);

  return customer.id;
}

/**
 * Create a Stripe Checkout Session for subscription
 * Used when user wants to start a new subscription
 */
export async function createCheckoutSession(organizationId: string) {
  try {
    if (!STRIPE_PRICE_ID) {
      throw new Error('Stripe price ID not configured');
    }

    // Authenticate and fetch organization
    const user = await getAuthenticatedUser();
    const org = await getOrganizationById(organizationId);

    if (!org) {
      throw new Error('Organization not found');
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(org, user.email, user.id);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${APP_URL}/${organizationId}/billing?success=true`,
      cancel_url: `${APP_URL}/${organizationId}/billing?canceled=true`,
      metadata: {
        organisation_id: organizationId,
        user_id: user.id,
      },
      subscription_data: {
        metadata: {
          organisation_id: organizationId,
        },
      },
    });

    return {
      url: session.url,
      sessionId: session.id,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    console.error('Stripe checkout error:', error);
    throw new Error(message);
  }
}

/**
 * Create a Stripe Billing Portal Session
 * Used when user wants to manage existing subscription
 */
export async function createBillingPortalSession(organizationId: string) {
  try {
    // Authenticate and fetch organization
    const user = await getAuthenticatedUser();
    const org = await getOrganizationById(organizationId);

    if (!org) {
      throw new Error('Organization not found');
    }

    if (!org.stripe_customer_id) {
      throw new Error('No billing account found. Please subscribe first.');
    }

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: org.stripe_customer_id,
      return_url: `${APP_URL}/${organizationId}/billing`,
    });

    return {
      url: session.url,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to create billing portal session';
    console.error('Stripe portal error:', error);
    throw new Error(message);
  }
}
