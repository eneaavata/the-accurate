import { Injectable } from '@nestjs/common';
import { OrganisationsRepository } from './organisations.repository';
import { Database } from 'src/common/supabase/types/supabase.types';

@Injectable()
export class OrganisationsService {
  constructor(
    private readonly organisationsRepository: OrganisationsRepository,
  ) {}

  async create(
    name: string,
    userId: string,
    email: string,
    customerId: string,
    subscriptionId: string,
    trialAvailable: boolean,
    trialEnd?: string,
    subscriptionEnd?: string,
  ) {
    return await this.organisationsRepository.create(
      name,
      userId,
      email,
      customerId,
      subscriptionId,
      trialAvailable,
      trialEnd,
      subscriptionEnd,
    );
  }

  async getHasEverPaid(stripeCustomerId: string) {
    return await this.organisationsRepository.getHasEverPaid(stripeCustomerId);
  }

  async getBillingDetails(organisationId: string) {
    return await this.organisationsRepository.getBillingDetails(organisationId);
  }

  async update(
    idType: 'id' | 'stripe_customer_id' | 'stripe_subscription_id',
    idValue: string,
    updates: Database['public']['Tables']['organisations']['Update'],
  ) {
    return await this.organisationsRepository.update(idType, idValue, updates);
  }

  async delete(
    idType: 'id' | 'stripe_customer_id' | 'stripe_subscription_id',
    idValue: string,
  ) {
    return await this.organisationsRepository.delete(idType, idValue);
  }
}
