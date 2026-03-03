'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Building2, Zap, Check, ArrowLeft, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getOrganizations,
  canUserCreateTrial,
  SUBSCRIPTION_PLANS,
  createOrganization,
} from '@/lib/services';
import { createCheckoutSession } from '@/lib/stripe/actions';

const createOrgSchema = z.object({
  name: z
    .string()
    .min(1, 'Organization name is required')
    .min(3, 'Organization name must be at least 3 characters'),
});

type CreateOrgForm = z.infer<typeof createOrgSchema>;

export default function SubscriptionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CreateOrgForm>({
    resolver: zodResolver(createOrgSchema),
  });

  const proPlan = SUBSCRIPTION_PLANS.find((p) => p.id === 'pro');

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const orgs = await getOrganizations();
      const canTrial = await canUserCreateTrial();

      if (orgs.length === 0 && canTrial) {
        router.push('/onboarding');
        return;
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      router.push('/login');
    } finally {
      setPageLoading(false);
    }
  };

  const onSubmit = async (data: CreateOrgForm) => {
    setIsLoading(true);
    try {
      // Create organization first (without payment for now)
      const result = await createOrganization(data.name);

      // Then create Stripe checkout session for the new organization
      const { url } = await createCheckoutSession(result.organizationId);

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error: any) {
      setError('root', { message: error.message || 'Failed to start checkout' });
      setIsLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-2xl space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="rounded-full bg-info/10 p-4">
              <Zap className="h-10 w-10 text-info" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Create New Organization</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Create an additional organization with a Pro subscription
          </p>
        </div>

        {/* Plan Overview */}
        {proPlan && (
          <Card className="border-info/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{proPlan.name}</CardTitle>
                  <CardDescription>{proPlan.description}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-info">{proPlan.price}</div>
                  <div className="text-sm text-muted-foreground">{proPlan.period}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-2 gap-3 text-sm">
                {proPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-info shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Organization Form */}
        <Card>
          <CardHeader className="text-center space-y-2">
            <div className="flex items-center justify-center">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Organization Details</CardTitle>
            <CardDescription>Enter your organization name and payment information</CardDescription>
          </CardHeader>

          <CardContent>
            {errors.root && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm">
                {errors.root.message}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Acme Corporation"
                  required
                  disabled={isLoading}
                  {...register('name')}
                />
                {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
              </div>

              <div className="bg-info/10 border border-info/30 rounded-md p-4">
                <h4 className="font-medium mb-2 text-sm">What happens next:</h4>
                <ul className="text-sm space-y-1 text-info-foreground">
                  <li>• You'll be redirected to secure Stripe checkout</li>
                  <li>• Enter your payment details securely with Stripe</li>
                  <li>• Your subscription starts immediately after payment</li>
                  <li>• First payment: {proPlan?.price} today</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Redirecting to Checkout...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Continue to Payment
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Note */}
        <p className="text-center text-sm text-muted-foreground">
          🔒 Your payment information is securely processed by Stripe. We never store your card
          details.
        </p>
      </div>
    </div>
  );
}
