import { Provider } from '@nestjs/common';
import Stripe from 'stripe';

export const StripeProvider: Provider = {
  provide: 'STRIPE_CLIENT',
  useFactory: () => {
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-01-28.clover',
    });
  },
};
