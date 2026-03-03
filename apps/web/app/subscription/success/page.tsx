'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    // Process the successful payment
    // The organization should be created via webhook or you can call your edge function here
    const processPayment = async () => {
      try {
        // Your organization creation logic here
        // This could call your Supabase edge function with the session_id

        setStatus('success');

        // Redirect to home after 2 seconds
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } catch (error) {
        console.error('Error processing payment:', error);
        setStatus('error');
      }
    };

    processPayment();
  }, [sessionId, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Processing your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Payment Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              There was an error processing your payment. Please contact support.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="rounded-full bg-success/10 p-4">
              <Check className="h-8 w-8 text-success" />
            </div>
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            Your organization has been created successfully.
          </p>
          <p className="text-sm text-muted-foreground">Redirecting you to your dashboard...</p>
        </CardContent>
      </Card>
    </div>
  );
}
