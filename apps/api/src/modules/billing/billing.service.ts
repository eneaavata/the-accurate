import {
  Injectable,
  BadGatewayException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  ServiceUnavailableException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { OrganisationsService } from '../organisations/organisations.service';
import { StripeService } from './stripe.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class BillingService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly organisationsService: OrganisationsService,
    private readonly usersService: UsersService,
  ) {}

  async createOrganisation(user: User, name: string, idempotencyKey: string) {
    let trialAvailable: boolean;
    try {
      trialAvailable = await this.usersService.consumeTrial();
    } catch (error) {
      throw new ServiceUnavailableException(
        'Failed to verify trial availability',
        { cause: error },
      );
    }

    let customer: Stripe.Customer;
    try {
      customer = await this.stripeService.createCustomer(
        user.email,
        name,
        idempotencyKey,
      );
    } catch (error) {
      if (trialAvailable) await this.usersService.safeGiveTrial(user.id);
      throw new BadGatewayException('Failed to create customer', {
        cause: error,
      });
    }

    let subscription: Stripe.Subscription;
    try {
      subscription = await this.stripeService.createSubscription(
        customer.id,
        trialAvailable,
        idempotencyKey,
      );
    } catch (error) {
      await this.stripeService.safeDeleteCustomer(customer.id);
      if (trialAvailable) await this.usersService.safeGiveTrial(user.id);
      throw new BadGatewayException('Failed to create subscription', {
        cause: error,
      });
    }

    const invoice = subscription.latest_invoice as Stripe.Invoice | undefined;
    const paymentIntent = invoice?.payments?.data?.[0]?.payment
      ?.payment_intent as Stripe.PaymentIntent | undefined;

    if (!trialAvailable && !paymentIntent) {
      await this.stripeService.safeDeleteCustomer(customer.id);
      throw new HttpException(
        'Missing payment intent',
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    let organisationId: string;
    try {
      organisationId = await this.organisationsService.create(
        name,
        user.id,
        user.email,
        customer.id,
        subscription.id,
        trialAvailable,
        subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : undefined,
        subscription.items.data[0].current_period_end
          ? new Date(
              subscription.items.data[0].current_period_end * 1000,
            ).toISOString()
          : undefined,
      );
    } catch (error) {
      await this.stripeService.safeDeleteCustomer(customer.id);
      if (trialAvailable) await this.usersService.safeGiveTrial(user.id);
      throw new InternalServerErrorException('Failed to create organisation', {
        cause: error,
      });
    }

    return {
      organisationId: organisationId,
      clientSecret: trialAvailable ? null : paymentIntent.client_secret,
    };
  }

  async updateSeats(
    organisationId: string,
    seats: number,
    idempotencyKey?: string,
  ) {
    if (!Number.isInteger(seats) || seats < 1)
      throw new BadRequestException('Seats must be a positive integer');

    const {
      stripe_subscription_id: subscriptionId,
      billing_status: billingStatus,
    } = await this.organisationsService.getBillingDetails(organisationId);

    let subscription: Stripe.Subscription;
    try {
      subscription =
        await this.stripeService.retrieveSubscription(subscriptionId);
    } catch (error) {
      throw new NotFoundException('Subscription not found', { cause: error });
    }

    const subscriptionItem = subscription.items.data[0];

    if (!subscriptionItem)
      throw new InternalServerErrorException(
        `No subscription item found for subscription: ${subscriptionId}`,
      );

    const currentQuantity = subscriptionItem.quantity ?? 0;

    if (seats === currentQuantity) return { subscription };

    if (seats > currentQuantity) {
      if (billingStatus !== 'active')
        throw new BadRequestException(
          'Can only increase seats for active subscriptions',
        );

      const updatedSubscription = await this.stripeService.updateSubscription(
        subscriptionId,
        subscriptionItem.id,
        seats,
        idempotencyKey,
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

    const periodStart = subscriptionItem.current_period_start;
    const periodEnd = subscriptionItem.current_period_end;

    if (!periodStart || !periodEnd)
      throw new InternalServerErrorException(
        `Missing billing period timestamps for subscription: ${subscriptionId}`,
      );

    let scheduleId =
      typeof subscription.schedule === 'string'
        ? subscription.schedule
        : subscription.schedule?.id;

    if (!scheduleId) {
      const schedule = await this.stripeService.createSchedule(
        subscriptionId,
        idempotencyKey,
      );

      scheduleId = schedule.id;
    }

    const updatedSchedule = await this.stripeService.updateSchedule(
      scheduleId,
      periodStart,
      periodEnd,
      subscriptionItem,
      currentQuantity,
      seats,
      idempotencyKey,
    );

    return {
      subscription,
      schedule: updatedSchedule,
    };
  }
}
