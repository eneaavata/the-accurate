'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Building2, CreditCard, Shield, Check, Clock, Zap, Users, BarChart } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { createOrganization } from '@/lib/services';

const createOrgSchema = z.object({
  name: z
    .string()
    .min(1, 'Organization name is required')
    .min(3, 'Organization name must be at least 3 characters'),
  payment_method: z.string().optional(),
});

type CreateOrgForm = z.infer<typeof createOrgSchema>;
type SubscriptionPlan = 'trial' | 'pro';

export default function CreateOrganizationPage() {
  const router = useRouter();
  const [step, setStep] = useState<'plan' | 'details' | 'success'>('plan');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('trial');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<CreateOrgForm>({
    resolver: zodResolver(createOrgSchema),
  });

  const orgName = watch('name');

  const generateIdempotencyKey = () => {
    return crypto.randomUUID();
  };

  const onSubmit = async (data: CreateOrgForm) => {
    setIsLoading(true);
    try {
      if (selectedPlan === 'trial') {
        await createOrganization(data.name);
      } else {
        await createOrganization(data.name, data.payment_method);
      }

      setStep('success');

      // Redirect to dashboard after successful creation
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error: any) {
      setError('root', { message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    {
      id: 'trial' as SubscriptionPlan,
      name: 'Free Trial',
      price: '$0',
      period: '30 days',
      description: 'Perfect for testing and evaluation',
      features: [
        'Full access to all features',
        '30-day trial period',
        'Up to 5 users',
        'Basic support',
        'Standard analytics',
      ],
      badge: 'Most Popular',
      badgeColor: 'bg-success',
      buttonText: 'Start Free Trial',
      icon: Shield,
    },
    {
      id: 'pro' as SubscriptionPlan,
      name: 'Pro Plan',
      price: '$29',
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
      badge: 'Best Value',
      badgeColor: 'bg-info',
      buttonText: 'Subscribe Now',
      icon: Zap,
    },
  ];

  if (step === 'success') {
    return (
      <div className="container max-w-md mx-auto mt-8">
        <Card>
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-success/10 p-3">
                <Check className="h-8 w-8 text-success" />
              </div>
            </div>
            <CardTitle className="text-2xl">Organization Created!</CardTitle>
            <CardDescription>
              {selectedPlan === 'trial'
                ? `Your organization "${orgName}" has been created with a 30-day free trial.`
                : `Your organization "${orgName}" has been created and your subscription is active.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-success/10 border border-success/30 rounded-md p-4">
              <div className="flex items-center justify-center gap-2 text-success-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Redirecting to dashboard in 3 seconds...</span>
              </div>
            </div>
            <Button onClick={() => router.push('/')} variant="outline" className="w-full">
              Go to Dashboard Now
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'plan') {
    return (
      <div className="container max-w-4xl mx-auto mt-8">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-bold">Choose Your Plan</h1>
          <p className="text-muted-foreground">
            Start with a free trial or subscribe to unlock full potential
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const isSelected = selectedPlan === plan.id;

            return (
              <Card
                key={plan.id}
                className={`relative cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className={`${plan.badgeColor} text-white border-0`}>{plan.badge}</Badge>
                  </div>
                )}

                <CardHeader className="text-center space-y-4">
                  <div className="flex items-center justify-center">
                    <div
                      className={`rounded-full p-3 ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>

                  <div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </div>

                  <div>
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">/{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-success shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={isSelected ? 'default' : 'outline'}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(plan.id);
                      setStep('details');
                    }}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Step 2: Organization Details
  return (
    <div className="container max-w-md mx-auto mt-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => setStep('plan')} className="mb-4">
          ← Back to Plans
        </Button>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Organization Details</h1>
          <p className="text-muted-foreground">
            {selectedPlan === 'trial'
              ? 'Complete your free trial setup'
              : 'Complete your subscription setup'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-xl text-center">
            {selectedPlan === 'trial' ? 'Start Free Trial' : 'Pro Subscription'}
          </CardTitle>
          <CardDescription className="text-center">
            {selectedPlan === 'trial'
              ? 'Enter your organization details to start your 30-day free trial'
              : 'Enter your organization details and payment information'}
          </CardDescription>
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

            {selectedPlan === 'pro' && (
              <div className="space-y-2">
                <Label htmlFor="payment_method" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Method
                </Label>
                <Input
                  id="payment_method"
                  type="text"
                  placeholder="pm_1234567890 (Stripe Payment Method ID)"
                  disabled={isLoading}
                  {...register('payment_method')}
                />
                <p className="text-xs text-muted-foreground">
                  Enter your Stripe payment method ID for billing
                </p>
              </div>
            )}

            <div
              className={`border rounded-md p-4 ${
                selectedPlan === 'trial'
                  ? 'bg-success/10 border-success/30'
                  : 'bg-info/10 border-info/30'
              }`}
            >
              <h4 className="font-medium mb-2 flex items-center gap-2">
                {selectedPlan === 'trial' ? (
                  <Shield className="h-4 w-4 text-success" />
                ) : (
                  <Zap className="h-4 w-4 text-info" />
                )}
                {selectedPlan === 'trial' ? 'Trial Benefits:' : 'Pro Benefits:'}
              </h4>
              <ul className="text-sm space-y-1">
                {plans
                  .find((p) => p.id === selectedPlan)
                  ?.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-success" />
                      {feature}
                    </li>
                  ))}
              </ul>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating Organization...
                </div>
              ) : selectedPlan === 'trial' ? (
                'Start Free Trial'
              ) : (
                'Create Organization & Subscribe'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
