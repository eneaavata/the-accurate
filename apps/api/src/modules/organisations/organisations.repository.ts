import { Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "src/common/supabase/types/supabase.types";

@Injectable()
export class OrganisationsRepository {
    constructor(
        @Inject("SUPABASE_USER") private readonly userClient: SupabaseClient,
        @Inject("SUPABASE_ADMIN") private readonly adminClient: SupabaseClient,
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
        const { data, error } = await this.adminClient.rpc("create_organisation", {
            p_org_name: name,
            p_user_id: userId,
            p_user_email: email,
            p_stripe_customer_id: customerId,
            p_stripe_subscription_id: subscriptionId,
            p_trial_available: trialAvailable,
            p_trial_ends_at: trialEnd,
            p_subscription_ends_at: subscriptionEnd,
        });

        if (error) throw new InternalServerErrorException("Failed to create organisation", { cause: error });

        return data;
    }

    async getHasEverPaid(stripeCustomerId: string) {
        const { data, error } = await this.userClient
            .from("organisations")
            .select("has_ever_paid")
            .eq("stripe_customer_id", stripeCustomerId)
            .single();

        if (error) throw new NotFoundException("Organisation not found", { cause: error });

        return data.has_ever_paid;
    }

    async getBillingDetails(organisationId: string) {
        const { data, error } = await this.userClient
            .from("organisations")
            .select("stripe_subscription_id, billing_status")
            .eq("id", organisationId)
            .single();

        if (error) throw new NotFoundException("Organisation not found", { cause: error });

        return data;
    }

    async update(
        idType: "id" | "stripe_customer_id" | "stripe_subscription_id", 
        idValue: string, 
        updates: Database["public"]["Tables"]["organisations"]["Update"]
    ) {
        const { error } = await this.adminClient
            .from("organisations")
            .update(updates)
            .eq(idType, idValue);

        if (error) throw new NotFoundException("Organisation not found", { cause: error });
    }

    async delete(
        idType: "id" | "stripe_customer_id" | "stripe_subscription_id",
        idValue: string,
    ) {
        const { error } = await this.adminClient
            .from("organisations")
            .delete()
            .eq(idType, idValue);

        if (error) throw new NotFoundException("Organisation not found", { cause: error });
    }
}