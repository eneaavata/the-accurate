import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);

    async createCustomer(email: string, name: string, idempotencyKey?: string) {
        try {
            return await this.stripeClient.customers.create(
                { email, name, },
                { idempotencyKey: idempotencyKey ? `customer_${idempotencyKey}` : undefined }
            );
        } catch (error) {

        }
    }

    async safeDeleteCustomer(customerId: string) {
        try {
            return await this.stripeClient.customers.del(customerId);
        } catch (error) {
            this.logger.warn("Failed to delete Stripe customer", (error as Error)?.stack);
        }
    }

    if (!subscriptionItem)
      throw new InternalServerErrorException(
        `No subscription item found for subscription: ${subscriptionId}`,
      );

    const currentQuantity = subscriptionItem.quantity ?? 0;

    if (seats === currentQuantity) return { subscription };

    if (seats > currentQuantity) {
      const updatedSubscription = await this.stripeClient.subscriptions.update(
        subscriptionId,
        {
          items: [
            {
              id: subscriptionItem.id,
              quantity: seats,
            },
          ],
          proration_behavior: 'always_invoice',
          expand: ['latest_invoice.payments'],
          payment_behavior: 'allow_incomplete',
        },
        {
          idempotencyKey: idempotencyKey
            ? `seats_${idempotencyKey}`
            : undefined,
        },
      );

      const invoice = updatedSubscription.latest_invoice as
        | Stripe.Invoice
        | undefined;
      const paymentIntent = invoice?.payments?.data?.[0]?.payment
        ?.payment_intent as Stripe.PaymentIntent | undefined;

      if (!paymentIntent)
        throw new HttpException(
          'Missing payment intent',
          HttpStatus.PAYMENT_REQUIRED,
        );

      return {
        subscription: updatedSubscription,
        clientSecret: paymentIntent.client_secret,
      };
    }

    async retrieveSubscription(subscriptionId: string) {
        return await this.stripeClient.subscriptions.retrieve(subscriptionId, { expand: ["schedule"] });
    }

    async updateSubscription(subscriptionId: string, itemId: string, quantity: number, idempotencyKey?: string) {
        return await this.stripeClient.subscriptions.update(
            subscriptionId,
            {
                items: [
                    {
                        id: itemId,
                        quantity: quantity,
                    },
                ],
                proration_behavior: "always_invoice",
                expand: ["latest_invoice.payments"],
                payment_behavior: "allow_incomplete",
            },
            { idempotencyKey: idempotencyKey ? `seats_${idempotencyKey}` : undefined },
        );
    }

    async createSchedule(subscriptionId: string, idempotencyKey?: string) {
        return await this.stripeClient.subscriptionSchedules.create(
            { from_subscription: subscriptionId },
            { idempotencyKey: idempotencyKey ? `schedule_${idempotencyKey}` : undefined },
        );
    }

    async updateSchedule(scheduleId: string, periodStart: number, periodEnd: number, subscriptionItem: Stripe.SubscriptionItem, currentQuantity: number, quantity: number, idempotencyKey?: string) {
        return await this.stripeClient.subscriptionSchedules.update(
            scheduleId,
            {
                end_behavior: "release",
                phases: [
                    {
                        start_date: periodStart,
                        end_date: periodEnd,
                        items: [{ price: subscriptionItem.price.id, quantity: currentQuantity}],
                    },
                    {
                        start_date: periodEnd,
                        items: [{ price: subscriptionItem.price.id, quantity: quantity }],
                    },
                ],
            },
            { idempotencyKey: idempotencyKey ? `schedule_update_${idempotencyKey}` : undefined },
        );
    }

    private handleStripeError(error: any) {
        if (!(error instanceof Stripe.errors.StripeError)) return new InternalServerErrorException("An unexpected error occurred", { cause: error });

        switch (error.type) {
            case "StripeCardError":
                return;
            case "StripeInvalidRequestError":
                return;
            case "StripeAuthenticationError":
                return;
            case "StripeRateLimitError":
                return;
            default:
                return new InternalServerErrorException("An unexpected error occurred", { cause: error });
        }
    }
}
