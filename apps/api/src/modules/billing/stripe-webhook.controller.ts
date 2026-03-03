import { Req, Res, Controller, Post, Headers } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Stripe } from 'stripe';
import { StripeWebhookService } from './stripe-webhook.service';

@Controller('billing/stripe')
export class StripeWebhookController {
  constructor(private readonly stripeWebhookService: StripeWebhookService) {}

  @Post('webhook')
  async handleStripeWebhook(
    @Req() req: FastifyRequest & { rawBody: Buffer },
    @Res() reply: FastifyReply,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: Stripe.Event;

    try {
      event = this.stripeWebhookService.constructEvent(req.rawBody, signature);
    } catch (err) {
      return reply.status(400).send('Invalid signature');
    }

    await this.stripeWebhookService.handleWebhookEvent(event);

    return reply.status(200).send({ received: true });
  }
}
