'use client';
import { useState, useEffect } from 'react';
import { CreditCard, Download, Check, Zap, AlertCircle, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Column, DataTable } from '@/components/ui/Table';
import { getSubscriptionStatus, SUBSCRIPTION_PLANS } from '@/lib/services';
import { createCheckoutSession, createBillingPortalSession } from '@/lib/stripe/actions';

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: string;
}

const invoices: Invoice[] = [
  { id: 'INV-2026-001', date: '2026-01-01', amount: '$299.00', status: 'Paid' },
  { id: 'INV-2025-012', date: '2025-12-01', amount: '$299.00', status: 'Paid' },
  { id: 'INV-2025-011', date: '2025-11-01', amount: '$299.00', status: 'Paid' },
];

const invoiceColumns: Column<Invoice>[] = [
  { key: 'id', label: 'Invoice', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  {
    key: 'status',
    label: 'Status',
    render: (invoice) => (
      <Badge className="bg-success/10 text-success border-success/20">{invoice.status}</Badge>
    ),
  },
  {
    key: 'actions',
    label: '',
    actions: [
      {
        icon: <Download className="h-4 w-4" />,
        onClick: () => {},
        className: 'text-info hover:bg-info/10',
      },
    ],
  },
];

const planFeatures = [
  'Unlimited organizations',
  'Unlimited users',
  'Advanced analytics',
  'Priority support',
  'Custom integrations',
  'API access',
];

export default function BillingPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params.orgId as string;

  const [isManaging, setIsManaging] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const proPlan = SUBSCRIPTION_PLANS.find((p) => p.id === 'pro');

  useEffect(() => {
    loadSubscriptionStatus();
  }, [orgId]);

  const loadSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const status = await getSubscriptionStatus(orgId);
      setSubscriptionStatus(status);
    } catch (err) {
      console.error('Error loading subscription:', err);
      setError('Failed to load subscription information');
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setIsManaging(true);
    setError(null);
    try {
      const { url } = await createBillingPortalSession(orgId);
      if (url) window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'Failed to open billing portal');
    } finally {
      setIsManaging(false);
    }
  };

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    setError(null);
    try {
      const { url } = await createCheckoutSession(orgId);
      if (url) window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'Failed to start checkout');
    } finally {
      setIsSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasActiveSubscription = subscriptionStatus?.hasActiveSubscription;
  const isTrialing = subscriptionStatus?.isTrialing;
  const trialDaysRemaining = subscriptionStatus?.trialDaysRemaining;

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-1">
          {hasActiveSubscription
            ? 'Manage your plan, payment, and billing history'
            : 'Subscribe to unlock all features'}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Error</p>
                <p className="text-sm text-destructive/90 mt-1">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trial Warning */}
      {isTrialing && trialDaysRemaining !== null && trialDaysRemaining <= 7 && (
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-warning">Trial Ending Soon</p>
                <p className="text-sm text-warning/90 mt-1">
                  Your trial ends in {trialDaysRemaining}{' '}
                  {trialDaysRemaining === 1 ? 'day' : 'days'}. Subscribe to continue using all
                  features.
                </p>
              </div>
              <Button
                onClick={handleSubscribe}
                disabled={isSubscribing}
                className="shrink-0"
                size="sm"
              >
                Subscribe Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Subscription - Upgrade Card */}
      {!hasActiveSubscription && !isTrialing && proPlan && (
        <Card className="border-info/30 bg-linear-to-br from-info/5 to-info/10">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-info/10 p-1.5">
                    <Zap className="h-5 w-5 text-info" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">Upgrade to {proPlan.name}</CardTitle>
                </div>
                <CardDescription className="text-sm">{proPlan.description}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-bold text-info">
                  {proPlan.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    {proPlan.period.replace('per ', '/')}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {proPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <Button
                onClick={handleSubscribe}
                disabled={isSubscribing}
                className="w-full sm:w-auto"
                size="lg"
              >
                {isSubscribing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Subscribe Now
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                🔒 Secure payment via Stripe. Cancel anytime.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Subscription - Current Plan */}
      {(hasActiveSubscription || isTrialing) && (
        <>
          <Card className={isTrialing ? 'border-info/20' : 'border-success/20'}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`rounded-full p-1.5 ${isTrialing ? 'bg-info/10' : 'bg-success/10'}`}
                    >
                      <Zap className={`h-4 w-4 ${isTrialing ? 'text-info' : 'text-success'}`} />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">
                      {isTrialing ? 'Free Trial' : 'Business Plan'}
                    </CardTitle>
                    {isTrialing && (
                      <Badge className="bg-info/10 text-info border-info/20">
                        {trialDaysRemaining} days left
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    {isTrialing ? 'Full access to all features' : 'Active subscription'}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div
                    className={`text-xl sm:text-2xl font-bold ${isTrialing ? 'text-info' : 'text-success'}`}
                  >
                    {isTrialing ? '£0' : '£29'}
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {planFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {hasActiveSubscription && (
                <div className="pt-4 border-t border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                      Next billing:{' '}
                      <span className="font-medium text-foreground">March 1, 2026</span>
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleManageBilling}
                      disabled={isManaging}
                      className="w-full sm:w-auto"
                    >
                      {isManaging ? 'Loading...' : 'Manage Plan'}
                    </Button>
                  </div>
                </div>
              )}

              {isTrialing && (
                <div className="pt-4 border-t border-border">
                  <Button
                    onClick={handleSubscribe}
                    disabled={isSubscribing}
                    className="w-full sm:w-auto"
                  >
                    {isSubscribing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Upgrade to Pro'
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method - Only show for active subscriptions */}
          {hasActiveSubscription && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-muted shrink-0">
                      <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">•••• •••• •••• 4242</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Expires 12/2027</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleManageBilling}
                    disabled={isManaging}
                    className="w-full sm:w-auto"
                  >
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Billing History - Only show for active subscriptions */}
          {hasActiveSubscription && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Billing History</CardTitle>
                <CardDescription className="text-sm">Download your past invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-6 sm:mx-0">
                  <div className="inline-block min-w-full align-middle px-6 sm:px-0">
                    <DataTable data={invoices} columns={invoiceColumns} hasCheckBox={false} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Security Note */}
      <p className="text-center text-xs sm:text-sm text-muted-foreground px-4">
        🔒 Payments are securely processed by Stripe. We never store your card details.
      </p>
    </div>
  );
}
