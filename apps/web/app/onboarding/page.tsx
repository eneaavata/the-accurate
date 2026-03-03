'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building2, Shield, Check, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createOrganization, getOrganizations, canUserCreateTrial } from '@/lib/services';

const createOrgSchema = z.object({
  name: z
    .string()
    .min(1, 'Organization name is required')
    .min(3, 'Organization name must be at least 3 characters'),
});

type CreateOrgForm = z.infer<typeof createOrgSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [step, setStep] = useState<'create' | 'success'>('create');

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

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const orgs = await getOrganizations();
      console.log('🚀 ~ checkStatus ~ orgs:', orgs);
      if (orgs.length > 0) {
        router.push('/');
        return;
      }

      const canTrial = await canUserCreateTrial();
      if (!canTrial) {
        // router.push('/subscription');
        return;
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      router.push('/login');
    } finally {
      setPageLoading(false);
    }
  };

  const onSubmit = async (data: CreateOrgForm) => {
    setIsLoading(true);
    try {
      const result = await createOrganization(data.name);
      console.log('🚀 ~ onSubmit ~ result:', result);
      setStep('success');

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push(`/${result.organizationId}`);
      }, 2000);
    } catch (error: any) {
      setError('root', { message: error.message || 'Failed to create organization' });
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="rounded-full bg-success/10 p-4">
                <Check className="h-8 w-8 text-success" />
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome to {orgName}!</CardTitle>
            <CardDescription>
              Your organization has been created with a 30-day free trial.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-success/10 border border-success/30 rounded-md p-4">
              <p className="text-sm text-success-foreground">Redirecting to your dashboard...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <Card>
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-xl">Create Your Organization</CardTitle>
            <CardDescription>
              Create your first organization and start your 30-day free trial with full access to
              all features. Give your organization a name to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            {errors.root && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm">
                {errors.root.message}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Input
                  id="name"
                  type="text"
                  label="Organization Name"
                  placeholder="Acme Corporation"
                  disabled={isLoading}
                  {...register('name')}
                />
                {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
              </div>

              {/* Trial Benefits */}
              <div className="border rounded-md p-4 bg-success/10 border-success/30">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-success" />
                  Your 30-Day Free Trial Includes:
                </h4>
                <ul className="space-y-2 text-sm">
                  {[
                    'Full access to all features',
                    '30-day trial period',
                    'No credit card required',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-info/10 border border-info/30 rounded-md p-4 text-sm">
                <p className="text-info-foreground">
                  💡 <strong>Tip:</strong> After your trial ends, you can upgrade to a paid plan to
                  continue using all features.
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating Your Organization...
                  </div>
                ) : (
                  <>
                    <Building2 className="h-4 w-4 mr-2" />
                    Start My Free Trial
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <p className="text-center text-sm text-muted-foreground">
          By creating an organization, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
