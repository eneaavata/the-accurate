'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Crown, Shield, Zap, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOrganizations, selectOrganization } from '@/lib/services';
import { Organization } from '@/types/services';
import { getBillingStatusInfo } from '@/lib/services';
import Navbar from '@/components/layout/simpleNavbar';
import SimpleNavbar from '@/components/layout/simpleNavbar';

export default function Home() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      const orgs = await getOrganizations();

      if (orgs.length === 0) {
        router.push('/onboarding');
        return;
      }

      setOrganizations(orgs);
    } catch (error) {
      console.error('Error loading organizations:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOrganization = async (orgId: string) => {
    try {
      await selectOrganization(orgId);
      router.push(`/${orgId}`);
    } catch (error) {
      console.error('Error selecting organization:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto mt-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = { Shield, Crown, Zap, Building2 };
    return icons[iconName] || Building2;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-6xl space-y-6">
        {/* Header with Add Organization Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-1">
              Select an organization to continue
            </p>
          </div>
          <Button onClick={() => router.push('/subscription')} className="w-full sm:w-auto">
            <Building2 className="h-4 w-4 mr-2" />
            Add Organization
          </Button>
        </div>

        {/* Existing Organizations */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            Your Organizations
          </h2>

          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org) => {
              const statusInfo = getBillingStatusInfo(org.billingStatus, org.trialEndsAt);
              const StatusIcon = getIconComponent(statusInfo.iconName);

              return (
                <Card
                  key={org.id}
                  className={`cursor-pointer transition-all hover:shadow-md active:scale-95 ${
                    statusInfo.urgent ? 'ring-2 ring-red-200 dark:ring-red-800' : ''
                  }`}
                  onClick={() => handleSelectOrganization(org.id)}
                >
                  <CardHeader className="pb-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-base sm:text-lg truncate">
                            {org.name}
                          </CardTitle>
                          <CardDescription className="text-xs sm:text-sm">
                            Created {new Date(org.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <div
                      className={`flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-md ${statusInfo.bgColor} ${statusInfo.borderColor} border`}
                    >
                      <StatusIcon
                        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 ${statusInfo.color}`}
                      />
                      <span
                        className={`text-xs sm:text-sm font-medium ${statusInfo.color} truncate`}
                      >
                        {statusInfo.text}
                      </span>
                    </div>

                    {statusInfo.urgent && (
                      <div className="text-xs text-destructive">
                        {org.billingStatus === 'trialing'
                          ? 'Subscribe now to continue'
                          : 'Update payment method'}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
