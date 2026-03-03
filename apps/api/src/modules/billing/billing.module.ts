import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { OrganisationsModule } from '../organisations/organisations.module';
import { BillingController } from './billing.controller';
import { StripeService } from './stripe.service';
import { StripeProvider } from 'src/common/stripe/stripe.provider';
import { StripeWebhookController } from './stripe-webhook.controller';
import { StripeWebhookService } from './stripe-webhook.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [OrganisationsModule, UsersModule],
  providers: [
    BillingService,
    StripeService,
    StripeProvider,
    StripeWebhookService,
  ],
  controllers: [BillingController, StripeWebhookController],
  exports: [BillingService],
})
export class BillingModule {}
