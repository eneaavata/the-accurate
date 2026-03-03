import { Inject, Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { OrganisationsService } from '../organisations/organisations.service';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class StripeWebhookService {
  private readonly logger = new Logger(StripeWebhookService.name);

  constructor(
    @Inject('STRIPE_CLIENT') private readonly stripeClient: Stripe,
    @Inject('SUPABASE_ADMIN') private readonly adminClient: SupabaseClient,
    private readonly organisationsService: OrganisationsService,
  ) {}

  async eventExists(id: string): Promise<boolean> {
    const { error } = await this.adminClient
      .from('stripe_events')
      .insert({ id });

    if (error) {
      if (error.code === '23505') {
        return true;
      }
      throw error;
    }

    return false;
  }

  constructEvent(body: string | Buffer, signature: string) {
    return this.stripeClient.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  }

  async handleWebhookEvent(event: Stripe.Event) {
    const alreadyExists = await this.eventExists(event.id);

    if (alreadyExists) return;

    switch (event.type) {
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;

        await this.organisationsService.update(
          'stripe_customer_id',
          invoice.customer as string,
          {
            billing_status: 'active',
            subscription_ends_at: new Date(
              invoice.lines.data[0].period.end * 1000,
            ).toISOString(),
            has_ever_paid: true,
            grace_ends_at: null,
          },
        );

        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;

        const hasEverPaid = await this.organisationsService.hasEverPaid(
          invoice.customer as string,
        );

        if (!hasEverPaid) {
          await this.organisationsService.update(
            'stripe_customer_id',
            invoice.customer as string,
            {
              billing_status: 'incomplete',
              grace_ends_at: null,
            },
          );

          return;
        }

        const graceEndDate = new Date();
        graceEndDate.setDate(graceEndDate.getDate() + 7);

        await this.organisationsService.update(
          'stripe_customer_id',
          invoice.customer as string,
          {
            billing_status: 'past_due',
            grace_ends_at: graceEndDate.toISOString(),
          },
        );

        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        await this.organisationsService.update(
          'stripe_subscription_id',
          subscription.id,
          {
            trial_ends_at: subscription.trial_end
              ? new Date(subscription.trial_end * 1000).toISOString()
              : null,
            subscription_ends_at: new Date(
              subscription.items.data[0].current_period_end * 1000,
            ).toISOString(),
            seat_limit: subscription.items.data[0].quantity,
          },
        );

        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        if (subscription.status === 'incomplete_expired') {
          await this.organisationsService.delete(
            'stripe_subscription_id',
            subscription.id,
          );
        } else {
          await this.organisationsService.update(
            'stripe_subscription_id',
            subscription.id,
            {
              billing_status: 'canceled',
            },
          );
        }

        break;
      }
      default:
        this.logger.warn(`Unhandled Stripe event type: ${event.type}`);
        break;
    }
  }
}
